/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

// Polyfill globalThis.crypto for Azure SDK compatibility
// Electron 22 uses Node.js 16 which doesn't have globalThis.crypto by default
import * as crypto from 'crypto';
if (typeof globalThis.crypto === 'undefined') {
    (globalThis as any).crypto = crypto.webcrypto; // tslint:disable-line:no-any
}

import { app, Menu, BrowserWindow, dialog, ipcMain, session, shell } from 'electron';
import * as windowState from 'electron-window-state';
import * as path from 'path';
import { generateMenu } from './factories/menuFactory';
import { PLATFORMS, MESSAGE_CHANNELS } from './constants';
import { onSettingsHighContrast } from './handlers/settingsHandler';
import {
    deleteCredential,
    getCredential,
    isEncryptionAvailable,
    listCredentials,
    storeCredential
} from './handlers/credentialsHandler';
import { handleDataPlaneRequest } from './handlers/dataPlaneHandler';
import { handleReadLocalFile, handleReadLocalFileNaive, handleGetDirectories } from './handlers/fileHandler';
import { handleStartEventHubMonitoring, handleStopEventHubMonitoring, setMainWindow } from './handlers/eventHubHandler';
import { formatError } from './utils/errorHelper';
import { AuthProvider } from './utils/authProvider';

// Check if running in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Content Security Policy for the application
const CSP_HEADER = [
    "default-src 'self' https://login.live.com https://login.microsoftonline.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://aadcdn.msauth.net https://login.live.com", // unsafe-eval needed for webpack dev
    "style-src 'self' 'unsafe-inline' https://aadcdn.msauth.net", // Fluent UI uses inline styles
    "img-src 'self' data: https://aadcdn.msauth.net https://aadcdn.msauthimages.net https://login.microsoftonline.com https://login.live.com https://*.microsoft.com https://*.azure.com",
    "font-src 'self' https://*.cdn.office.net data:",
    "connect-src 'self' https://api.github.com/repos/Azure/azure-iot-explorer/releases/latest https://*.azure.com https://*.microsoft.com https://*.azure-devices.net https://*.servicebus.windows.net https://login.microsoftonline.com https://login.live.com https://aadcdn.msauth.net https://aadcdn.msauthimages.net" + (isDevelopment ? " ws://localhost:* http://localhost:*" : ""),
    "frame-src 'self' https://login.microsoftonline.com https://login.live.com https://*.microsoft.com",
    "frame-ancestors 'self' https://login.microsoftonline.com https://login.live.com https://*.microsoft.com",
    "form-action 'self' https://*.login.microsoftonline.com https://login.microsoftonline.com https://login.live.com",
    "base-uri 'self'"
].join('; ');

// Allowed origins for navigation and IPC sender validation
const ALLOWED_ORIGINS = isDevelopment
    ? ['http://localhost:3000']
    : [`file://${path.resolve(__dirname, '/../dist').replace(/\\/g, '/')}`];

// Allowed navigation URLs for authentication flows
const ALLOWED_AUTH_ORIGINS = [
    'https://login.microsoftonline.com',
    'https://login.live.com'
];

// Allowed external URLs that can be opened with shell.openExternal
const ALLOWED_EXTERNAL_URLS = [
    'https://github.com/Azure/azure-iot-explorer',
    'https://docs.microsoft.com',
    'https://azure.microsoft.com',
    'https://portal.azure.com'
];

class Main {
    private static application: Electron.App;
    private static mainWindow: BrowserWindow;
    private static readonly target = path.join(__dirname, '/../dist/index.html');
    private static authProvider: AuthProvider;

    public static start() {
        Main.application = app;
        Main.application.on('window-all-closed', Main.onAllWindowClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onActivate);
        Main.application.on('second-instance', Main.onSecondInstance);
    }

    private static setMessageHandlers(): void {
        Main.registerHandler(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST, onSettingsHighContrast);
        Main.registerHandler(MESSAGE_CHANNELS.AUTHENTICATION_LOGIN, Main.onLogin);
        Main.registerHandler(MESSAGE_CHANNELS.AUTHENTICATION_LOGOUT, Main.onLogout);
        Main.registerHandler(MESSAGE_CHANNELS.AUTHENTICATION_GET_PROFILE_TOKEN, Main.onGetProfileToken);

        // Credential storage IPC handlers
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_STORE, Main.onCredentialStore);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_GET, Main.onCredentialGet);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_DELETE, Main.onCredentialDelete);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_LIST, Main.onCredentialList);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_IS_ENCRYPTION_AVAILABLE, Main.onCredentialIsEncryptionAvailable);

        // Data Plane IPC handler (replaces HTTP server)
        Main.registerHandler(MESSAGE_CHANNELS.DATA_PLANE_REQUEST, handleDataPlaneRequest);

        // File operations IPC handlers (replaces HTTP server)
        Main.registerHandler(MESSAGE_CHANNELS.READ_LOCAL_FILE, handleReadLocalFile);
        Main.registerHandler(MESSAGE_CHANNELS.READ_LOCAL_FILE_NAIVE, handleReadLocalFileNaive);
        Main.registerHandler(MESSAGE_CHANNELS.GET_DIRECTORIES, handleGetDirectories);

        // EventHub IPC handlers (replaces HTTP server + WebSocket)
        Main.registerHandler(MESSAGE_CHANNELS.EVENTHUB_START_MONITORING, handleStartEventHubMonitoring);
        Main.registerHandler(MESSAGE_CHANNELS.EVENTHUB_STOP_MONITORING, handleStopEventHubMonitoring);
    }

    private static async loadTarget(redirect?: string): Promise<void> {
        if (isDevelopment) {
            // In development, load from webpack-dev-server
            Main.mainWindow.loadURL(`http://localhost:3000${redirect ? `?redirect=${redirect}` : ''}`);
        } else {
            Main.mainWindow.loadFile(Main.target, { query: { redirect: redirect || '' } });
        }
    }

    private static async onLogin(): Promise<void> {
        await Main.authProvider.login(Main.mainWindow);
        await Main.loadTarget();
    }

    private static async onLogout(): Promise<void> {
        await Main.authProvider.logout();
        await Main.loadTarget();
    }

    private static async onGetProfileToken(): Promise<string> {
        const token = await Main.authProvider.getProfileTokenIfPresent();
        return token;
    }

    // Credential storage handlers
    private static onCredentialStore(_: Electron.IpcMainInvokeEvent, key: string, value: string, encryptedData: string | null): string | null {
        return storeCredential(key, value, encryptedData);
    }

    private static onCredentialGet(_: Electron.IpcMainInvokeEvent, key: string, encryptedData: string | null): string | null {
        return getCredential(key, encryptedData);
    }

    private static onCredentialDelete(_: Electron.IpcMainInvokeEvent, key: string, encryptedData: string | null): string | null {
        return deleteCredential(key, encryptedData);
    }

    private static onCredentialList(_: Electron.IpcMainInvokeEvent, encryptedData: string | null): string[] {
        return listCredentials(encryptedData);
    }

    private static onCredentialIsEncryptionAvailable(): boolean {
        return isEncryptionAvailable();
    }

    private static setApplicationLock(): void {
        const lock = Main.application.requestSingleInstanceLock();
        if (!lock) {
            app.quit();
        }
    }

    private static setErrorBoundary(): void {
        process.on('uncaughtException', async (error: Error) =>
            dialog.showMessageBox({
                message: error?.message || 'Something went wrong. Please try restarting the app.',
                title: 'Error in controller process',
                type: 'error',
            })
        );
    }

    private static onSecondInstance(): void {
        if (Main.mainWindow) {
            if (Main.mainWindow.isMinimized()) {
                Main.mainWindow.restore();
            }
            Main.mainWindow.focus();
        }
    }

    private static onReady(): void {
        // Set Content Security Policy headers for all requests
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': [CSP_HEADER]
                }
            });
        });

        // Security: Handle permission requests from web content (Recommendation #5)
        // Deny all permissions by default - this app doesn't need camera, microphone, etc.
        session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
            // Log permission requests for debugging
            console.log(`Permission requested: ${permission} from ${webContents.getURL()}`); // tslint:disable-line:no-console
            // Deny all permissions - this app doesn't need browser permissions
            callback(false);
        });

        // Security: Restrict navigation to prevent malicious redirects (Recommendation #13)
        app.on('web-contents-created', (_, contents) => {
            contents.on('will-navigate', (event, navigationUrl) => {
                const parsedUrl = new URL(navigationUrl);
                const isAllowedOrigin = ALLOWED_ORIGINS.some(origin => {
                    const allowedUrl = new URL(origin);
                    return parsedUrl.origin === allowedUrl.origin;
                }) || parsedUrl.protocol === 'file:';

                // Allow navigation to auth providers (including subdomains like *.login.microsoftonline.com)
                const isAllowedAuth = ALLOWED_AUTH_ORIGINS.some(origin =>
                    parsedUrl.origin === origin
                ) || parsedUrl.hostname.endsWith('.login.microsoftonline.com');

                if (!isAllowedOrigin && !isAllowedAuth) {
                    console.log(`Blocked navigation to: ${navigationUrl}`); // tslint:disable-line:no-console
                    event.preventDefault();
                }
            });

            // Security: Restrict new window creation (Recommendation #14)
            contents.setWindowOpenHandler(({ url }) => {
                // Check if URL is in the allowed external URLs list
                const isAllowedExternal = ALLOWED_EXTERNAL_URLS.some(allowed =>
                    url.startsWith(allowed)
                );

                if (isAllowedExternal) {
                    // Open allowed URLs in the default browser
                    setImmediate(() => {
                        shell.openExternal(url);
                    });
                } else {
                    console.log(`Blocked window.open for: ${url}`); // tslint:disable-line:no-console
                }

                // Always deny creating new Electron windows
                return { action: 'deny' };
            });
        });

        Main.createMainWindow();
        Main.createMenu();
    }

    private static onActivate(): void {
        if (!Main.mainWindow) {
            Main.createMainWindow();
        }
    }

    private static onWindowClosed(): void {
        Main.mainWindow = null;
    }

    private static onAllWindowClosed(): void {
        if (process.platform !== PLATFORMS.MAC) {
            Main.application.quit();
        }
    }

    private static createMenu(): void {
        const menu = generateMenu({ platform: process.platform });
        Menu.setApplicationMenu(menu);
    }

    private static createMainWindow(): void {
        const mainWindowState = windowState({
            defaultHeight: 1200,
            defaultWidth: 900
        });

        // Construct absolute path to preload script
        const preloadPath = path.resolve(__dirname, 'contextBridge.js');
        // tslint:disable-next-line: no-console
        console.log('Preload script path:', preloadPath);

        Main.mainWindow = new BrowserWindow({
            height: mainWindowState.height,
            width: mainWindowState.width,
            webPreferences: { // tslint:disable-line:object-literal-sort-keys
                contextIsolation: true, // required for contextBridge to work
                nodeIntegration: false, // prevent direct Node.js access
                sandbox: true, // enable process sandboxing for stronger isolation
                preload: preloadPath
            },
        });

        mainWindowState.manage(Main.mainWindow);

        // Set the main window reference for EventHub handler
        setMainWindow(Main.mainWindow);

        if (isDevelopment) {
            // In development, load from webpack-dev-server
            Main.mainWindow.loadURL('http://localhost:3000');
            Main.mainWindow.webContents.openDevTools();
        } else {
            Main.mainWindow.loadFile(Main.target);
        }

        Main.mainWindow.on('closed', Main.onWindowClosed);

        Main.setErrorBoundary();
        Main.setApplicationLock();

        Main.authProvider = new AuthProvider();
        Main.setMessageHandlers();
    }

    // Security: Validate IPC sender origin (Recommendation #17)
    private static validateSender(event: Electron.IpcMainInvokeEvent): boolean {
        const senderUrl = event.senderFrame?.url;
        if (!senderUrl) {
            return false;
        }

        try {
            const parsedUrl = new URL(senderUrl);
            return ALLOWED_ORIGINS.some(origin => {
                const allowedUrl = new URL(origin);
                return parsedUrl.origin === allowedUrl.origin;
            }) || parsedUrl.protocol === 'file:';
        } catch {
            return false;
        }
    }

    // tslint:disable-next-line: no-any
    private static registerHandler(channel: string, handler: (...args: any[]) => any) {
        ipcMain.handle(channel, async (event, ...args) => {
            // Security: Validate IPC message sender (Recommendation #17)
            if (!Main.validateSender(event)) {
                console.log(`Blocked IPC from untrusted sender: ${event.senderFrame?.url}`); // tslint:disable-line:no-console
                return { error: { message: 'Unauthorized IPC sender' } };
            }

            try {
                return { result: await Promise.resolve(handler(event, ...args)) };
            } catch (e) {
                const error = formatError(e);
                return { error };
            }
        });
    }
}

Main.start();

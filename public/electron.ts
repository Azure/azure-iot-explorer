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

import { app, Menu, BrowserWindow, dialog, ipcMain, session } from 'electron';
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
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for webpack dev
    "style-src 'self' 'unsafe-inline'", // Fluent UI uses inline styles
    "img-src 'self' data: https:",
    "font-src 'self' https://*.cdn.office.net data:",
    "connect-src 'self' https://api.github.com/repos/Azure/azure-iot-explorer/releases/latest https://*.azure.com https://*.microsoft.com https://*.azure-devices.net https://*.servicebus.windows.net https://login.microsoftonline.com" + (isDevelopment ? " ws://localhost:* http://localhost:*" : ""),
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'"
].join('; ');

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
                sandbox: false, // allow preload script to load with require()
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

    // tslint:disable-next-line: no-any
    private static registerHandler(channel: string, handler: (...args: any[]) => any) {
        ipcMain.handle(channel, async (...args) => {
            try {
                return { result: await Promise.resolve(handler(...args)) };
            } catch (e) {
                const error = formatError(e);
                return { error };
            }
        });
    }
}

Main.start();

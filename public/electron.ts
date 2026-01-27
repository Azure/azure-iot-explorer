/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { app, Menu, BrowserWindow, dialog, ipcMain, session } from 'electron';
import * as windowState from 'electron-window-state';
import * as path from 'path';
import { generateMenu } from './factories/menuFactory';
import { PLATFORMS, MESSAGE_CHANNELS } from './constants';
import { onSettingsHighContrast } from './handlers/settingsHandler';
import {
    deleteCredential,
    getCredential,
    initializeCredentialsStorage,
    isEncryptionAvailable,
    listCredentials,
    storeCredential
} from './handlers/credentialsHandler';
import { formatError } from './utils/errorHelper';
import { AuthProvider } from './utils/authProvider';

// Module-level variable to hold the server instance
let serverModule: any = null;

// Content Security Policy for the application
const CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for webpack dev
    "style-src 'self' 'unsafe-inline'", // Fluent UI uses inline styles
    "img-src 'self' data: https:",
    "font-src 'self' https://*.cdn.office.net data:",
    "connect-src 'self' https://api.github.com/repos/Azure/azure-iot-explorer/releases/latest https://*.azure.com https://*.microsoft.com  https://*.azure-devices.net https://*.servicebus.windows.net https://login.microsoftonline.com wss://127.0.0.1:* https://127.0.0.1:*",
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
        Main.registerHandler(MESSAGE_CHANNELS.GET_CUSTOM_PORT, Main.onGetCustomPort);
        // Security-related IPC handlers
        Main.registerHandler(MESSAGE_CHANNELS.GET_API_AUTH_TOKEN, Main.onGetApiAuthToken);
        Main.registerHandler(MESSAGE_CHANNELS.GET_API_CERTIFICATE, Main.onGetApiCertificate);
        Main.registerHandler(MESSAGE_CHANNELS.GET_API_CERT_FINGERPRINT, Main.onGetApiCertFingerprint);
        // Credential storage IPC handlers
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_STORE, Main.onCredentialStore);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_GET, Main.onCredentialGet);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_DELETE, Main.onCredentialDelete);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_LIST, Main.onCredentialList);
        Main.registerHandler(MESSAGE_CHANNELS.CREDENTIAL_IS_ENCRYPTION_AVAILABLE, Main.onCredentialIsEncryptionAvailable);
    }

    private static async loadTarget(redirect?: string): Promise<void> {
        Main.mainWindow.loadFile(Main.target, { query: {redirect: redirect || ''} });
    }

    private static async onLogin(): Promise<void> {
        await Main.authProvider.login(Main.mainWindow)
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

    private static onGetCustomPort(): number | null {
        const customPort = parseInt(process.env.AZURE_IOT_EXPLORER_PORT, 10); // tslint:disable-line:radix
        if (Number.isInteger(customPort) && customPort > 0 && customPort < 65536) {
            return customPort;
        }
        return null;
    }

    private static onGetApiAuthToken(): string | null {
        const token = serverModule?.serverInstance?.getAuthToken() || null;
        return token;
    }

    private static onGetApiCertificate(): string | null {
        return serverModule?.serverInstance?.getCertificate() || null;
    }

    private static onGetApiCertFingerprint(): string | null {
        return serverModule?.serverInstance?.getCertificateFingerprint() || null;
    }

    // Credential storage handlers
    private static onCredentialStore(_: Electron.IpcMainInvokeEvent, key: string, value: string): boolean {
        return storeCredential(key, value);
    }

    private static onCredentialGet(_: Electron.IpcMainInvokeEvent, key: string): string | null {
        return getCredential(key);
    }

    private static onCredentialDelete(_: Electron.IpcMainInvokeEvent, key: string): boolean {
        return deleteCredential(key);
    }

    private static onCredentialList(): string[] {
        return listCredentials();
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
        // Initialize credential storage with app's user data path
        initializeCredentialsStorage(app.getPath('userData'));

        // Dynamically load the server module to get instance
        try {
            const serverPath = path.join(__dirname, '../dist/server/serverElectron.js');
            serverModule = require(serverPath);
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.error('Failed to load server module:', error);
        }

        // Trust the self-signed certificate from our local server
        // This handler is called when a certificate error occurs
        app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
            // tslint:disable-next-line: no-console
            console.log('Certificate error for URL:', url);
            // tslint:disable-next-line: no-console
            console.log('Certificate fingerprint:', certificate.fingerprint);
            
            // Only trust certificates from localhost/127.0.0.1 (both HTTPS and WSS)
            const isLocalhost = url.startsWith('https://127.0.0.1:') || 
                              url.startsWith('https://localhost:') ||
                              url.startsWith('wss://127.0.0.1:') ||
                              url.startsWith('wss://localhost:');
            
            if (isLocalhost && serverModule?.serverInstance) {
                // Get the expected certificate fingerprint from our server
                const expectedFingerprint = serverModule.serverInstance.getCertificateFingerprint();
                
                // Electron provides the fingerprint in base64 format with 'sha256/' prefix
                // Example: "sha256/sxBcIGTvSEonoBQQ9Vx72U29LTVfNoz8eRWcPkkXm5Q="
                // We need to convert it to hex with colons to match our format
                let actualFingerprint = certificate.fingerprint;
                if (actualFingerprint.startsWith('sha256/')) {
                    // Remove the 'sha256/' prefix and convert base64 to hex
                    const base64 = actualFingerprint.replace('sha256/', '');
                    const buffer = Buffer.from(base64, 'base64');
                    actualFingerprint = buffer.toString('hex').toUpperCase().match(/.{1,2}/g)?.join(':') || '';
                }
                
                // tslint:disable-next-line: no-console
                console.log('Expected fingerprint:', expectedFingerprint);
                // tslint:disable-next-line: no-console
                console.log('Actual fingerprint:', actualFingerprint);
                
                // Only trust if fingerprints match
                if (actualFingerprint === expectedFingerprint) {
                    // tslint:disable-next-line: no-console
                    console.log('Certificate fingerprint matches - trusting self-signed certificate');
                    event.preventDefault();
                    callback(true);
                    return;
                }
            }
            
            // Reject all other certificate errors
            // tslint:disable-next-line: no-console
            console.log('Certificate verification failed');
            callback(false);
        });

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

        Main.mainWindow.loadFile(Main.target);
        // Custom port is now handled via IPC (GET_CUSTOM_PORT channel) instead of executeJavaScript
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

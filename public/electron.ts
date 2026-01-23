/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { app, Menu, BrowserWindow, dialog, ipcMain } from 'electron';
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
import { SecureServerBase } from '../dist/server/serverSecure';

// Module-level secure server instance
let secureServer: SecureServerBase | null = null;

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
        return secureServer?.getAuthToken() || null;
    }

    private static onGetApiCertificate(): string | null {
        return secureServer?.getCertificate() || null;
    }

    private static onGetApiCertFingerprint(): string | null {
        return secureServer?.getCertificateFingerprint() || null;
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
        Main.mainWindow = new BrowserWindow({
            height: mainWindowState.height,
            width: mainWindowState.width,
            webPreferences: { // tslint:disable-line:object-literal-sort-keys
                contextIsolation: true, // protect against prototype pollution
                nodeIntegration: false,
                sandbox: true, // enable sandbox for additional security
                preload: __dirname + '/contextBridge.js' // use a preload script
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

/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { app, Menu, BrowserWindow, dialog, ipcMain, nativeTheme } from 'electron';
import * as path from 'path';
import { generateMenu } from './menu';
import { PLATFORMS, MESSAGE_CHANNELS } from './constants';

class Main {
    private static application: Electron.App;
    private static mainWindow: BrowserWindow;
    private static target = path.join(__dirname, '/../dist/index.html');

    public static start() {
        Main.application = app;
        Main.application.on('window-all-closed', Main.onAllWindowClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onActivate);
        Main.application.on('second-instance', Main.onSecondInstance);
    }

    private static setMessageHandlers(): void {
        ipcMain.handle(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST, Main.onSettingsHighContrast);
    };

    private static setApplicationLock(): void {
        const lock = Main.application.requestSingleInstanceLock();
        if (!lock) {
            app.quit();
        }
    }

    private static setErrorBoundary(): void {
        process.on('uncaughtException', (error: Error) =>
            dialog.showMessageBox({
                message: error?.message || 'Something went wrong. Please try restarting the app.',
                title: 'Error in controller process',
                type: 'error',
            })
        );
    }

    private static onSecondInstance(): void {
        if (Main.mainWindow) {
            if (this.mainWindow.isMinimized()) {
                this.mainWindow.restore();
            }
            Main.mainWindow.focus();
        }
    }

    private static onReady(): void {
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
        this.mainWindow = new BrowserWindow({
            width: 900,
            height: 1200,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true, // protect against prototype pollution
                enableRemoteModule: false, // turn off remote
                preload: __dirname + '/contextBridge.js' // use a preload script
            },
        });

        Main.mainWindow.loadFile(this.target);
        Main.mainWindow.on('closed', Main.onWindowClosed);

        Main.setErrorBoundary();
        Main.setApplicationLock();
        Main.setMessageHandlers();
    }

    private static onSettingsHighContrast(): Promise<boolean> {
        console.log('here we are in native');
        const highContrast = nativeTheme.shouldUseHighContrastColors;
        return Promise.resolve(highContrast);
    }
}

Main.start();

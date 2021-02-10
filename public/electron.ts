/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { app, Menu, BrowserWindow, dialog } from 'electron';
import * as path from 'path';
import { generateMenu } from './menu';
import { PLATFORMS } from './constants';

class Main {
    private static application: Electron.App;
    private static mainWindow: BrowserWindow;
    private static target = path.join(__dirname, '/../dist/index.html');

    public static start() {
        Main.application = app;
        Main.setErrorBoundary();
        Main.setApplicationLock();

        Main.application.on('window-all-closed', Main.onAllWindowClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onActivate);
        Main.application.on('second-instance', Main.onSecondInstance);
    }

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
            this.mainWindow.focus();
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

    private static async createMainWindow(): Promise<void> {
        Main.mainWindow = new BrowserWindow({
            width: 900,
            height: 1200,
            webPreferences: {
                nodeIntegration: false, // is default value after Electron v5
                contextIsolation: true, // protect against prototype pollution
                enableRemoteModule: false, // turn off remote
                // preload: __dirname  + '/contextBridge.js' // use a preload script
            },
        });

        Main.mainWindow.on('closed', Main.onWindowClosed);
        await Main.mainWindow.loadFile(this.target);
    }
}

Main.start();

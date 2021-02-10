/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { app, Menu, MenuItem, BrowserWindow, MenuItemConstructorOptions, shell } from "electron";
import { PLATFORMS } from './constants';

export interface GenerateMenuParameters {
    platform: string;
}

export const generateMenu = (params: GenerateMenuParameters): Menu => {
    const template: MenuItemConstructorOptions[] = [
        generateFileMenu(params),
        generateEditMenu(params),
        generateViewMenu(params),
        generateWindowMenu(params),
        generateHelpMenu(params)
    ];

    const menu = Menu.buildFromTemplate(template);
    return menu;
};

export const generateFileMenu = ({ platform }: GenerateMenuParameters): MenuItemConstructorOptions => {
    return {
        label: '&File',
        submenu: [
            platform === PLATFORMS.MAC ? { role: 'quit' } : { role: 'close' }
        ]
    };
};

export const generateEditMenu = (params: GenerateMenuParameters): MenuItemConstructorOptions => {
    return {
        label: '&Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
        ]
    };
}

export const generateViewMenu = (params: GenerateMenuParameters): MenuItemConstructorOptions => {
    return {
        label: '&View',
        submenu: [
            { role: 'reload' },
            { type: 'separator' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    };
}

export const generateWindowMenu = ({platform}: GenerateMenuParameters): MenuItemConstructorOptions => {
    return {
        label: '&Window',
        submenu: platform === PLATFORMS.MAC ? [
            { role: 'minimize' },
            { role: 'hide' },
            { role: 'close' }
        ] : [
            { role: 'minimize' },
            { role: 'close' }
        ]
    };
}

export const generateHelpMenu = (params: GenerateMenuParameters): MenuItemConstructorOptions => {
    return {
        label: '&Help',
        submenu: [
            {
                accelerator: 'CommandOrControl+Shift+I',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow, event: Event) => {
                    browserWindow.webContents.toggleDevTools();
                },
                label: 'Toggle Developer Tools'
            },
            { type: 'separator' },
            {
                click: () => {
                    const version = app.getVersion();
                    if (!!version) {
                    shell.openExternal(`https://github.com/Azure/azure-iot-explorer/releases/tag/v${version}`);
                    } else {
                            shell.openExternal(`https://github.com/Azure/azure-iot-explorer/releases`);
                    }
                },
                role: 'about'
            }
        ]
    };
}


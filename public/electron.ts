import * as electron from 'electron';
import * as path from 'path';
import * as url from 'url';
import '../dist/server/server';
// tslint:disable-next-line:no-var-requires
require('update-electron-app')();

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

let mainWindow: electron.BrowserWindow;

const createWindow = () => {

    mainWindow = new BrowserWindow({
        height: 900,
        width: 1200
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../dist/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    if (process.env.ELECTRON_START_URL) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => mainWindow = null);
};

const createMenu = () => {
    const template: electron.MenuItemConstructorOptions[] = [
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { type: 'separator' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    accelerator: 'CommandOrControl+Shift+I',
                    click: (menuItem: electron.MenuItem, browserWindow: electron.BrowserWindow, event: electron.Event) => {
                        browserWindow.webContents.toggleDevTools();
                    },
                    label: 'Toggle Developer Tools'
                },
                { type: 'separator' },
                { role: 'about'}
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

// prevent multiple instances in Electron
const lock = app.requestSingleInstanceLock();
if (!lock) {
    app.quit();
}
else {
    app.on('second-instance', () => {
        // If user tries to run a second instance, would focus on current window
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
    app.on('ready', () => {
        createWindow();
        createMenu();
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

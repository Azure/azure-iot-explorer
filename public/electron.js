
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const server = require('../src/server/server.js');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1200, height: 900});
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
    // Enable refresh shortcut
    const globalShortcut = electron.globalShortcut;
    globalShortcut.register('f5', function() {
		mainWindow.reload()
	})
	globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload()
	})
}

app.on('ready', () => {
    createWindow()
    createMenu()
})

function createMenu() {
    const template = [
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
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
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

import * as electron from 'electron';
import * as path from 'path';
import * as url from 'url';
import '../dist/server/serverElectron';

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

let mainWindow: electron.BrowserWindow;

const isMac = process.platform === 'darwin';
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

    const setHighContrast = () => {
        const highContrast = electron.nativeTheme.shouldUseHighContrastColors;
        if (highContrast) {
            mainWindow.webContents.executeJavaScript(`if (localStorage.getItem("HIGH_CONTRAST") != "true") { localStorage.setItem("HIGH_CONTRAST", true); location.reload();}`);
        } else {
            mainWindow.webContents.executeJavaScript('if (localStorage.getItem("HIGH_CONTRAST") != "false") { localStorage.setItem("HIGH_CONTRAST", false); location.reload();}');
        }
    };

    const setPort = () => {
        try {
            const customPort = parseInt(process.env.AZURE_IOT_EXPLORER_PORT); // tslint:disable-line:radix
            if (customPort) {
                mainWindow.webContents.executeJavaScript(`localStorage.setItem("CUSTOM_CONTROLLER_PORT", ${customPort});`);
            } else {
                mainWindow.webContents.executeJavaScript(`localStorage.setItem("CUSTOM_CONTROLLER_PORT", '');`);
            }
        }
        catch {
            // no port to set
        }
    };

    mainWindow.loadURL(startUrl).then(() => {
        setHighContrast();
        setPort();
    });

    electron.nativeTheme.on('updated', () => {
        setHighContrast();
    });

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
            label: '&File',
            submenu: [
                isMac ? { role: 'quit' } : { role: 'close' }
            ]
        },
        // { role: 'editMenu' }
        {
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
        },
        // { role: 'viewMenu' }
        {
            label: '&View',
            submenu: [
                { role: 'reload' },
                { type: 'separator' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: '&Window',
            submenu: isMac ? [
                { role: 'minimize' },
                { role: 'hide' },
                { role: 'close' }
            ] : [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: '&Help',
            submenu: [
                {
                    accelerator: 'CommandOrControl+Shift+I',
                    click: (menuItem: electron.MenuItem, browserWindow: electron.BrowserWindow, event: electron.Event) => {
                        browserWindow.webContents.toggleDevTools();
                    },
                    label: 'Toggle Developer Tools'
                },
                { type: 'separator' },
                {
                    click: () => {
                        const version = electron.app.getVersion();
                        if (!!version) {
                        electron.shell.openExternal(`https://github.com/Azure/azure-iot-explorer/releases/tag/v${version}`);
                        } else {
                                electron.shell.openExternal(`https://github.com/Azure/azure-iot-explorer/releases`);
                        }
                    },
                    role: 'about'
                }
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
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

'use strict';

import { app, protocol, BrowserWindow, ipcMain, Menu, dialog, globalShortcut } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import slash from 'slash';
const isDevelopment = process.env.NODE_ENV !== 'production';
const APPNAME = '新媒体营销 1+X认证';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);
app.setName(APPNAME);

var force_quit = false;
var mainWindow = null;
var menuTemplate = [
    {
        label: app.name,
        submenu: [
            {
                label: `关于${app.name}`,
                accelerator: 'CommandOrControl+O',
                click: () => {
                    dialog.showMessageBox({
                        message: '联创新世纪',
                        type: 'info',
                    });
                },
            },
            {
                label: '退出',
                accelerator: 'CommandOrControl+Q',
                click: () => {
                    force_quit = true;
                    app.quit();
                },
            },
        ],
    },
];

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
            preload: __static + '/preload.js',
        },
    });

    var menuBuilder = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menuBuilder);

    mainWindow.maximize();
    mainWindow.show();
    mainWindow.on('close', (e) => {
        console.log('==>window close');
        if (!force_quit) {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    onListen();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
        mainWindow.webContents.openDevTools();
    } else {
        createProtocol('app');
        mainWindow.loadURL('app://./index.html');
    }

    // if (process.env.WEBPACK_DEV_SERVER_URL) {
    //     await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    //     if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    //     mainWindow.webContents.openDevTools();
    // } else {
    //     createProtocol('app');
    //     mainWindow.loadURL('app://./index.html');
    // }
}

app.whenReady().then(() => {
    globalShortcut.register('f5', function () {
        console.log('f5 is pressed');
    });

    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed');
    });

    globalShortcut.register('CommandOrControl+Shift+i', function () {
        mainWindow.webContents.openDevTools();
    });
});

app.on('ready', async () => {
    console.log('==>ready');
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

app.on('activate', () => {
    console.log('==>activate');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

app.on('before-quit', function (e) {
    console.log('==>before-quit');
    force_quit = true;
});

app.on('will-quit', function () {
    console.log('==>will-quit');
    mainWindow = null;
});

app.on('window-all-closed', () => {
    console.log('==>window-all-closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function onListen() {
    ipcMain.on('userdata-path', () => {
        mainWindow.webContents.send('userdata-path', app.getPath('userData'));
    });
}

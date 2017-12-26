/* eslint global-require: 0 */

import { app, BrowserWindow, dialog, ipcMain, globalShortcut, Menu } from 'electron';
import MenuBuilder from './menu';
require('./server/models/db');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

// function createWindow() {
//     var mainWindow = new BrowserWindow({
//         width: 1024,
//         height: 728,
//         frame: false,
//     });
//     mainWindow.loadURL(winURL);
//     mainWindow.on('closed', () => {
//         mainWindow = null
//     });
//     //前期为了调试方面，默认打开控制台
//     mainWindow.webContents.openDevTools({ detach: true });
//     //注册打开控制台的快捷键
//     globalShortcut.register('ctrl+shift+alt+e', function () {
//         let win = BrowserWindow.getFocusedWindow();
//         if (win) {
//             win.webContents.openDevTools({ detach: true });
//         }
//     });
//     //去掉默认菜单栏
//     Menu.setApplicationMenu(null);
//     // eslint-disable-next-line no-console
//     console.log('mainWindow opened');
//    //添加这段代码
//     BrowserWindow.mainWindow = mainWindow;
//     return mainWindow;
// }

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

ipcMain.on('cache-dbname', (evt, data) => {
})

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('abcd', () => {
  console.log('abcd')
})


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame: false,
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('open', () => {
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  //去掉默认菜单栏
  Menu.setApplicationMenu(null);
  // eslint-disable-next-line no-console
  console.log('mainWindow opened');
 //添加这段代码
  //BrowserWindow.mainWindow = mainWindow;
});

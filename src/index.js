const { BrowserWindow, app, ipcMain } = require('electron');
const path = require('path');

// Import new dependencies
const fixPath = require('fix-path');
const isElevated = require('native-is-elevated');
const sudoPrompt = require('@vscode/sudo-prompt');
const { exec } = require('child_process');

// Ensure Electron apps subprocess on macOS and Linux inherit system $PATH
fixPath();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('getAppPath', () => {
  console.log('getAppPath');
  return app.getAppPath();
});

// Modified version of VSCode isAdmin() method
// https://github.com/microsoft/vscode/blob/main/src/vs/platform/native/electron-main/nativeHostMainService.ts#L480
ipcMain.handle('isAdmin', () => {
  console.log('isAdmin');
  let isAdmin;
  if (process.platform === 'win32') {
    isAdmin = isElevated();
  } else {
    isAdmin = process.getuid() === 0;
  }
  return isAdmin;
});

// Run a simple command without elevated privileges
ipcMain.handle('runProcess', async (event, command) => {
  console.log('runProcess', command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        console.log('runProcess', stdout);
      }
      if (stderr) {
        console.log('runProcess', stderr);
      }
      if (error) {
        reject(error);
      } else {
        resolve(stdout.toString());
      }
    });
  });
});


// Modified version of VSCode writeElevated() method 
// https://github.com/microsoft/vscode/blob/main/src/vs/platform/native/electron-main/nativeHostMainService.ts#L491
ipcMain.handle('runProcessElevated', async (event, command) => {
  console.log('runProcessElevated', command);
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(command, { name: 'Electron Runas Admin' }, (error, stdout, stderr) => {
      if (stdout) {
        console.log('runProcessElevated', stdout);
      }
      if (stderr) {
        console.log('runProcessElevated', stderr);
      }
      if (error) {
        reject(error);
      } else {
        resolve(stdout.toString());
      }
    });
  });
});

const { app, ipcRenderer } = require('electron');

function getAppPath() {
  return ipcRenderer.invoke('getAppPath');
}

function isAdmin() {
  return ipcRenderer.invoke('isAdmin');
}

async function runProcess(command) {
  return ipcRenderer.invoke('runProcess', command);
}

async function runProcessElevated(command) {
  return ipcRenderer.invoke('runProcessElevated', command);
}

module.exports = {
  getAppPath,
  isAdmin,
  runProcess,
  runProcessElevated
};

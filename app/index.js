const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const menu = require('./menu');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let window;
let renderer_ready = false;

// Auto updater handling and signaling

function sendStatusToWindow(statusmsg) {
	if(renderer_ready) {
		window.webContents.send('updater-status', statusmsg);
	};
}
autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
	sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
	sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
	sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
	let log_message = "Download speed: " + formatSpeed(progressObj.bytesPerSecond);
	log_message = log_message + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%';
	log_message = log_message + ' (' + formatSize(progressObj.transferred) + "/" + formatSize(progressObj.total) + ')';
	sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
	sendStatusToWindow('Update downloaded. Quit to let it install.');
});

// On ready

app.on('ready', () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	window.loadFile('index.html');

	// window.openDevTools();

	autoUpdater.checkForUpdatesAndNotify();

	window.webContents.on('did-finish-load', () => {
		window.webContents.send('version', {version: app.getVersion()});
		renderer_ready = true;
	})
});

Menu.setApplicationMenu(menu);

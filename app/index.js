const { app, BrowserWindow, Menu } = require('electron');
const menu = require('./menu');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let window;

app.on('ready', function()  {
	autoUpdater.checkForUpdatesAndNotify();
});

app.on('ready', () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});
	window.loadFile('index.html');
	window.openDevTools();

	console.log(`Running version ${app.getVersion()}`);
});

Menu.setApplicationMenu(menu);

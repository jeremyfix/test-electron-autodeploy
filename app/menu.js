const { BrowserWindow, app, Menu, shell} = require('electron');
const { ipcMain } = require('electron');
const { globalShortcut }= require('electron');
const { dialog  } = require('electron');
const fs = require("fs");

const template = [
	{
		label: 'File', 
		submenu : [
			{
				label: 'Open',
				click() {
					onload();
				}
			},
			{
				label: 'Save',
				click() {
					onsave();
				}
			}
		]
	},
	{
		role: 'help',
		submenu: [ 
			{
				label: "About Editor Component",
				click() {
					shell.openExternal('https://simplemde.com');
				}
			}
		]
	},
	{
		label: 'Format',
		submenu: [
			{
				label: 'Toggle Bold',
				accelerator: 'Alt+B',
				click() {
					const window = BrowserWindow.getFocusedWindow();
					window.webContents.send(
						'editor-event',
						'toggle-bold'
					);
				}
			},
			{
				label: 'Toggle Italic',
				accelerator: 'Alt+I',
				click() {
					const window = BrowserWindow.getFocusedWindow();
					window.webContents.send(
						'editor-event',
						'toggle-italic'
					);
				}
			}
		]
	}
];

if (process.platform == 'darwin') {
	template.unshift({
		label: app.getName(),
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	})
}

if (process.env.DEBUG) {
	template.push(
	{
		label: 'Debugging',
		submenu: [
			{
				label: "Dev Tools",
				role: 'toggleDevTools'
			},
			{ type: 'separator' },
			{ 
				role: 'reload' ,
				accelerator: 'Alt+R'
			}
		]
	});
}

const menu = Menu.buildFromTemplate(template);

ipcMain.on('editor-reply', function onmessage (event, arg) {
	console.log(`Received reply from web page ${arg}`);
});

function processSave(fileobj, content) {
	console.log("Saving to disk");
	console.log(`Wanna save to ${fileobj.filePath}`);
	console.log(`canceled ? ${fileobj.canceled}`);
	if(fileobj.filePath) {
		fs.writeFileSync(fileobj.filePath, content);
	}
}

ipcMain.on('save', function onsave (event, arg) {
	console.log(`Received reply from web page ${arg}`);
	const window = BrowserWindow.getFocusedWindow();
	const options = {
		title: 'Save markdown file',
		filters: [
			{
				name : 'Markdown files',
				extensions: ['md']
			}
		]
	};
	dialog.showSaveDialog(window, options).then(fileobj => processSave(fileobj, arg));
});

function onsave() {
	// Send a request to the MDE renderer to save the content
	console.log("Saving the file");
	const window = BrowserWindow.getFocusedWindow();
	window.webContents.send(
		'editor-event',
		'save'
	);
}

function sendLoadToMain(err, data) {
	console.log(`Got ${data}`);
	const window = BrowserWindow.getFocusedWindow();
	window.webContents.send(
		'load',
		data
	);

}

function onload() {
	// Send a request to the MDE renderer to save the content
	console.log("Loading a file");
	const options = {
		title: 'Load markdown file',
		filters: [
			{
				name : 'Markdown files',
				extensions: ['md']
			}
		]
	};

	const window = BrowserWindow.getFocusedWindow();
	dialog.showOpenDialog(window, options).then(fileobj => {
		if(fileobj.filePaths) 
			fs.readFile(fileobj.filePaths[0], 'utf8', sendLoadToMain);
	});
}

app.on('ready', function setupshortcut() {
	globalShortcut.register('CommandOrControl+S', onsave);
	globalShortcut.register('CommandOrControl+O', onload);
});

module.exports = menu;

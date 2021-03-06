const {
	contextBridge,
	ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld(
	"api", {
		send: (channel, data) => {
			let validChannels = ["editor-reply", "editor-event", "load", "version", "updater-status"];
			if (validChannels.includes(channel)) {
				ipcRenderer.send(channel, data);
			}
		},
		receive: (channel, func) => {
			let validChannels = ["editor-event", "load", "version", "updater-status"];
			if(validChannels.includes(channel)) {
				ipcRenderer.on(channel, func);
			}
		}
	}
);

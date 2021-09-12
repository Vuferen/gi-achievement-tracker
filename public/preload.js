const { contextBridge, ipcRenderer } = require("electron");

const validChannels = ["ERROR", "THEME", "READ_FILE", "WRITE_FILE", "GET_ACHIEVEMENTS", "APP_CLOSE", "APP_MAXIMIZE", "APP_MINIMIZE"];
contextBridge.exposeInMainWorld("ipc", {
	send: (channel, data) => {
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},
	on: (channel, func) => {
		if (validChannels.includes(channel)) {
			// Strip event as it includes `sender` and is a security risk
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},
});

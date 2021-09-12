"use strict";

import { app, protocol, BrowserWindow, remote, ipcMain, nativeTheme, Tray } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";

const path = require("path");
// const electron = require("electron");
const fs = require("fs");
const YAML = require("yaml");

const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");

const userDataPath = (app || remote.app).getPath("userData");

// let achievementsUpToDate = [];

// puppeteer
// use: Array.from(document.querySelectorAll('tbody tr'), tr => {let tds = tr.querySelectorAll('td'); if (tds.length >= 4) { return {name: tds[0].innerText, description: tds[1].innerText, requirements: tds[2].innerText, primogems: tds[3].innerText}}})
// with category:
// Array.from(document.querySelectorAll(".mw-parser-output > h3"), (h3) => {
// 	let category = h3.innerText;
// 	return Array.from(h3.nextElementSibling.nextElementSibling.querySelectorAll("tbody tr"), (tr) => {
// 		let tds = tr.querySelectorAll("td");
// 		if (tds.length >= 4) {
// 			return {
// 				category: category,
// 				name: tds[0].innerText,
// 				description: tds[1].innerText,
// 				requirements: tds[2].innerText,
// 				primogems: tds[3].innerText,
// 			};
// 		}
// 	});
// });
async function initializePie() {
	await pie.initialize(app);
}
initializePie();

const puppeteerMain = async () => {
	// return "hey";
	const browser = await pie.connect(app, puppeteer);

	const window = new BrowserWindow({ show: false });
	const url = "https://genshin-impact.fandom.com/wiki/Wonders_of_the_World";
	await window.loadURL(url);
	const page = await pie.getPage(browser, window);

	// page.waitForSelector("tbody", { timeout: 10000 });
	let result = await page.evaluate(async () => {
		return Array.from(document.querySelectorAll(".mw-parser-output > h3"), (h3) => {
			let category = h3.innerText;
			return Array.from(h3.nextElementSibling.nextElementSibling.querySelectorAll("tbody tr"), (tr) => {
				let tds = tr.querySelectorAll("td");
				if (tds.length >= 4) {
					return {
						category: category,
						name: tds[0].innerText,
						description: tds[1].innerText,
						requirements: tds[2].innerText,
						primogems: tds[3].innerText,
					};
				} else {
					return null;
				}
			});
		});
	});
	// console.log(page.url());
	window.destroy();
	// browser.close();
	return result;
};

ipcMain.on("THEME", (event, payload) => {
	let theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
	event.reply("THEME", theme);
});

// nativeTheme.on("updated", (event, payload) => {
// 	let theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
// 	ipcMain.send("THEME", theme);
// });

// ipcMain handler
ipcMain.on("READ_FILE", (event, payload) => {
	const filePath = path.join(userDataPath, payload.fileName + ".yaml");
	let file;
	try {
		file = fs.readFileSync(filePath, { encoding: "utf8" });
	} catch (error) {
		if (error.code === "ENOENT") {
			const content = [];
			fs.writeFileSync(filePath, YAML.stringify(content), { encoding: "utf8", flag: "w" });
			event.reply("READ_FILE", { content });
		}
		event.reply("ERROR", error.code);
		return;
	}
	const content = YAML.parse(file);
	event.reply("READ_FILE", { content });
});

ipcMain.on("WRITE_FILE", (event, payload) => {
	const filePath = path.join(userDataPath, payload.fileName + ".yaml");
	const content = YAML.stringify(payload.data);
	fs.writeFileSync(filePath, content);
});

ipcMain.on("GET_ACHIEVEMENTS", async (event, payload) => {
	// let achievementsUpToDate = "hey";
	let achievementsUpToDate = await puppeteerMain();
	const content = achievementsUpToDate;
	event.reply("GET_ACHIEVEMENTS", { content });
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1600,
		height: 1200,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
			enableRemoteModule: false,
			preload: path.resolve(__static, "preload.js"),
		},
		frame: false,
		// titleBarStyle: "hiddenInset",
		autHideMenuBar: true,
		useContentSize: true,
		icon: "build/AppIcon.ico",
	});
	win.setMenuBarVisibility(false);
	// const appIcon = new Tray(path.join(__dirname, "/src/assets/AppIcon.png"));

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol("app");
		// Load the index.html when not in development
		win.loadURL("app://./index.html");
	}

	nativeTheme.on("updated", (event, payload) => {
		let theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
		win.webContents.send("THEME", theme);
	});

	//titleBar handler
	ipcMain.on("APP_MINIMIZE", (event, payload) => {
		win.minimize();
	});
	ipcMain.on("APP_MAXIMIZE", (event, payload) => {
		if (win.isMaximized()) {
			win.restore();
		} else {
			win.maximize();
		}
	});
	ipcMain.on("APP_CLOSE", (event, payload) => {
		win.close();
	});
	win.on("maximize", () => {
		win.webContents.send("APP_MAXIMIZE", "maximized");
	});
	win.on("unmaximize", () => {
		win.webContents.send("APP_MAXIMIZE", "restored");
	});
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS);
		} catch (e) {
			console.error("Vue Devtools failed to install:", e.toString());
		}
	}
	createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}

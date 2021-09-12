import { createApp } from "vue";
import App from "./App.vue";
// eslint-disable-next-line no-unused-vars
import SmartTable from "vuejs-smart-table";
import "./assets/style/themes.scss";

// eslint-disable-next-line no-unused-vars
const app = createApp(App);

app.use(SmartTable);
app.mount("#app");

const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", (event, arg) => {
	console.log(arg); // prints "ping"
	event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
	console.log(arg); // prints "ping"
	event.returnValue = "pong";
});

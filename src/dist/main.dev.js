"use strict";

var _vue = require("vue");

var _App = _interopRequireDefault(require("./App.vue"));

var _vuejsSmartTable = _interopRequireDefault(require("vuejs-smart-table"));

require("./assets/style/themes.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
var app = (0, _vue.createApp)(_App["default"]);
app.use(_vuejsSmartTable["default"]);
app.mount("#app");

var _require = require("electron"),
    ipcMain = _require.ipcMain;

ipcMain.on("asynchronous-message", function (event, arg) {
  console.log(arg); // prints "ping"

  event.reply("asynchronous-reply", "pong");
});
ipcMain.on("synchronous-message", function (event, arg) {
  console.log(arg); // prints "ping"

  event.returnValue = "pong";
});
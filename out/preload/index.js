"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
var IPCChannels = /* @__PURE__ */ ((IPCChannels2) => {
  IPCChannels2["GetStore"] = "store-get";
  IPCChannels2["SetStore"] = "store-set";
  IPCChannels2["StoreUpdate"] = "store-updated";
  IPCChannels2["OpenUrlWindow"] = "open-url-window";
  return IPCChannels2;
})(IPCChannels || {});
const api = {
  // 获取数据
  getStore: (key) => electron.ipcRenderer.invoke(IPCChannels.GetStore, key),
  // 设置数据
  setStore: (key, value) => electron.ipcRenderer.invoke(IPCChannels.SetStore, key, value),
  // 监听更新
  onStoreUpdate: (callback) => {
    const listener = (event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(IPCChannels.StoreUpdate, listener);
    return () => {
      electron.ipcRenderer.removeListener(IPCChannels.StoreUpdate, listener);
    };
  },
  // 打开 URL 窗口
  openUrlWindow: (options) => electron.ipcRenderer.invoke(IPCChannels.OpenUrlWindow, options)
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}

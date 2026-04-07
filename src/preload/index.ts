import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IElectronAPI, IPCChannels, StoreData } from '../types/index'

// Custom APIs for renderer
const api: IElectronAPI = {
  // 获取数据
  getStore: (key) => ipcRenderer.invoke(IPCChannels.GetStore, key),

  // 设置数据
  setStore: (key, value) => ipcRenderer.invoke(IPCChannels.SetStore, key, value),

  // 监听更新
  onStoreUpdate: (callback) => {
    const listener = (
      event: Electron.IpcRendererEvent,
      data: { key: keyof StoreData; value: StoreData[keyof StoreData] }
    ): void => {
      callback(data)
    }

    ipcRenderer.on(IPCChannels.StoreUpdate, listener)

    // 返回取消监听的函数
    return () => {
      ipcRenderer.removeListener(IPCChannels.StoreUpdate, listener)
    }
  },

  // 打开 URL 窗口
  openUrlWindow: (options) => ipcRenderer.invoke(IPCChannels.OpenUrlWindow, options)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

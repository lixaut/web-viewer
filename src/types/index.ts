import { BrowserWindowConstructorOptions } from 'electron'

export interface MenuInfo {
  id: string
  name: string
  icon: string
  path: string
  windowConfig?: BrowserWindowConstructorOptions
}

// 1. 定义 Store 的数据结构
export interface StoreData {
  menus: Array<MenuInfo>
  // 在这里扩展更多字段...
  window_config: Array<BrowserWindowConstructorOptions>
}

// 2. 定义 IPC 通信的键名（可选，为了更严格的约束）
export enum IPCChannels {
  GetStore = 'store-get',
  SetStore = 'store-set',
  StoreUpdate = 'store-updated',
  OpenUrlWindow = 'open-url-window'
}

// 定义页面类型
export enum PageType {
  CREATE = '新增',
  EDIT = '编辑'
}

// 3. 定义暴露给渲染进程的 API 接口
export interface IElectronAPI {
  getStore: <K extends keyof StoreData>(key: K) => Promise<StoreData[K]>
  setStore: <K extends keyof StoreData>(key: K, value: StoreData[K]) => Promise<void>
  onStoreUpdate: (
    callback: (data: { key: keyof StoreData; value: StoreData[keyof StoreData] }) => void
  ) => () => void
  // 打开 URL 窗口
  openUrlWindow: (options: {
    url: string
    options: BrowserWindowConstructorOptions
    id: string
  }) => void
}

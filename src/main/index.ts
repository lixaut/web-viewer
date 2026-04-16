import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import { StoreData, IPCChannels } from '../types'

const store = new Store<StoreData>()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 创建 URL 窗口
function createUrlWindow(url: string, customOptions = {}): BrowserWindow {
  const defaultOptions = {
    width: 900,
    height: 670,
    modal: false, // 非模态，允许操作父窗口

    // 方案一: 完全移除标题栏和边框
    // frame: false,

    // 方案二: 仅移除标题栏，可控制
    // titleBarStyle: 'hidden' as const,
    // titleBarOverlay: true,

    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  }

  const options = { ...defaultOptions, ...customOptions }
  const urlWindow = new BrowserWindow(options)

  urlWindow.removeMenu() /** 仅移除原生菜单栏 */
  urlWindow.loadURL(url)

  // 窗口关闭时清理引用
  urlWindow.on('closed', () => {
    // 可以在这里做一些清理工作
    console.log('URL 窗口已关闭')
  })

  return urlWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// --- IPC 处理 ---

// 处理获取数据请求
ipcMain.handle(
  IPCChannels.GetStore,
  async (_, key: keyof StoreData): Promise<StoreData[keyof StoreData]> => {
    return store.get(key)
  }
)

// 处理设置数据请求
ipcMain.handle(
  IPCChannels.SetStore,
  async (_, key: keyof StoreData, value: StoreData[keyof StoreData]) => {
    store.set(key, value)
  }
)

// 监听数据变化并广播
store.onDidChange('menus', (newValue) => {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(IPCChannels.StoreUpdate, { key: 'menus', value: newValue })
  })
})

// 处理打开 URL 窗口请求
ipcMain.handle(IPCChannels.OpenUrlWindow, (_, data) => {
  const urlWindow = createUrlWindow(data.url, {
    ...data.options
  })

  // 存储窗口位置、大小
  const setSize: () => void = () => {
    const menus = store.get('menus')
    const item = menus.find((menu) => menu.id === data.id)
    if (item) {
      item.windowConfig = {
        ...item.windowConfig,
        ...urlWindow.getBounds()
      }
      store.set('menus', menus)
    }
  }

  urlWindow.on('moved', () => setSize())
  urlWindow.on('resize', () => setSize())
})

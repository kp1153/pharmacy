const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

// Production URL (Vercel deploy)
const PROD_URL = 'https://pharmacy-bay.vercel.app'

// Dev में local Next.js, production में Vercel
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'ClinicOS - निशांत फार्मा',
    icon: path.join(__dirname, '../public/icon_256.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: true,
    },
    show: false,
    backgroundColor: '#f9fafb',
  })

  win.once('ready-to-show', () => {
    win.show()
    if (isDev) win.webContents.openDevTools()
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(isDev ? 'http://localhost' : PROD_URL)) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  const loadURL = isDev ? 'http://localhost:3000' : PROD_URL

  win.loadURL(loadURL).catch((err) => {
    console.error('Failed to load URL:', err)
    win.loadURL(`data:text/html,<html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Connection Error</h2><p>Internet connection check करें और retry करें।</p><button onclick="location.reload()" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px;">Retry</button></body></html>`)
  })

  win.webContents.on('will-navigate', (event, url) => {
    const allowed = isDev ? url.startsWith('http://localhost') : url.startsWith(PROD_URL)
    if (!allowed) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
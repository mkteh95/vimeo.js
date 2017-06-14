const electron = require('electron')
const app = electron.app
const os = require("os");
const BrowserWindow = electron.BrowserWindow

let quit = false

app.on('ready', () => {
  const screen = electron.screen.getPrimaryDisplay()
  
  mainWindow = new BrowserWindow({
    height: screen.bounds.height,
    width: screen.bounds.width,
//    titleBarStyle: 'hidden',
  })

  let url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, 'index.html')
  })

  window.on('close', (e) => {
    if (os.plarform === 'darwin' && !quit) {
      e.preventDefault()
      mainWindow.hide()
    } else {
      mainWindow = null
    }
  })

  mainWindow.loadURL(url)
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  quit = true
})
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow = null
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

  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (quit) {
        mainWindow = null
      } else {
        e.preventDefault()  
        mainWindow.hide()
      }
    }
  })

  mainWindow.loadURL(url)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  quit = true
})
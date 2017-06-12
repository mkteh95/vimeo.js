const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

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

  mainWindow.loadURL(url)
})

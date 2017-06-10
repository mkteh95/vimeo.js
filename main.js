const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

var Vimeo = require('vimeo').Vimeo
var lib = new Vimeo('9bb54648addc57804fc4bca391a84c12a7ed8e8d', 
                        'I0D5JrHsNdBk0xdyu9zXG/Y3TVdd8/Z8IijOWqfQ7jupIy5zgzthWsFhLFRkr1igkX4T2/ZpXcbYGU4Tu294dxXOYk45hTLISRKN+ysb9OmE1fcDWTbISShsBr+B22BR')


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

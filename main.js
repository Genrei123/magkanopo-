const { app, BrowserWindow } = require('electron')
const path = require('path')
const server_app  = require('./backend/server')

let win;

function createWindow () {
    win = new BrowserWindow({
        height: 600,
        width: 600,
        icon: 'logo.png'
        
    })

    win.setMenu(null)
    win.loadFile(path.join(__dirname, './frontend/dist/index.html'))
}

app.whenReady().then(() => {
    createWindow()
})
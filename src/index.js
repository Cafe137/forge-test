const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const { sep, join } = require('path')
const { existsSync } = require('fs')

if (require('electron-squirrel-startup')) {
    app.quit()
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

const koa = new Koa()
koa.use(serve(findPath('static')))
koa.listen(9999)

shell.openExternal('http://localhost:9999')

function findPath(path) {
    const origin = process.execPath
    const parts = origin.split(sep)
    while (parts.length) {
        const currentPath = join(...parts, path)
        console.log('Checking path', currentPath)
        if (existsSync(currentPath)) {
            return currentPath
        }
        parts.pop()
    }
    throw Error(`Path ${path} is not found`)
}

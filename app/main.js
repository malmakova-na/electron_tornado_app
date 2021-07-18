const path = require('path')
const url = require('url')
const fetch = require('node-fetch')
const {app, BrowserWindow, ipcMain} = require('electron');
const ipc  = ipcMain

let mainWindow

async function sendData(data) {
    const response = await fetch('http://127.0.0.1:5006/post_data', {
            method: 'POST', // или 'PUT'
            body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
            headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => {
        if(r.ok){
            r.text().then(m => mainWindow.send('showMessage', m, true))
        } else {
            r.text().then(m => mainWindow.send('showMessage', m, false))
        }
    })

}
async function getData(data) {
    let answ = await fetch(`http://127.0.0.1:5006/get_data?id=${data}`).then(r => {
        return r;
    }).then(r => {
        if (r.ok) {
            r.text().then(l => mainWindow.send('showdataS', JSON.parse(l), true))
        } else {
            r.text().then(l => mainWindow.send('showdataS', l, false))
        }
    }).catch(error => {
        error.text().then(er => mainWindow.send('showdataS', er))
    });
    return answ;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 680,
        minWidth: 940, 
        minHeight: 560,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));    

    ipc.on('addForm', (event, data) => {
        sendData(data)
    })
    ipc.on('sendForm', (event, data) => {
        getData(data);
    })
    /*ipc.on('print', (event, data) => {
        console.log('print', data)
    })*/
    
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      
    })
  })

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

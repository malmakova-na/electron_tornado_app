const {ipcRenderer} = require('electron')
const ipc = ipcRenderer


searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    const input = evt.target[0]
    ipc.send('sendForm', input.value)
})
addForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let data = {
        id: evt.target[0].value,
        name: evt.target[1].value,
        age: evt.target[2].value
    }
    ipc.send('addForm', data)
})

ipcRenderer.on('showdataS', (event, data, is_Ok) => {
    let field = document.getElementById('results')
    let className = !is_Ok ?  "error" : "info"
    let info = typeof data !== "string"? Object.entries(data).reduce((html, pair) => html+= `<div class = "search-item ${className}"> <span class ="search__heading">${pair[0].toUpperCase()}: </span>${pair[1]} </div>`, '') : data
    field.innerHTML = `<div class = "search__result ${className}">${info}</div>`;
    document.getElementById('searchForm').reset()
})
ipcRenderer.on('showMessage', (event, data, is_Ok) => {
    let field = document.getElementById('message')
    let className = !is_Ok ? "error" : "message-info"
    field.innerHTML = `<div class =${className}>${data}</div>`
    document.getElementById('addForm').reset()
})
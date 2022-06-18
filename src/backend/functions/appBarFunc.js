module.exports.appBarFunc = {
    close:
    async function main() {
        const { ipcRenderer } = require('electron')
        document.getElementById('closeBtn').addEventListener('click', () => {
            ipcRenderer.send('app/close')
        })
    },
    minimize:
    async function main() { 
        const { ipcRenderer } = require('electron')
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            ipcRenderer.send('app/minimize')
        })
    },
    maximize:
    async function main() {
        const { ipcRenderer } = require('electron')
        document.getElementById('maximizeBtn').addEventListener('click', () => {
            ipcRenderer.send('app/maximize')
        })
    },
}
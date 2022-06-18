module.exports.AppFunc = {
    appDumpFunc:
        async function main(e) {
            const { ipcRenderer } = require('electron')
            const databaseName = document.getElementById('database');
            const discordWebhook = document.getElementById('discordwebhook');
            const PowerButton = document.getElementById('PowerButton');
            const btnSave = document.getElementById('save');
            const dbButton = document.getElementById('dumppath');
            const backuptime = document.getElementById('backuptime')
            var clicked = false
            var intervalId;
            var intervalId2;
            btnSave.onclick = async function () {
                if(backuptime === null || backuptime === '') {
                    alert ('Please provide the backup time.')
                }
                if (databaseName.value === '' && discordWebhook.value === '') {
                    alert('Please provide the database name and discord webhook.')
                } else if (databaseName.value !== '' && discordWebhook.value !== '') {
                    if (clicked) {
                        PowerButton.classList.remove('text-green-500')
                        PowerButton.classList.add('text-red-500')
                        ipcRenderer.send('app/poweroff')
                        dbButton.disabled = false
                        btnSave.innerHTML = 'Save'
                        clearInterval(intervalId)
                        clearInterval(intervalId2)
                        document.getElementById('timer').innerHTML = '00:00:00'
                        clicked = false
                    } else {
                        var date = new Date();
                        const obj = { Database: databaseName.value, Discord: discordWebhook.value }
                        //change color of power button tailwind css class to red 
                        PowerButton.classList.remove('text-red-500')
                        PowerButton.classList.add('text-green-500')
                        ipcRenderer.send('app/poweron', obj)
                        setTimeout(() => {
                            ipcRenderer.send('app/poweron', obj)
                        },backuptime.value * 60000 / 2)
                        dbButton.disabled = true
                        btnSave.innerHTML = 'Stop'
                        intervalId = setInterval(() => {
                            ipcRenderer.send('app/poweron', obj)
                        }, backuptime.value * 60000)
                        intervalId2 = setInterval(() => {
                            var time = new Date() - date
                            var hours = Math.floor(time / (1000 * 60 * 60))
                            var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
                            var seconds = Math.floor((time % (1000 * 60 * 60)) / 1000)
                            document.getElementById('timer').innerHTML = `Elapsed time: ${hours}:${minutes}:${seconds}`
                        }, 1000)
                        clicked = true
                    }
                }
            }
        },
    databaseDumpPath:
        async function main() {
            const { ipcRenderer } = require('electron');
            document.getElementById('dumppath').addEventListener('click', () => {
                ipcRenderer.send('app/databaseDumpPath')
            })
        },
    //check if port is available
    checkPort:
        async function main(port) {
            const { exec } = require('child_process');
            const { ipcRenderer,Notification } = require('electron')
            return new Promise((resolve, reject) => {
                exec(`netstat -ano | findstr ${port}`, (err, stdout, stderr) => {
                    if (err) {
                        resolve(true)
                        document.getElementById('blinkingDot').classList.remove('text-green-500')
                        document.getElementById('blinkingDot').classList.add('text-red-500')
                        ipcRenderer.send('port/notavailable')
                        alert('To utilize the program, make sure mysql is running on port 3306. To exit, press alt + f4.')
                        //disable body tag
                        document.body.style.pointerEvents = 'none'
                    } else {
                        resolve(false)
                        document.getElementById('blinkingDot').classList.remove('text-red-500')
                        document.getElementById('blinkingDot').classList.add('text-green-500')
                        ipcRenderer.send('port/available')
                    }
                })
            })
        },
}
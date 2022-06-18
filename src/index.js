const { app, BrowserWindow, ipcMain, dialog, Notification} = require('electron');
const path = require('path');
const mysqldump = require('mysqldump');
const { v4: uuidv4 } = require('uuid');
const { AppFunc } = require('./backend/functions/appFunc');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const filepath = []
const status = []
const ID = []
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 610,
    frame: false,
    roundedCorners: true,
    backgroundColor: '#2e2c2c',
    movable: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      devTools: true,
      preload: path.join(__dirname, './backend/preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  ipcMain.on('app/close', () => {
    app.quit()
  })
  ipcMain.on('app/minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('app/maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('app/poweron', async (event, arg) => {
    ID.unshift(uuidv4())
    if (filepath[0]) {
      await mysqldump({
        connection: {
          host: 'localhost',
          user: 'root',
          password: '',
          database: arg.Database
        },
        dumpToFile: `${filepath[0]}/${ID}.sql`
      })
      ipcMain.on('axios', (event, arg) => {
        const axios = require('axios').default;
        axios({ method: 'GET', url: "https://api.gofile.io/getServer", headers: {} }).then(function (res) {
          const serverStore = JSON.parse(JSON.stringify(res.data.data.server))
          const FormData = require('form-data')
          const data = new FormData()
          const fs = require('fs')
          data.append('file', fs.createReadStream(`${filepath[0]}/${ID}.sql`));
          console.log(arg)
          axios({
            method: 'POST', url: `https://${serverStore}.gofile.io/uploadFile`, headers: {
              ...data.getHeaders()
            }, data: data
          }).then((ress) => {
            console.log(JSON.stringify(ress.data))
            const { MessageEmbed, WebhookClient } = require('discord.js')
            const Webhook = new WebhookClient({url:'https://discord.com/api/webhooks/987775121014022174/tngw-1FkTgnMrCqjVw2WMQX8YR1ebtnxAqdv5EoX2mBIgAP4cJAkAwTio55U1IXTlPOE'})
            const embed = new MessageEmbed()
              .setTitle('Saltshani1DB Backup System')
              .setDescription('Backup Link: ' + ress.data.data.downloadPage)
              .setColor('#0099ff')
              .setTimestamp()
              Webhook.send({
                content:null,
                username: 'Saltshani1DB Backup System',
                avatarURL:'https://media.discordapp.net/attachments/942973894673981460/987807728120504330/logo.png?width=671&height=671',
                embeds: [embed]
              })
          }).catch(function (err) {
            console.log(err)
          })
          /* const dddd = JSON.parse(ddd)
          console.log(dddd.data.server) */
        }).catch(function (err) {
          console.log(err)
        })
      })
    } else {
      new Notification({
        title:'Saltshani1DB',
        body:'Please select a file path',
      }).show()
    }
    //console.log(filepath[0])
  })
  ipcMain.on('app/poweroff', () => {
    console.log('power off')
  })
  ipcMain.on('port/available', (event, arg) => {
    console.log('port available')
  })
  ipcMain.on('port/notavailable', (event, arg) => {
    console.log('port not available')

  })
  ipcMain.on('app/databaseDumpPath', (event, arg) => {
    console.log('database dump path')
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (result.canceled) {
        console.log('User canceled')
      }
      else {
        filepath.unshift(result.filePaths)
      }
    })
  })
};

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

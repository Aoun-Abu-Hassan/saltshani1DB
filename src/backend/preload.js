const { appBarFunc } = require("./functions/appBarFunc")
const { AppFunc } = require("./functions/appFunc")

window.addEventListener('DOMContentLoaded', () => {
    appBarFunc.close()
    appBarFunc.maximize()
    appBarFunc.minimize()
    AppFunc.appDumpFunc();
    AppFunc.databaseDumpPath();
    AppFunc.checkPort(3306);
})

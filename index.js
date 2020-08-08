const { menubar } = require('menubar');
const { app, Menu, Tray, autoUpdater } = require('electron');
const path = require('path');

app.on('ready', () => {
    const tray = new Tray(path.resolve(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', type: 'normal', click: () => autoUpdater.quitAndInstall() }
    ]);
    tray.setContextMenu(contextMenu);

    const mb = menubar({ tray });
});

app.on('window-all-closed', e => {
    console.log('window-all-closed');

    // if (process.platform != 'darwin') {
        app.quit();
    // }
});

app.on('before-quit', () => console.log('before-quit'));
app.on('will-quit', () => console.log('will-quit'));
app.on('quit', () => console.log('quit'));
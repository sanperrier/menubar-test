const { menubar } = require('menubar');
const { app, Menu, Tray, autoUpdater, dialog } = require('electron');
const path = require('path');

autoUpdater.setFeedURL(`https://update.electronjs.org/sanperrier/menubar-test/${process.platform}-${process.arch}/${app.getVersion()}`);

autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: "No available updates",
        message: `current version: ${app.getVersion()}`
    });
});

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        title: "Update is downloading",
        message: `current version: ${app.getVersion()}`
    });
});

autoUpdater.on('update-downloaded', async (e, notes, name) => {
    await dialog.showMessageBox({
        title: "Update downloaded",
        message: name,
        detail: notes
    });
    autoUpdater.quitAndInstall();
});

app.on('ready', () => {
    const tray = new Tray(path.resolve(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Check for updates and install (current: ${app.getVersion()})`,
            type: 'normal',
            click: () => autoUpdater.checkForUpdates()
        },
        {
            label: 'Close window',
            type: 'normal',
            click: () => mb.window.close()
        },
        {
            label: 'Exit',
            type: 'normal',
            click: () => app.quit()
        }
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
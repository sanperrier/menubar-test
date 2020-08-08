const { menubar } = require('menubar');
const { app, Menu, Tray, autoUpdater, dialog } = require('electron');
const path = require('path');

async function sleep(ms = 1000) {
    await new Promise(r => setTimeout(r, ms));
}

autoUpdater.setFeedURL(`https://update.electronjs.org/sanperrier/menubar-test/${process.platform}-${process.arch}/${app.getVersion()}`);

autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: "No available updates",
        message: `No available updates\ncurrent version: ${app.getVersion()}`
    });
});

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        title: "Update is downloading",
        message: `Update is downloading\ncurrent version: ${app.getVersion()}`
    });
});

autoUpdater.on('update-downloaded', async (e, notes, name) => {
    mb.hideWindow();

    await sleep();

    await dialog.showMessageBox({
        title: "Update downloaded",
        message: `Update downloaded\ncurrent version: ${app.getVersion()}\nnew version: ${name}`,
        detail: notes
    });

    mb.hideWindow();

    await sleep();

    autoUpdater.quitAndInstall();
});

/** @type {ReturnType<menubar>} */
let mb;
app.on('ready', () => {
    const tray = new Tray(require.resolve('menubar/assets/IconTemplate.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Check for updates and install (current: ${app.getVersion()})`,
            type: 'normal',
            click: () => autoUpdater.checkForUpdates()
        },
        {
            label: 'Close window',
            type: 'normal',
            click: () => mb.window?.close()
        },
        {
            label: 'Exit',
            type: 'normal',
            click: () => app.quit()
        }
    ]);
    tray.setContextMenu(contextMenu);

    mb = menubar({ tray });
});

app.on('window-all-closed', e => {
    console.log('window-all-closed');

    // if (process.platform != 'darwin') {
        app.quit();
    // }
});

app.on('before-quit', () => console.log('before-quit'));
app.on('will-quit', () => console.log('will-quit'));
app.on('quit', async () => {
    console.log('quit');

    await sleep();
    
    app.exit(0);
});
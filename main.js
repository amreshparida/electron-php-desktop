const electron = require('electron');
const { app, Menu, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

const PHPServer = require('php-server-manager');

// Set up the PHP server configuration
const server = new PHPServer({
    port: 5555,
    directory: path.join(__dirname, "/www"),
    directives: {
        display_errors: 1,
        expose_php: 1
    }
});

let mainWindow;

function createWindow() {
    // Ensure the PHP server is running before creating the window
    server.run().catch(err => {
        console.error('Failed to start PHP server:', err);
    });

    mainWindow = new BrowserWindow({ width: 1200, height: 1200 });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(`http://${server.host}:${server.port}/`);

    mainWindow.on('closed', function () {
        server.close();
        mainWindow = null;
    });
}

app.on('ready', () => {
    createMenu();
    configurePHPPath();  // Adjusted function name for clarity
    createWindow();      // Directly call createWindow() here
});

function createMenu() {
    if (process.platform === 'darwin') {
        const template = [
            {
                label: 'FromScratch',
                submenu: [
                    {
                        label: 'Quit',
                        accelerator: 'CmdOrCtrl+Q',
                        click: function () { app.quit(); }
                    }
                ]
            }, {
                label: 'Edit',
                submenu: [
                    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                    { type: 'separator' },
                    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
                ]
            }
        ];
        const osxMenu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(osxMenu);
    }
}

function configurePHPPath() {
    // Add PHP to the PATH environment variable within Node.js
    const phpPath = path.resolve(__dirname, 'php');
    process.env.PATH = `${process.env.PATH};${phpPath}`;
    console.log('PHP path configured:', phpPath);
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        server.close();
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

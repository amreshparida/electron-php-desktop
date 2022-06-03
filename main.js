const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


app.on('ready', () => {
  if (process.platform === 'darwin') {
    var template = [{
      label: 'FromScratch',
      submenu: [{
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: function() { app.quit(); }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }]
    }];
    var osxMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(osxMenu);
  }
})

const PHPServer = require('php-server-manager');

const server = new PHPServer({
  
    port: 5555,
    directory: __dirname+"/www",
    directives: {
        display_errors: 1,
        expose_php: 1
    }
});


let mainWindow

function createWindow () {

  server.run();
  mainWindow = new BrowserWindow({width: 1200, height: 1200})
  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadURL('http://'+server.host+':'+server.port+'/')


 const {shell} = require('electron')

  mainWindow.on('closed', function () {

    server.close();
    mainWindow = null;
  })
}

app.on('ready', createWindow) 

app.on('window-all-closed', function () {
  
  if (process.platform !== 'darwin') {
    server.close();
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})





function run_php(){
  const { spawn } = require('child_process');
  bat    = spawn('cmd.exe', ['/c', 'setenv.bat']);
  
  bat.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  bat.stderr.on('data', (data) => {
    console.log(data.toString());
  });
  
  bat.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
  });
  }

  run_php();
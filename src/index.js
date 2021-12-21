const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 955,
    height: 975,
    autoHideMenuBar: true,
    webPreferences:{
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon:__dirname + '/pokeball_CjJ_icon.ico' ,
  });

  let child = new BrowserWindow({
    width: 955,
    height: 800,
    autoHideMenuBar: true,
    webPreferences:{
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon:__dirname + '/pokeball_CjJ_icon.ico' ,
  })
  let pokewindows = new BrowserWindow({
    parent: child,
    width: 400,
    height: 235,
    autoHideMenuBar: true,
    webPreferences:{
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon:__dirname + '/pokeball_CjJ_icon.ico' ,
  });
  let prevpokewindows = new BrowserWindow({
    parent: child,
    width: 400,
    height: 235,
    autoHideMenuBar: true,
    webPreferences:{
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon:__dirname + '/pokeball_CjJ_icon.ico' ,
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.show();
  child.loadFile(path.join(__dirname, 'hunt.html'));
  pokewindows.loadFile(path.join(__dirname, 'pokemonWindow.html'));
  pokewindows.show();
  prevpokewindows.loadFile(path.join(__dirname, 'pokemonPreviousWindow.html'));
  prevpokewindows.show();

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  //dark mode
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
  ipcMain.on("create-document-trigger",(event,data) =>{
    dialog.showSaveDialog(mainWindow,{
      filters: [{name:"json files",extensions:["json"]}]
    }).then(({filePath}) =>{
      fs.writeFile(filePath,data,(err)=>{
        if(err){
          console.log(err.message);
        }
      })
    })
  })
  ipcMain.on("read-currenthunt-towindow",()=>{
    dialog.showOpenDialog(child,{
      properties: ['openFile']
    }).then(result =>{
      let filepath = result.filePaths[0];
      filepath = JSON.stringify(filepath);
      filepath = filepath.replaceAll('"',"")
      fs.readFile(filepath,'utf-8',(err,data)=>{
        if(err){
          console.log(err.message)
          return;
        }
        const finaldata = JSON.stringify(data,null,2);
        child.webContents.send("recieve-currenthunt",data);
        pokewindows.webContents.send("recieve-currenthunt",data);
      })
    })
})
ipcMain.on("read-previoushunt-towindow",()=>{
  dialog.showOpenDialog(child,{
    properties: ['openFile']
  }).then(result =>{
    let filepath = result.filePaths[0];
    filepath = JSON.stringify(filepath);
    filepath = filepath.replaceAll('"',"")
    fs.readFile(filepath,'utf-8',(err,data)=>{
      if(err){
        console.log(err.message)
        return;
      }
      const finaldata = JSON.stringify(data,null,2);
      child.webContents.send("recieve-previoushunt",data);
      prevpokewindows.webContents.send("recieve-previoushunt",data);
    })
  })
})
ipcMain.on("request-path",()=>{
  dialog.showOpenDialog(child,()=>{
    properties: ['openFile']
  }).then(result =>{
    let filepath = result.filePaths[0];
    filepath = JSON.stringify(filepath);
    filepath = filepath.replaceAll('"',"")
    child.webContents.send("requested-path",filepath);
  })
})
ipcMain.on("change-content-of-file", (event,data)=>{
  let path = data[0];
  let contentOfFile = data[1];
  fs.writeFile(path,contentOfFile,(err)=>{
    if(err){
      console.log(err.message);
      return;
    }
  })
})
};

//disable hardware acceleration for obs
app.disableHardwareAcceleration();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

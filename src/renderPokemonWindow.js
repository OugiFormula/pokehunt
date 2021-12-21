const fs = require('fs');
const {ipcRenderer} = require('electron');

let hunt;
ipcRenderer.on("recieve-currenthunt",function(event,data){
    hunt = data;
    const finalHunt = JSON.parse(hunt);
    document.getElementById("pokemonimage").src = finalHunt.imageurl;
    document.getElementById("awaitImportJson").textContent = "";
})
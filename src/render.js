const fs = require('fs');
const {ipcRenderer} = require('electron');

//template for save file
let hunt = 
    {
        "name": "",
        "imageurl": "",
        "method": "",
        "timer": 0,
        "counter" : 0,
        "shinycharm": false,
        "masuda": false
    };


//take the object of the current hunt and place the statistics on here
ipcRenderer.on("recieve-currenthunt",function(event,data){
  ipcRenderer.send("recieve-currenthunt-fromwindow",data);
})

document.getElementById("startBtn").addEventListener("click",()=>{
    const pokename = document.getElementById("pokemon").value;
    if(pokename!=null){
        hunt.name = pokename;
        hunt.imageurl = "https://poketch-cdn-assets.s3.amazonaws.com/images/pokemon/animated/shiny/"+pokename+".gif";
        const selectMethod = document.getElementById("Method");
        hunt.method = selectMethod.value;
        const shinycharm = document.getElementById("shiny").value;
        switch(shinycharm){
            case "no":
                hunt.shinycharm = false;
                break;
            case "yes":
                hunt.shinycharm = true;
                break;
        }
        const masuda = document.getElementById("masuda").value;
        switch(masuda){
            case "no":
                hunt.masuda = false;
                break;
            case "yes":
                hunt.masuda = true;
                break;
        }
        const huntfinal = JSON.stringify(hunt,null,2);
        ipcRenderer.send("create-document-trigger",huntfinal);
    } else{
        alert("Please Enter A Name For The Pokemon You Want");
        return;
    }
});

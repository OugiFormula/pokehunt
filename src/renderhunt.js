const {ipcRenderer} = require('electron');
const path = require('path');

var currenthunt;
let previoushunt;
var odds
let counter=0,fcounter = ''+counter;
let finalTimer;
let elapsedTime = 0;
let finalcurrenthunt,finalPreviousHunt;
let isCounterFile = false,isTimerFile=false,isOddsFile=false;
let counterFilePath = "", timerFilePath = "",oddsFilePath="";
let userBindedKeyIncrease="ArrowUp",userBindedKeyDecrease="ArrowDown",userBindedKeyReset="r";
let oddlist = [4096, 3855, 3640, 3449, 3277, 3121, 2979, 2849, 2731, 2621, 2521, 2427, 2341, 2259, 2185, 2114, 2048, 1986, 1927, 1872, 1820, 1771, 1724, 1680, 1638, 1598, 1560, 1524, 1489, 1456, 1310, 1285, 1260, 1236, 1213, 1192, 993, 799, 400, 200, 99]

document.getElementById("increasekey").textContent = userBindedKeyIncrease;
document.getElementById("decreasekey").textContent = userBindedKeyDecrease;
document.getElementById("resetkey").textContent = userBindedKeyReset;


document.getElementById("keybindincrease").addEventListener('click', function(){
  alert("Please press the increase key after you close this dialog");
  document.addEventListener('keydown', function increaseKey(event){
    userBindedKeyIncrease = event.key;
    document.getElementById("increasekey").textContent = userBindedKeyIncrease;
    document.removeEventListener('keydown', increaseKey);
  });
})
document.getElementById("keybindreset").addEventListener('click', function(){
  alert("Please press the reset key after you close this dialog");
  document.addEventListener('keydown', function resetKey(event){
    userBindedKeyReset = event.key;
    document.getElementById("resetkey").textContent = userBindedKeyReset;
    document.removeEventListener('keydown', resetKey);
  });
})
document.getElementById("keybinddecrease").addEventListener('click', function(){
  alert("Please press the decrease key after you close this dialog");
  document.addEventListener('keydown', function decreaseKey(event){
    userBindedKeyDecrease = event.key;
    document.getElementById("decreasekey").textContent = userBindedKeyDecrease;
    document.removeEventListener('keydown', decreaseKey);
  });
})

document.getElementById("import").addEventListener('click', function(){
  //request data from index.js
  ipcRenderer.send("read-currenthunt-towindow");
})
ipcRenderer.on("recieve-currenthunt",function(event,data){
  currenthunt = data;
  finalcurrenthunt = JSON.parse(currenthunt,null,2);
  elapsedTime = finalcurrenthunt.timer;
  counter = finalcurrenthunt.counter;
  document.getElementById("pokemonname").textContent = finalcurrenthunt.name;
  document.getElementById("Method").textContent = finalcurrenthunt.method;
  fcounter = ''+counter;
  console.log(fcounter);
  document.getElementById("counter").textContent = fcounter;
  document.getElementById("pokemonimage").src = finalcurrenthunt.imageurl;
  print(timeToString(elapsedTime));
  //add hatch here
  if(finalcurrenthunt.method=="pokeradar"){
    odds = oddlist[counter];
    let oddString = "1/"+odds;
    document.getElementById("Odds").textContent = oddString;
    document.getElementById("counter").textContent = counter;
    //basically every time user press to change the counter it will change the odds according to the number of the counter
    document.addEventListener("keydown", function(event){
      if(event.key==userBindedKeyIncrease){
        counter++;
        fcounter = ''+counter;
        console.log(fcounter);
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
        if(counter>=40){
          odds = 99;
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        } else{
          odds = oddlist[counter];
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        }
      }
      if(event.key==userBindedKeyDecrease){
        if (counter<=0){
          counter=0;
        } else{
          counter--;
        }
        let fcounter = ''+counter;
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
        if(counter>=40){
          odds = 99;
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        } else{
          odds = oddlist[counter];
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        }
      }
      if(event.key==userBindedKeyReset){
        counter=0;
        fcounter = ''+counter;
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
        if(counter>=40){
          odds = 99;
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        } else{
          odds = oddlist[counter];
          oddString = "1/"+odds;
          document.getElementById("Odds").textContent = oddString;
          if(isOddsFile){
            let sendOddToPath = [oddsFilePath,oddString];
            ipcRenderer.send("change-content-of-file",sendOddToPath);
          }
        }
      }
    })
  }
  if(finalcurrenthunt.method=="resets"){
    odds = 4096;
    oddString = "1/"+odds;
    document.getElementById("Odds").textContent = oddString;
    if(isOddsFile){
      let sendOddToPath = [oddsFilePath,oddString];
      ipcRenderer.send("change-content-of-file",sendOddToPath);
    }
    document.addEventListener("keydown", function(event){
      if(event.key==userBindedKeyIncrease){
        counter++;
        fcounter = ''+counter;
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
      }
      if(event.key==userBindedKeyDecrease){
        if (counter<=0){
          counter=0;
        } else{
          counter--;
        }
        fcounter = ''+counter;
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
      }
      if(event.key==userBindedKeyReset){
        counter=0;
        fcounter = ''+counter;
        document.getElementById("counter").textContent = fcounter;
        if(isCounterFile){
          let sendCounterToPath = [counterFilePath,fcounter];
          ipcRenderer.send("change-content-of-file",sendCounterToPath);
        }
      }
    })
  }
})

//ask for counter file and set that the file has been saved to true
document.getElementById("counterChooseBtn").addEventListener('click',function(){
  ipcRenderer.send("request-path");
})
document.getElementById("timerChooseBtn").addEventListener('click',function(){
  ipcRenderer.send("request-path");
})
document.getElementById("oddsChooseBtn").addEventListener('click',function(){
  ipcRenderer.send("request-path");
})
document.getElementById("previousCounterBtn").addEventListener('click', function(){
  ipcRenderer.send("request-path");
})
document.getElementById("previousTimerBtn").addEventListener('click', function(){
  ipcRenderer.send("request-path");
})
document.getElementById("previousOddsBtn").addEventListener('click', function(){
  ipcRenderer.send("request-path");
})
//take path of the file and save it
ipcRenderer.on("requested-path",function(event,data){
  let pathFromData = data;
  if(path.basename(pathFromData)=='CurrentCounter.txt'){
    counterFilePath = pathFromData;
    isCounterFile=true;
  } else if(path.basename(pathFromData)=='CurrentTimer.txt'){
    timerFilePath = pathFromData;
    isTimerFile = true;
  } else if(path.basename(pathFromData)=='CurrentOdds.txt'){
    oddsFilePath = pathFromData;
    isOddsFile = true;
  }
  //On this section we just set the previous hunt data inside the text files
  else if(path.basename(pathFromData)=='PreviousCounter.txt'){
    let pfcounter = ''+finalPreviousHunt.counter;
    let previousCounterData = [pathFromData, pfcounter];
    ipcRenderer.send("change-content-of-file",previousCounterData);
  } else if(path.basename(pathFromData)=='PreviousTimer.txt'){
    let previousHuntTimerFinal = timeToString(finalPreviousHunt.timer);
    // set the text from the previous hunt
    let previousTimerData = [pathFromData,previousHuntTimerFinal];
    ipcRenderer.send("change-content-of-file",previousTimerData);
  } else if(path.basename(pathFromData)=='PreviousOdds.txt'){
    let previousOddsData;
    if(finalPreviousHunt.masuda){
      if(finalPreviousHunt.shinycharm){
        previousOddsData = [pathFromData,"1/512"];
        ipcRenderer.send("change-content-of-file",previousOddsData);
      } else{
        previousOddsData = [pathFromData,"1/1365"];
        ipcRenderer.send("change-content-of-file",previousOddsData);
      }
    } else{
      if (finalPreviousHunt.shinycharm){
        previousOddsData = [pathFromData,"1/1024"];
        ipcRenderer.send("change-content-of-file",previousOddsData);
      } else{
        previousOddsData = [pathFromData,"1/4096"];
        ipcRenderer.send("change-content-of-file",previousOddsData);
      }
    }
  }
})


document.getElementById("previousImport").addEventListener('click', ()=>{
  ipcRenderer.send("read-previoushunt-towindow");
})
ipcRenderer.on("recieve-previoushunt",function(event,data){
  previoushunt = data;
  finalPreviousHunt = JSON.parse(previoushunt,null,2);
  document.getElementById("previousMethod").textContent = finalPreviousHunt.method;
  let previousCounter = ''+ finalPreviousHunt.counter;
  document.getElementById("previousCounter").textContent = previousCounter;
  document.getElementById("previousTimer").textContent = timeToString(finalPreviousHunt.timer);
  //depends on the method

  //if resets
  if(finalPreviousHunt.method=="resets"){
    document.getElementById("previousOdds").textContent = "1/4096";
  }
  //if hatching can be multiple choices
  if(finalPreviousHunt.method=="hatching"){
    if(finalPreviousHunt.masuda){
      if(finalPreviousHunt.shinycharm){
        document.getElementById("previousIsMasuda").textContent = "Using Masuda Method";
        document.getElementById("previousIsShinyCharm").textContent = "Using Shiny Charm";
        document.getElementById("previousOdds").textContent = "1/512";
      } else{
        document.getElementById("previousIsMasuda").textContent = "Using Masuda Method";
        document.getElementById("previousIsShinyCharm").textContent = "Not Using Shiny Charm";
        document.getElementById("previousOdds").textContent = "1/1365";
      }
    } else{
      if (finalPreviousHunt.shinycharm){
        document.getElementById("previousIsMasuda").textContent = "Not Using Masuda Method";
        document.getElementById("previousIsShinyCharm").textContent = "Using Shiny Charm";
        document.getElementById("previousOdds").textContent = "1/1024";
      } else{
        document.getElementById("previousIsMasuda").textContent = "Not Using Masuda Method";
        document.getElementById("previousIsShinyCharm").textContent = "Not Using Shiny Charm";
        document.getElementById("previousOdds").textContent = "1/4096";
      }
    }
  }
  //if pokeradar
  if(finalPreviousHunt.method=="pokeradar"){
    if(finalPreviousHunt.counter>=40){
      document.getElementById("previousOdds").textContent = "1/"+oddlist[41];
    } else{
      let counter = finalPreviousHunt.counter;
      document.getElementById("previousOdds").textContent = "1/"+oddlist[counter];
    }
  }
  document.getElementById("previouspokemonimage").src = finalPreviousHunt.imageurl;
})


// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// Declare variables to use in our functions below
let startTime;
let timerInterval;

// Create function to modify innerHTML

function print(txt) {
  document.getElementById("Timer").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
  startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
      if(isTimerFile){
        let timerDataToPath = [timerFilePath,timeToString(elapsedTime)]
        ipcRenderer.send("change-content-of-file",timerDataToPath);
      }
    }, 1000)
}

function pause() {
  finalTimer = elapsedTime;
  clearInterval(timerInterval);
}

// Create event listeners

let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");

playButton.addEventListener("click", start);
pauseButton.addEventListener("click", pause);

document.getElementById("saveButton").addEventListener('click',()=>{
  finalcurrenthunt.timer=finalTimer;
  finalcurrenthunt.counter=counter;
  const huntsaved = JSON.stringify(finalcurrenthunt,null,2);
  const finalhuntsaved = huntsaved.replaceAll('\n',"")
  alert("Please Click On The Save File, When Asked To Replace Please Do So.")
  ipcRenderer.send("create-document-trigger",finalhuntsaved);
})
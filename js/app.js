// create a global context
var context;

try {
  context = new (window.AudioContext || window.webkitAudioContext)();  
} 
catch(e) {
    console.log("Web Audio API not supported.");
}

// globals
var loopExists = false;


// run intitialization on DOM load
window.onload = function init() {

}

function initListeners() {

}

function startLoop() {
    if (!loopExists)
    {

    }
    else 
    {

    }
}

function stopLoop() {
    if (!loopExists)
    {
        return;
    }
    else
    {

    }
}
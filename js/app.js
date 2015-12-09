// GLOBALS
var context;
var kitNames = Array();
var buffers = Array();
var soundNames = Array();
var keys = "ASDFGHJKL";
var NOW = 0;
var loopExists = false;
var recordToggle = false;
var ASSET_PATH = "sounds"

// AUDIO NODES
var compressor;
var masterGainNode;
var outputNode;

// ensure webAudio support
try {
  context = new (window.AudioContext || window.webkitAudioContext)();  
} 
catch(e) {
    console.log("Web Audio API not supported.");
}


// run intitialization on DOM load
window.onload = function init() {

    initAudioNodes();
    getKitNames(getPaths);

    // once backend query finished and sounds loaded, create listeners
    $(document).bind('load_complete', initListeners);

}
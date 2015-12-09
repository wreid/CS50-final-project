// GLOBALS
var context;
var kitNames = Array();
var buffers = Array();
var soundNames = Array();
var noteSchedule = Array();
var loopExists = false;
var playing = false;
var recordToggle = true;
var loopStartTime;
var loopLength = 0.0;
var numNotes = 0;
var currentNote = 0;
var intervalID;


// CONSTANTS
var ASSET_PATH = "sounds"
var SPACE_KEY_CODE = 32;
var RECORD_KEY_CODE = 82;
var KEYS = "ASDFGHJKL";
var NOW = 0;
var lookAhead = 25.0; // how frequently to call scheduler
var scheduleAheadTime = 0.1; // how far ahead to schedule notes
var RESOLUTION = 256;

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
$(function init() {

    initAudioNodes();
    initTransportListeners();

    // start kit load process
    getKitNames(getPaths);

    // once backend query finished and sounds loaded, create listeners
    $(document).bind('load_complete', initButtonListeners);
});


/* LOOP FUNCTIONS */

function startLoop() {

    if (!loopExists && recordToggle) // make a loop
    {
        loopStartTime = context.currentTime; 
        playing = true;
    }
    else if (!loopExists && !recordToggle) // loop doesn't exist & record not enabled
    {
        return;
    }
    else // loop exists; start playing again
    {
        scheduler();
        intervalID = window.setInterval(scheduler, loopLength * 1000);
        playing = true;
    }

    // toggle button color
    $("#play").css("border-left", "40px solid green");
}

function stopLoop() {

    window.clearInterval(intervalID);

    // toggle button color
    $("#play").css("border-left", "40px solid black");
    playing = false;
    
}

function toggleRecording() {

    if (recordToggle) 
    {

        // toggle button color
        $("#record").css("background-color", "black");
        recordToggle = false;
    }
    else
    {

        // toggle button color 
        $("#record").css("background-color", "#CC3333");
        recordToggle = true;
    }
}

function addNote(name, offset) {

    noteSchedule[numNotes] = {
        name: name,
        offset: offset
    }
    numNotes++;
}

function scheduler() {
    noteSchedule.forEach(function (element, index) {
        playSound(element.name, element.offset);
    });
}

function deleteLoop() {
    noteSchedule = [];
    loopExists = false;
}
// create a global context
var context;
var kitNames = Array();
var buffers = {};
var soundNames = Array();

try {
  context = new (window.AudioContext || window.webkitAudioContext)();  
} 
catch(e) {
    console.log("Web Audio API not supported.");
}

// globals
var loopExists = false;
var recordToggle = false;
var ASSET_PATH = "sounds/"

// run intitialization on DOM load
window.onload = function init() {

    getKitNames(loadSounds);

}

function initListeners() {

}

function getKitNames(callback) {
    $.getJSON("paths.php", { path: ASSET_PATH })
    .done(function(data, textStatus, jqXHR) {

        // gets names of possible kits, then loads default kit
        kitNames = data;

        // php function scandir returns alphabetical list of kits, starting with
        // "." and ".." directories
        callback(kitNames[2]);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

function loadSounds(kit) {

    var pathList = Array();

    // parameters for JSON call
    var parameters = {
        path: ASSET_PATH + kit
    };

    // use a JSON get request to return a JSON object containing an array of
    // paths to the individual kit sounds
    $.getJSON("paths.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // all directories have "." and ".." by default
        if (data.length > 2)
        {
            // for readability
            var str;
            for (var i = 0, j = data.length; i + 2 < j; i++) {

                str = data[i + 2];

                // slice up until the file type
                soundNames[i] = str.substring(0, str.indexOf("."));

                // add formatted path to pathList
                pathList[i] = parameters.path + "/" + str;
            }
        }
        else
        {
            console.log("Empty" + kit + " folder.");
        }

        // load sounds into buffer
        bufferLoader = new BufferLoader(context, pathList, finishedLoading);
        bufferLoader.load();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

function finishedLoading(bufferList) {

    // load buffers into associative array with sound names
    for (var i = 0, j = bufferList.length; i < j; i++) {
        Object.defineProperty(buffers, soundNames[i], { value: bufferList[i] });
    }
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

function toggleRecording() {
    if (recordToggle) 
    {
        recordToggle = false;
    }
    else
    {
        recordToggle = true;
    }
}

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
}
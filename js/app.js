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

// ensure webAudio support
try {
  context = new (window.AudioContext || window.webkitAudioContext)();  
} 
catch(e) {
    console.log("Web Audio API not supported.");
}


// run intitialization on DOM load
window.onload = function init() {

    getKitNames(getPaths);

    // once backend query finished and sounds loaded, create listeners
    $(document).bind('load_complete', initListeners);

}


// create listeners for sound buttons and keyboard
function initListeners() {

    for (var i = 0, j = soundNames.length; i < j; i++) {

        // create click listener for each button
        $("#" + soundNames[i]).on("click", { name: soundNames[i], buttonPress: true }, triggerPlay );
    }

    // create listener for all keyboard presses
    $(window).on("keydown", { keyPress: true }, triggerPlay );
}


// calls a server side script to generate names of kits
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

// calls a server side script to generate the paths of kit sounds
function getPaths(kit) {

    // use a JSON get request to return a JSON object containing an array of
    // paths to the individual kit sounds
    $.getJSON("paths.php", { path: kit }, loadSounds);
}


// loads sounds from paths supplied by JSON data
function loadSounds(data, textStatus, jqXHR) {

    // paths to be queried by the BufferLoader object
    var pathList = Array();

    // all directories have "." and ".." by default
    if (data.length > 2)
    {

        // html template for sound buttons with corresponding trigger keys
        var template = _.template("<li><button id='<%- name %>'><%- name %> (<%- key%>)</button></li>");

        // for readability
        var str;
        for (var i = 0, j = data.length; i + 2 < j; i++) {

            // skip over "." and ".." directories
            str = data[i + 2];

            // slice up until the file type
            soundNames[i] = str.substring(str.lastIndexOf("/") + 1, str.lastIndexOf("."));

            // add button to DOM
            $("#buttons").append(template({ name: soundNames[i], key: keys[i] }));

            // add formatted path to pathList
            pathList[i] = str;
        }
    }
    else
    {
        console.log("Empty" + kit + " folder.");
    }

    // load sounds into buffer; calls finishedLoading upon completion
    bufferLoader = new BufferLoader(context, pathList, finishedLoading);
    bufferLoader.load();
}


// create associative array with sound name keys and audio buffer values
function finishedLoading(bufferList) {

    for (var i = 0, j = bufferList.length; i < j; i++) {
        buffers[soundNames[i]] = bufferList[i];
    }

    // trigger load complete call
    $(document).trigger('load_complete');
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


// triggers sound when event listener activated
function triggerPlay(event) {

    if (event.data.keyPress)
    {
        var c = String.fromCharCode(event.keyCode);
        var i = keys.indexOf(c);
        if (soundNames[i])
        {
            playSound(soundNames[i], NOW);    
        }
    }
    else if (event.data.buttonPress)
    {
        playSound(event.data.name, NOW);
    }
    else
    {
        console.log("Key not set");
    }
    
}


// plays sound in time seconds
function playSound(name, time) {

    var buffer = buffers[name];
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(time);                           // play the source now
}
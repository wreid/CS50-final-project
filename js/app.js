// create a global context
var context;
var kitNames = Array();
var buffers = Array();
var soundNames = Array();
var keys = "ASDFGHJKL";
var NOW = 0;

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
    $(document).bind('load_complete', initListeners);

}

function initListeners() {

    for (var i = 0, j = soundNames.length; i < j; i++) {
        $("#" + soundNames[i]).on("click", { name: soundNames[i], buttonPress: true }, triggerPlay );
    }
    $(window).on("keydown", { keyPress: true }, triggerPlay );
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

            // html template
            var template = _.template("<li><button id='<%- name %>'><%- name %> (<%- key%>)</button></li>");

            // for readability
            var str;
            for (var i = 0, j = data.length; i + 2 < j; i++) {

                // skip over "." and ".." directories
                str = data[i + 2];

                // slice up until the file type
                soundNames[i] = str.substring(0, str.indexOf("."));

                // add button to DOM
                $("#buttons").append(template({ name: soundNames[i], key: keys[i] }));

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
        buffers[soundNames[i]] = bufferList[i];
    }

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
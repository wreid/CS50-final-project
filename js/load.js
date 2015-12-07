/* LOAD FUNCTIONS */

// initialize compressor and gain nodes
function initAudioNodes() {

    if (context.createDynamicsCompressor) 
    {
        compressor = context.createDynamicsCompressor();
        compressor.connect(context.destination);
        outputNode = compressor;
    }
    else
    {
        // no compressor available
        outputNode = context.destination;
    }

    masterGainNode = context.createGain();
    masterGainNode.gain.value = 0.7;
    masterGainNode.connect(outputNode);
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

        makeKitList(kitNames);

        // php function scandir returns alphabetical list of kits, starting with
        // "." and ".." directories; load first kit by default
        callback(kitNames[2]);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

// add options to dropdown menu
function makeKitList(names) {

    var template = _.template("<option value=\"<%- ASSET_PATH + \"/\" + name %>\"><%- name %></option");

    for (var i = 0, j = names.length; i + 2 < j; i++) {

            // skip over "." and ".." directories
            var str = names[i + 2];

            // slice up until the file type
            var name = str.substring(str.lastIndexOf("/") + 1);

            // add button to DOM
            $(".form-control").append(template({ name: name }));
    }
    $("select").on("change", function(){
        clear();
        getPaths(this.value);
    })

    // var defaultKit = kitNames[2].substring(str.lastIndexOf("/") + 1);

    // $(".form-control #" + defaultKit).attr("selected", "selected");
    // $(".form-control").on("change", function() {

    //     // change kit
    //     console.log(this.id);
    //     getPaths(event.data.kit);
    // });
}

// clears current kit
function clear() {
    $("#buttons").empty();
    buffers = Array();
    soundNames = Array();
}

// calls a server side script to generate the paths of kit sounds
function getPaths(kit) {
    console.log(kit);
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

    console.log(pathList);
    // load sounds into buffer; calls finishedLoading upon completion
    var bufferLoader = new BufferLoader(context, pathList, finishedLoading);
    bufferLoader.load();
}

// create associative array with sound name keys and audio buffer values
function finishedLoading(bufferList) {

    console.log(bufferList);

    for (var i = 0, j = bufferList.length; i < j; i++) {
        buffers[soundNames[i]] = bufferList[i];
    }

    // trigger load complete call
    $(document).trigger('load_complete');
}
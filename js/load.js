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

// create listeners for transport section
function initTransportListeners() {
    $("#record").on("click", toggleRecording);
    $("#stop").on("click", stopLoop);
    $("#play").on("click", startLoop);
    $("#clear").on("click", deleteLoop);
}

// create listeners for sound buttons and keyboard
function initButtonListeners() {

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

        // load first kit by default
        callback(kitNames[0]);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

// reloads the kit buttons with uploaded sounds
function handleUpload(fileList) {

    if (fileList.length < 1)
    {
        console.log("no files selected");
    }
    else
    {

        // check if LOCAL option already exists
        if (!$("#local").length)
        {
            $(".form-control").append("<option selected id=\"local\" value=\"local\">USER</option>");
        }

        clear();
        var pathList = Array();
        var names = Array();

        for (var i = 0, j = fileList.length; i < j; i++ ) {

            fileName = fileList[i].name;

            names[i] = fileName.substring(0, fileName.lastIndexOf("."));
            pathList[i] = URL.createObjectURL(fileList[i]);
        }

        createButtons(names, pathList, true);

        // load sounds into buffer; calls finishedLoading upon completion
        var bufferLoader = new BufferLoader(context, pathList, finishedLoading);
        bufferLoader.load();
    }
}

// add options to dropdown menu
function makeKitList(names) {

    var template = _.template("<option value=\"<%- ASSET_PATH + \"/\" + name %>\"><%- name %></option");

    for (var i = 0, j = names.length; i < j; i++) {

            // slice up until the file type
            var name = names[i].substring(names[i].lastIndexOf("/") + 1);

            // add button to DOM
            $(".form-control").append(template({ name: name }));
    }
    $("select").on("change", function(){

        clear();
        if (this.value == "local")
        {
            // console.log(document.getElementById("upload").files);
            handleUpload(document.getElementById("upload").files);
        }
        else
        {
            getPaths(this.value);
        }
        
    })
}

// clears current kit
function clear() {
    $("#buttons").empty();
    buffers = Array();
    soundNames = Array();
}

// calls a server side script to generate the paths of kit sounds
function getPaths(kit) {

    // use a JSON get request to return a JSON object containing an array of
    // paths to the individual kit sounds
    $.getJSON("paths.php", { path: kit }, loadSounds);
}

// create sound triggers
function createButtons(data, pathList, user) {

    // html template for sound buttons with corresponding trigger keys
    var template = _.template("<li><button id='<%- name %>'><%- name %> (<%- key%>)</button></li>");

    // for readability
    var str;

    for (var i = 0, j = data.length; i < j; i++) {

        str = data[i];

        if (!user) 
        {

            // slice up until the file type
            soundNames[i] = str.substring(str.lastIndexOf("/") + 1, str.lastIndexOf("."));

            // add formatted path to pathList
            pathList[i] = str;
        }
        else 
        {
            soundNames[i] = str;
        }

        // add button to DOM
        $("#buttons").append(template({ name: soundNames[i], key: KEYS[i] }));

    }
}
// loads sounds from paths supplied by JSON data
function loadSounds(data, textStatus, jqXHR) {

    // paths to be queried by the BufferLoader object
    var pathList = Array();

    // ensure some data returned
    if (data.length > 0)
    {
        createButtons(data, pathList, false);
    }
    else
    {
        console.log("Empty" + kit + " folder.");
    }

    // load sounds into buffer; calls finishedLoading upon completion
    var bufferLoader = new BufferLoader(context, pathList, finishedLoading);
    bufferLoader.load();
}

// create associative array with sound name keys and audio buffer values
function finishedLoading(bufferList) {

    for (var i = 0, j = bufferList.length; i < j; i++) {
        buffers[soundNames[i]] = bufferList[i];
    }

    // trigger load complete call to add event listeners
    $(document).trigger('load_complete');
}
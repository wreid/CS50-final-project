
// create a global context
var context = new (window.AudioContext || window.webkitAudioContext)();
var recorders = [];
var recorderIndex = 0;

function init(){
    // poly fill 
    navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
        getUserMedia: function(c) {
        return new Promise(function(y, n) {
            (navigator.mozGetUserMedia ||
            navigator.webkitGetUserMedia).call(navigator, c, y, n);
        });
        }
    } : null);

    if (!navigator.mediaDevices) {
        console.log("getUserMedia() not supported.");
        return;
    }

    var constraints = { audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function( stream ) {
            // globally defined source for startRecording()
            source = context.createMediaStreamSource(stream);
        })
        .catch(function(e) { //error checking
            console.log(e.name);
        });

    // recording flag
    var recording = false;

    // recording listener
    document.querySelector('#start-recording').onclick = function() {  
        console.log(recording);
        if (!recording) {
            startRecording(source);
            recording = true;
            console.log(recording);
        }
        else {
            stopRecording();
            recording = false;
            console.log(recording);
        }
    };

}

function startRecording(input){
    // create new recorder
    recorders[recorderIndex] = new Recorder(input);
    recorders[recorderIndex].record();
    console.log("started recording");
}

function stopRecording(){
    recorders[recorderIndex].stop();
    recorders[recorderIndex].getBuffer(getBufferCallback);
    recorderIndex++;
    console.log("stopped recording");
}

function getBufferCallback(buffers) {
    console.log("called back");
    var newSource = context.createBufferSource();
    var newBuffer = context.createBuffer(2, buffers[0].length, context.sampleRate);
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    newSource.connect(context.destination);
    newSource.start(0);
    console.log("end of callback");
}

// run intitialization on DOM load
window.onload = function(){
    console.log("finished loading");
    init(context);
}

Test

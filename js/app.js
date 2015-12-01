
// create a global context
context = new (window.AudioContext || window.webkitAudioContext)();
var recording = false;

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
    .then(function(stream) {
        source = stream;
    })
    .catch(function(e) { //error checking
        console.log(e.name);
    });

    document.querySelector('#start-recording').onclick = function() {  
        if (!recording) {
            startRecording(source);
            recording = true;
        }
        else {
            stopRecording;
            recording = false;
        }
    };


}
function startRecording(stream){
    // create new recorder
    var rec = new Recorder(stream);
    rec.record();
}

function stopRecording(){
    rec.stop();
    rec.getBuffer(getBufferCallback);
}

function getBufferCallback( buffers ) {
    var newSource = audioContext.createBufferSource();
    var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    newSource.connect(audioContext.destination);
    newSource.start(0);
}

// run intitialization on DOM load
window.onload = function(){
    console.log("finished loading");
    init(context);
}
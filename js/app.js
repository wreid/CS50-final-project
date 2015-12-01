
// var create a global context
var context = new (window.AudioContext || window.webkitAudioContext)();

// stereo
var channels = 2;

// buffer at most ten seconds of audio
var maxFrameCount = context.sampleRate * 10.0;

var buffer = context.createBuffer(channels, maxFrameCount, context.sampleRate);

// poly fill to set mediaDevices 
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
    startRecording(source);
};

function startRecording(stream){
  // create new recorder
  mediaRecorder = new MediaStreamRecorder(stream);
  mediaRecorder.mimeType = 'audio/ogg';
  mediaRecorder.audioChannels = 2;
  mediaRecorder.ondataavailable = function (blob){
    console.log("here!");
  }
}


function createOscillator(context) {
  osc = context.createOscillator()
  osc.frequency.value = 440           // set the frequency to 440 HZ
  osc.connect(context.destination)    // set the output to speakers
  osc.start(0)                        // start immediately
  setTimeout(function() { osc.stop() }, 2000) // stop the oscillator 2 seconds from now
  // osc.start(0) <--- this will cause an error! you need to create a new oscillator
}

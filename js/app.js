
// create a global context
context = new (window.AudioContext || window.webkitAudioContext)();

navigator = window.navigator;

navigator.getUserMedia = ( navigator.getUserMedia || 
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia || 
  navigator.msGetUserMedia);


function init(){
  // poly fill 
  // navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
  //    getUserMedia: function(c) {
  //      return new Promise(function(y, n) {
  //        (navigator.mozGetUserMedia ||
  //         navigator.webkitGetUserMedia).call(navigator, c, y, n);
  //      });
  //    }
  // } : null);

  // if (!navigator.mediaDevices) {
  //   console.log("getUserMedia() not supported.");
  //   return;
  // }

  // navigator.mediaDevices.getUserMedia({ audio: true })
  // .then(function(stream) {
  //   source = context.createMediaStreamSource(stream);
  //   source.connect(context.destination);
  // })
  // .catch(function(e) {
  //   console.log(e.name);
  // });

  var constraints = { audio: true };

  navigator.getUserMedia(constraints, 
    function(stream) {
      source = context.createMediaStreamSource(stream);
      source.connect(context.destination);
    },
    function(e){
      console.log(e.name);
    });

}

function createOscillator(context) {
    osc = context.createOscillator()
    osc.frequency.value = 440           // set the frequency to 440 HZ
    osc.connect(context.destination)    // set the output to speakers
    osc.start(0)                        // start immediately
    setTimeout(function() { osc.stop() }, 2000) // stop the oscillator 2 seconds from now
    // osc.start(0) <--- this will cause an error! you need to create a new oscillator
}

window.onload = function(){
  console.log("finished loading");
  init(context);
}
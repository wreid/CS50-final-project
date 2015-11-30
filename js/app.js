
// Create a global context
context = new (window.AudioContext || window.webkitAudioContext)();

function init(context){
  
  var p = navigator.mediaDevices.getUserMedia({audio: true});
  p.then(function(stream){
    source = context.createMediaStreamSource(stream);
    source.connect(context.destination);
  })

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
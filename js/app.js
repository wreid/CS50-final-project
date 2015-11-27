
// Create a global context
context = new AudioContext()


function createOscillator(context) {
    osc = context.createOscillator()
    osc.frequency.value = 440           // set the frequency to 440 HZ
    osc.connect(context.destination)    // set the output to speakers
    osc.start(0)                        // start immediately
    setTimeout(function() { osc.stop() }, 2000) // stop the oscillator 2 seconds from now
    // osc.start(0) <--- this will cause an error! you need to create a new oscillator
}


function playFile(context) {
    bufferLoader = new BufferLoader(
        context,
        [
          '../sounds/any_song_you_want.mp3',
          '../sounds/another_song.wav'
        ],
        finishedLoading
    );

  bufferLoader.load();
}

Base.prototype.play = function(time, buffer) {
    var source = globalContext.createBufferSource();
    var gain = globalContext.createGain();
    source.buffer = (buffer !== undefined) ? buffer : this.buffer;
    gain.gain.value = this.gain;
    source.connect(gain);
    gain.connect(globalContext.destination);
    source.start(time);
}
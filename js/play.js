/* TRIGGER & PLAY FUNCTIONS */


// triggers sound when event listener activated
function triggerPlay(event) {

    // determine whether click or keypress
    if (event.data.keyPress)
    {
        // get char of key pressed
        var c = String.fromCharCode(event.keyCode);

        // get index of char
        var i = keys.indexOf(c);

        // play sound corresponding with index if exists
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
    source.connect(masterGainNode);       // connect the source to gain node
    source.start(time);                           // play the source now
}
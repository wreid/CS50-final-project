/* TRIGGER & PLAY FUNCTIONS */


// triggers sound when event listener activated
function triggerPlay(event) {

    // determine whether click or keypress
    if (event.data.keyPress)
    {

        // check for space bar
        if (event.keyCode == SPACE_KEY_CODE)
        {
            if (playing && !loopExists) // if on first pass of loop
            {
                
                loopLength = context.currentTime - loopStartTime;

                scheduler();
                intervalID = window.setInterval(scheduler, loopLength * 1000);

                toggleRecording();
                loopExists = true;
            } 
            else if (playing && loopExists)
            {
                stopLoop();
            }
            else
            {
                startLoop();
            }
        }
        else if (event.keyCode == RECORD_KEY_CODE)
        {
            toggleRecording();
        }
        else
        {

            // get char of key pressed
            var c = String.fromCharCode(event.keyCode);

            // get index of char
            var i = KEYS.indexOf(c);

            // play sound corresponding with index if exists
            if (soundNames[i])
            {

                playSound(soundNames[i], NOW);

                // if recording enabled, record the note
                if (recordToggle)
                {
                    var offset = loopExists ? (context.currentTime - loopStartTime) 
                        % loopLength : context.currentTime - loopStartTime;

                    console.log(offset);
                    addNote(soundNames[i], offset);
                }
                    
            }   
        }
        
    }
    else if (event.data.buttonPress)
    {

        playSound(event.data.name, NOW);

        // if recording enabled, record the note
        if (recordToggle)
        {
            var offset = loopExists ? (context.currentTime - loopStartTime) 
                        % loopLength : context.currentTime - loopStartTime;
            addNote(event.data.name, offset);
        }
    }
    else
    {
        console.log("Key not set");
    }
}

// plays sound in time seconds
function playSound(name, offset) {

    var buffer = buffers[name];
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(masterGainNode);       // connect the source to gain node
    source.start(context.currentTime + offset);                           // play the source now
}
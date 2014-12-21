// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var audioUrls = [
    './asset/sound/drumroll.mp3',
    './asset/sound/coin.wav',
    './asset/sound/doraemon.wav',
    './asset/sound/crup.mp3',
    './asset/sound/crup2.wav',
    './asset/sound/1up.wav'
];
var audioBuffers = [];
var playIdx;

window.addEventListener("load", init, false)

function init() {

    audioUrls.forEach(function(url, idx) {
        loadSound(url,idx);
    })

}

function loadSound(url, idx) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    var idx = idx;

    var onSuccess = function(buffer) {
        audioBuffers[idx] = buffer;
    }

    var onError = function(e) {
        console.log('ERROR', e)
    }

    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, onSuccess, onError);
    }

    request.send();
}

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.connect(context.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source now
    // note: on older systems, may have to use deprecated noteOn(time);
}

function playDrumRoll(){
    playSound(audioBuffers[0]);
}

function playCoin(){
    playSound(audioBuffers[1]);
}

function playDoraemon(){
    playSound(audioBuffers[2]);
}

function playCrup(){
    playSound(audioBuffers[3]);
}

function playCrup2(){
    playSound(audioBuffers[4]);
}

function play1up(){
    playSound(audioBuffers[5]);
}

// global constants

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//Global Variables
var pattern = [3, 2, 4, 2, 3, 1, 2, 1];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume=0.5 //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var mistakes=0;


function startGame(){
    //initialize game variables
  mistakes=0;
  clueHoldTime = 1000
    progress = 0;
    gamePlaying = true;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");
  randompattern();
  playClueSequence();
}

function stopGame(){
    gamePlaying = false;
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 529.6,
  3: 399,
  4: 499.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter=0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    clueHoldTime -= 30; // Speed up the clue playback on each turn to make the game harder as it goes on.
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){//correct guess
    if(guessCounter == progress){ 
      if(progress == pattern.length - 1){
        winGame();// reached the end of pattern ; win game
      }else{
        // add progress. play next turn
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;// correct guess , increase guess counter
    }
  }else{
    mistakes++;
      if (mistakes<3){// Allows the user to make 2 mistakes
        playClueSequence();
      }
    else{
      loseGame();// incorrect guess lose game
    }
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function randompattern(){
  const ARRAY_LENGTH = 7
  const randomArray = []
    for(let i = 0; i<ARRAY_LENGTH; i++) {
      randomArray.push(Math.floor(Math.random()*4+1))
      pattern=randomArray;
    }
}
var introSequence = [];
var radarSequence = [];
var todaySequence = [];
var tonightSequence = [];
var beyondSequence = [];
var outlookSequence = [];
var narration = new Audio();
narration.volume = 0.9;
var currentSequenceArray;
var currentIndex = 0;

function playCurrentConditionsNarration(){
  var randomInt = Math.floor(Math.random() * 2) + 1;
  introSequence.push("assets/narrations/main/intro" + randomInt + ".mp3");
  introSequence.push("assets/narrations/temperature/" + currentTemperature + ".mp3");
  introSequence.push("assets/narrations/conditions/" + conditionFile[currentCondition]() + ".mp3");
  playSequence(introSequence);
}

function playOutlookNarration(){
  outlookSequence.push("assets/narrations/main/outlook.mp3");
  playSequence(outlookSequence);
}

function playRadarNarration(){
  var randomInt = Math.floor(Math.random() * 2) + 1;
  radarSequence.push("assets/narrations/main/radar" + randomInt + ".mp3");
  playSequence(radarSequence);
}

function playTodayNarration(){
	var randomInt = Math.floor(Math.random() * 2) + 1;
	todaySequence.push("assets/narrations/main/today" + randomInt + ".mp3");
	playSequence(todaySequence);
}

function playTonightNarration(){
	var randomInt = Math.floor(Math.random() * 2) + 1;
	tonightSequence.push("assets/narrations/main/tonight" + randomInt + ".mp3");
	playSequence(tonightSequence);
}

function playBeyondNarration(){
	var randomInt = Math.floor(Math.random() * 2) + 1;
	beyondSequence.push("assets/narrations/main/tomorrow" + randomInt + ".mp3");
	playSequence(beyondSequence);
}

function playSequence(sequenceArray){
  currentSequenceArray = sequenceArray;
  softenMusicVolume();
  playNarration();
}

narration.onended = function() {
  var itemsLeftInSequence = currentIndex < currentSequenceArray.length;
  if(itemsLeftInSequence){
    playNarration();
  }
  else{
    resetMusicVolume();
    currentIndex = 0;
  }
};

function playNarration(){
  narration.src = currentSequenceArray[currentIndex];
  currentIndex++;
  narration.play();
}

function softenMusicVolume(){
  music.volume = 0.2;
}

function resetMusicVolume(){
  music.volume = 1;
}

function setMainBackground(){
  getElement('background-image').style.backgroundImage = 'url(' + getRandomBackgroundPath() + ')';
}

function getRandomBackgroundPath(){
  var backgroundFolder = getBackgroundFolder();
  var folderCount = getFolderCount(backgroundFolder);
  var index = randomNumber(folderCount);
  var season = chooseSeason();
  var time = chooseTime();
  var condition = chooseWeather();
  var filePath;
  if(backgroundFolder = "other"){
	filePath = 'assets/backgrounds/other/' + season + "/" + time + "/" + condition + "/" + index + '.jpg';
  }else{
    filePath = 'assets/backgrounds/' + backgroundFolder + "/" + index + '.jpg';
  }
  return filePath;
}

function chooseWeather(){
  var condition = currentIcon;
  var weather = "fair";
  if(condition.includes("snow") || condition.includes("flurr")){
    weather = "snowy";
  }else if(condition.includes("rain")){
    weather = "cloudy";
  }else if (condition.includes("fog") || condition.includes("haz")){
    weather = "cloudy";
  }else if(condition.includes("storm")){
    weather = "cloudy";
  }
  return weather;
}

function getBackgroundFolder(){
  var condition = currentIcon;
  var backgroundFolder = "other";
  if(condition.includes("snow") || condition.includes("flurr")){
    backgroundFolder = "snow";
  }else if(condition.includes("rain")){
    backgroundFolder = "rain";
  }else if (condition.includes("fog") || condition.includes("haz")){
    backgroundFolder = "fog";
  }else if(condition.includes("storm")){
    backgroundFolder = "tstorm";
  }
  return backgroundFolder;
}

function getFolderCount(folderName){
  switch(folderName) {
    case 'snow':
      return 3;
    case 'rain':
      return 3;
    case 'fog':
      return 3;
    case 'tstorm':
      return 3;
    case 'other':
      return 3;
    default:
      return 0;
  }
}

function chooseTime () {
	var hours = new Date().getHours();

	// If it's between 8:00PM and 5:59AM, return 'night'.
	if (hours <= 5 || hours >= 20) {
		return 'night';
	}
	// If it's between 6:00AM and 3:59PM, return 'day'.
	if (hours >= 6 && hours <= 15) {
		return 'day';
	}
	// If it's between 4:00PM and 7:59PM, return 'evening'.
	if (hours >= 16 && hours <= 19) {
		return 'evening';
	}
}

function chooseSeason () {
	var month = new Date().getMonth();

	// If it's December - February, return 'winter'.
	if (month >= 11 || month <= 1) {
		return 'winter';
	}
	// If it's March - May, return 'spring'.
	if (month >= 2 && month <= 4) {
		return 'spring';
	}
	// If it's June - August, return 'summer'.
	if (month >= 5 && month <= 7) {
		return 'summer';
	}
	// If it's September - November, return 'fall'.
	if (month >= 8 && month <= 10) {
		return 'fall';
	}
}

function randomNumber(max){
  return Math.floor(Math.random() * max) + 1
}

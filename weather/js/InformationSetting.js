function setGreetingPage(){
  getElement("hello-location-text").innerHTML = cityName + ",";
  getElement("infobar-location-text").innerHTML = cityName;
  getElement("greeting-text").innerHTML = greetingText;
  getElement("crawl-text").innerHTML = crawlText.toUpperCase();
}

function setTimelineEvents(){
  var eventContainer = getElement('timeline-event-container');
  var progreessBarStack = getElement('progress-stack');
  for(var i = 0; i < pageOrder.length; i++){
    var eventElement = document.createElement("div");
    eventElement.innerHTML = pageOrder[i].name;
    eventElement.classList.add("regular-text");
    eventElement.classList.add("timeline-item");
    eventElement.style.transitionDelay = (i*200).toString() + "ms";
    eventContainer.appendChild(eventElement);

    if(i !== 0){
      var progressElement = document.createElement("div");
      progressElement.classList.add("timeline-bar");
      progreessBarStack.appendChild(progressElement);
    }
  }
}

function setRadarImages(){
  radarImage = new Image();
  radarImage.onerror = function () {
    getElement('radar-container').style.display = 'none';
  }
  radarImage.src = 'assets/radar/br1.png';

  if(pageOrder == SINGLE || pageOrder == MULTIPLE){
    zoomedRadarImage = new Image();
    zoomedRadarImage.onerror = function () {
      getElement('zoomed-radar-container').style.display = 'none';
    }
    zoomedRadarImage.src = 'https://radar.weather.gov/Legend/N0R/SGF_N0R_Legend_0.gif';
  }
}

function setCurrentConditions(){
  getElement('cc-condition').innerHTML = currentCondition;
  getElement('cc-wind').innerHTML = windSpeed;
  getElement('cc-gusts').innerHTML = gusts;
  getElement('cc-feelslike').innerHTML = feelsLike;
  getElement('cc-pressuretrend').innerHTML = pressureTrend;
  getElement('ccicon').src = currentIcon;
}

function createLogoElements(){
  var alreadyAddedLogos = [];
  for(var p = 0; p < pageOrder.length; p++){
    for (var s = 0; s < pageOrder[p].subpages.length; s++) {
      //for every single sub page
      var currentPage = getPageLogoFileName(pageOrder[p].subpages[s].name);

      if(!alreadyAddedLogos.includes(currentPage)){
        var logo = new Image();
        logo.style.width = '85px';
        logo.style.height = '85px';
        logo.style.marginRight = '20px'
        logo.src = 'assets/timeline/' + currentPage;
        getElement('logo-stack').appendChild(logo);
        alreadyAddedLogos.push(currentPage);
      }
    }
  }
}

function setGreeting(){
    greetingText = greetings[randomNumber(23)];
}

// This is the invidual day stuff (Today, Tomorrow, etc.)
function setForecast(){
  // Store all the needed elements as arrays so that they can be referenced in loops
  var forecastNarrativeElement=
  [getElement("today-narrative-text"),
  getElement("tonight-narrative-text"),
  getElement("tomorrow-narrative-text"),
  getElement("tomorrow-night-narrative-text")];

  var forecastTempElement =
  [getElement("today-forecast-temp"),
  getElement("tonight-forecast-temp"),
  getElement("tomorrow-forecast-temp"),
  getElement("tomorrow-night-forecast-temp")];

  var forecastIconElement =
  [getElement("today-forecast-icon"),
  getElement("tonight-forecast-icon"),
  getElement("tomorrow-forecast-icon"),
  getElement("tomorrow-night-forecast-icon")];

  var forecastPrecipElement =
  [getElement("today-forecast-precip"),
  getElement("tonight-forecast-precip"),
  getElement("tomorrow-forecast-precip"),
  getElement("tomorrow-night-forecast-precip")];

  for (var i = 0; i < 4; i++) {
    forecastNarrativeElement[i].innerHTML = forecastNarrative[i];
    forecastTempElement[i].innerHTML = forecastTemp[i];
    forecastPrecipElement[i].innerHTML = forecastPrecip[i];

    var icon = new Image();
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.src = forecastIcon[i];
    forecastIconElement[i].innerHTML = '';
    forecastIconElement[i].appendChild(icon);
  }
}

function setOutlook(){ // Also known as 7day page
  for (var f = 0; f < 7; f++) {
    var textElement = getElement("day" + f + "-text");
    var highElement = getElement("day" + f + "-high");
    var lowElement = getElement("day" + f + "-low");
    var conditionElement = getElement("day" + f + "-condition");
    var containerElement = getElement("day" + f + "-container");
    var iconElement = getElement("day" + f + "-icon");
    var dayIndex = (new Date().getDay()+ f) % 7;
	
    var icon = new Image();
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.src = periodIcon[f];
    iconElement.innerHTML = '';
    iconElement.appendChild(icon);

    // Set weekends to transparent
    var isWeekend = dayIndex == 0 || dayIndex == 6;
    if(isWeekend){
      containerElement.style.backgroundColor = "transparent"; //weekend
    }
    textElement.innerHTML = WEEKDAY[dayIndex];

    highElement.innerHTML = periodTemperature[f];
    lowElement.innerHTML = periodTemperature[f];
    conditionElement.innerHTML = periodCondition[f];
	}
  }

function setAlertPage(){
  if(alerts.length === 0)
    return;

  if(alerts.length == 1){
    getElement("single-alert0").innerHTML = alerts[0];
  }
  else{
    for(var i = 0; i < Math.min(3, alerts.length); i++){
      var idName = 'alert' + i;
      getElement(idName).innerHTML = alerts[i];
    }
  }
}

/* Because the first page always animates in from bottom, check if
   current page is first and set either left or top to 0px. */
function setInitialPositionCurrentPage(){
  if(pageOrder[0].subpages[0].name == 'current-page'){
    getElement('current-page').style.left = '0px';
  }
  else{
    getElement('current-page').style.top = '0px';
  }
}

function getPageLogoFileName(subPageName){
  switch (subPageName) {
    case "single-alert-page":
      return "8logo.svg";
    break;

    case "multiple-alerts-page":
      return "8logo.svg";
    break;

    case "current-page":
      return "thermometer.svg";
    break;

    case "radar-page":
      return "radar1.svg";
    break;

    case "zoomed-radar-page":
      return "radar2.svg";
    break;

    case "today-page":
      return "calendar.svg";
    break;

    case "tonight-page":
      return "calendar.svg";
    break;

    case "tomorrow-page":
      return "calendar.svg";
    break;

    case "tomorrow-night-page":
      return "calendar.svg";
    break;

    case "7day-page":
      return "week.svg";
    break;
  }
}

/* IT Dashboard Weather Functions
Written By: Sean Apple
Modified: 4/13/19 by Sean Apple

Contains functions related to the weather app */

/* Global Variables */
var currentCondition;
var windSpeed;
var gusts;
var visibility;
var humidity;
var dewPoint;
var pressure;
var currentIcon;
var currentTemperature;

function loadWx(){
 fetchCurrentWeather();
}

function nwsEnlarge(officeCode){
  var convertCode = officeCode.toUpperCase();
  if(officeCode == 'natl'){
    navigate("NOAA Radar - National", "https://radar.weather.gov/Conus/Loop/NatLoop_Small.gif")
  } else {
    navigate("NOAA Radar - " + convertCode, "https://radar.weather.gov/ridge/lite/N0R/"+convertCode+"_loop.gif")
  }
}

function loadApp(){
      // Set Navigation Title
      setTimeout(function () {
          setPageName("Weather");
      }, 500);

      if(urlParams == null){
        setTimeout(function () {
          loadWx();
        }, 500);
      }
}

/* Modal Commands */
function showPopup(){
  document.getElementById("iframeCard").className = "uk-animation-fade iframe-show";
}

function closePopup(){
  document.getElementById("iframeCard").className = "uk-animation-fade iframe-hide";
}

function expandPopup(){
window.open(document.getElementById("iframeURL").src);
}

function navigate(title, URL){
  var self = this;
  setTimeout(function(){
      document.getElementById("iframeTitle").innerHTML = title;
      document.getElementById("iframeURL").method = 'get';
      document.getElementById("iframeURL").src = URL;
      self.showPopup();
  }, 300);   
}
  
/* Weather Fetching */
function fetchCurrentWeather(){
  // Get Rolla National Airport's Observations for NOAA JSON API
  fetch('https://api.weather.gov/stations/KVIH/observations/current', {
	  headers:{
		  'user-agent': 'ithelp@mst.edu - IT @ Missouri S&T (Webkit)',
		  'accept': 'application/geo+json'
		  }
  })
  // Report error if contact failure
  .then(function(response) {
    if (response.status !== 200) {
      console.log("conditions request error");
      return;
    }
    // Get/Calculate Data if response
    response.json().then(function(data) {
	  if (data.properties.temperature.value == null){
		  currentTemperature = '--';
	  } else {
		 currentTemperature = Math.round(data.properties.temperature.value*1.8+32); 
	  }
      currentCondition = data.properties.textDescription;
	  console.log(currentCondition);
      windSpeed = Math.round(data.properties.windSpeed.value*2.23694) + " mph";
      gusts = data.properties.windGust.value;
      if(gusts == "null"){gusts = "NONE";}
      visibility = Math.round((data.properties.visibility.value / 1000)/1.609344);
      humidity = Math.round(data.properties.relativeHumidity.value);
      dewPoint = Math.round(data.properties.dewpoint.value*1.8+32);
      pressure = Math.round(data.properties.barometricPressure.value*0.00029530)*(-1);
      currentIcon = data.properties.icon;
	  document.getElementById('icon').src = currentIcon;
	  document.getElementById('tmp').innerHTML = currentTemperature + '&deg';
	  document.getElementById('current').innerHTML = currentCondition;
	  document.getElementById('windhum').innerHTML = 'Wind: ' + windSpeed + '<br/>Humidity: ' + humidity + '%';
      document.getElementById('visdewpress').innerHTML = 'Visibility: ' + visibility + ' miles<br/>Dew Point: ' + dewPoint + '&deg' + '<br/>Pressure: ' + pressure;
    });
  })
}
function fetchAlerts(){
  var alertCrawl = "";
  fetch('https://api.weather.gov/alerts/active/zone/' + zoneID, {
	  headers:{
		  'user-agent': 'apples@mst.edu - Automated Weather Display (Webkit)',
		  'accept': 'application/geo+json'
		  }
  })
  .then(function(response) {
    if (response.status !== 200) {
      console.log("forecast request error");
      return;
    }
    response.json().then(function(data) {
      for(var i = 0; i < data.features.length; i++){
        /* Take the most important alert message and set it as crawl text
           This will supply more information i.e. tornado warning coverage */
        alertCrawl = alertCrawl + " " + data.features[i].properties.description.replace("...", "");

        // ignore special weather statements
        if(data.features[i].properties.type == "SPE"){
          continue;
        }
        alerts[i] = data.features[i].properties.description.replace("...", "").split("...", 1)[0].split("*", 1)[0].split("for", 1)[0].replace(/\n/g, " ").replace("...", "").toUpperCase();
		console.log(alerts[i]);
      }
      if(alertCrawl != ""){
        crawlText = alertCrawl;
      }
      fetchForecast();
    });
  })
}

function fetchForecast(){
	fetch('https://api.weather.gov/gridpoints/' + officeID + '/' + gridpoints + '/forecast', {
	  headers:{
		  'user-agent': 'apples@mst.edu - Automated Weather Display (Webkit)',
		  'accept': 'application/geo+json'
		  }
  })
  .then(function(response) {
    if (response.status !== 200) {
      console.log("forecast request error");
      return;
    }
    response.json().then(function(data) {
      // 7 day data
      for (var i = 0; i < 14; i++) {
		periodName[i] = data.properties.periods[i].name;
		periodTemperature[i] = data.properties.periods[i].temperature;
		periodIcon[i] = data.properties.periods[i].icon;
		periodCondition[i] = data.properties.periods[i].shortForecast;
		periodCondition[i] = periodCondition[i].replace("Thunderstorm", "Thunder</br>storm");
		console.log(data.properties.periods[i].name + "..." +
					data.properties.periods[i].temperature + "..." +
					data.properties.periods[i].shortForecast);
      }
      // narratives
      for (var i = 0; i <= 3; i++){
       forecastTemp.push(data.properties.periods[i].temperature);
       forecastIcon[i] = data.properties.periods[i].icon;
       forecastNarrative[i] = data.properties.periods[i].detailedForecast;
       forecastPrecip[i] = guessPrecipitation(forecastNarrative[i], forecastTemp[i]);
      }
      scheduleTimeline();
    });
  })
}

function fetchCurrentWeather(){
  fetch('https://api.weather.gov/stations/' + stationID + '/observations/current', {
	  headers:{
		  'user-agent': 'apples@mst.edu - Automated Weather Display (Webkit)',
		  'accept': 'application/geo+json'
		  }
  })
  .then(function(response) {
    if (response.status !== 200) {
      console.log("conditions request error");
      return;
    }
    response.json().then(function(data) {
      //try{cityName = data.current_observation.display_location.city.toUpperCase();}
      //catch(err){alert("Enter valid ZIP code"); getZipCodeFromUser(); return;}
	  if (data.properties.temperature.value == null){
		  currentTemperature = '404';
	  } else {
		 currentTemperature = Math.round(data.properties.temperature.value*1.8+32); 
	  }
      currentCondition = data.properties.textDescription;
	  console.log(currentCondition);
      windSpeed = degToCard(data.properties.windDirection.value) + " " + Math.round(data.properties.windSpeed.value*2.23694) + "mph";
      gusts = data.properties.windGust.value;
      if(gusts == "null"){gusts = "NONE";}
      // feelsLike = data.current_observation.feelslike_f;
      visibility = Math.round((data.properties.visibility.value / 1000)/1.609344);
      humidity = Math.round(data.properties.relativeHumidity.value);
      dewPoint = Math.round(data.properties.dewpoint.value);
      pressure = Math.round(data.properties.barometricPressure.value*0.00029530)*(-1);
      //if(data.current_observation.pressure_trend == "+"){
      //  pressureTrend = "▲"
      //}else{
      //  pressureTrend = "▼"
      //}
	  pressureTrend = "-"
      currentIcon = data.properties.icon;
      fetchAlerts();
    });
  })
}

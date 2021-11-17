/* IT Dashboard Customization Functions
Written By: Sean Apple
Modified: 4/13/19 by Sean Apple

Contains functions related to the customization of the layout of the website. */

var isDark = false; // Lets the page/script check if dark mode is active without reading cookie everytime.
var setupMode = true; // Lets loadApp know to not run if in setup mode.

function saveFirstTime(){
  // Clear setup hold
  Cookies.set('setup', 'yes', { expires: Infinity });
  // Get runMode Index and send to setMode
  var runMode = document.getElementById("runMode").selectedIndex;
  setMode(runMode);
  // Get darkmode and send to setDarkmode
  var darkChecked = document.getElementById("darkmode").checked;
  setDarkmode(darkChecked);
  // Save Background URL
  Cookies.set('backgroundURL', document.getElementById("backURL").value, { expires: Infinity });
  // Alert refresh, 3 seconds and refresh.
  UIkit.notification('Settings saved. Reloading page...');
  setTimeout(function () {
    window.location.reload();
    }, 3000);
}

function loadPage(){
  // Check if setup
  var isSetup = Cookies.get('setup');
  if(isSetup == 'yes'){
    // Change setupMode
    setupMode = false;
    // Get mode and reset grid
    var modeToSet = Cookies.get('mode');
    loadMode(modeToSet);
    // Replace CSS for darkmode, if needed
    var darkSwitch = Cookies.get('dark');
    if(darkSwitch == 'enabled'){toggleDarkmode(true); isDark = true;}
    // Load Background Image
    var bURL = Cookies.get('backgroundURL');
    if(bURL == 'none') {
      document.body.style.backgroundImage = "none"
    } else {
      document.body.style.backgroundImage = "url('" + bURL+ "')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    }
  }
  // Run HTML includes after letting all the above complete
  setTimeout(function (){
    includeHTML();
    setTimeout(function (){
      // Set Opacity
      var level = Cookies.get('cardOpacity');
      var cardList = document.getElementsByClassName("uk-card");
      console.log(cardList);
      console.log(level);
      for(var i=0; i<cardList.length; i++){
        cardList[i].style.opacity = level;
      }
    }, 250);
    
  }, 250);
  // Hand over to app.js for the app if setup is complete.
  if(!setupMode){loadApp();}
}

function loadMode(mode){
  switch(parseInt(mode, 10)){
    case 0:
      replaceGrid("./templates/dash/call.html")
      break;
    case 1:
      replaceGrid("./templates/dash/walkin.html")
      break;
    case 2:
      replaceGrid("./templates/dash/pros.html")
      break;
    case 3:
      replaceGrid("./templates/dash/deploy.html")
      break;
    default:
      window.location = "error.html";
  }        
}

function setDarkmode(lightswitch){
  var cookieValue = null;
  // Set value based on lightswitch and set cookie.
  if(lightswitch){cookieValue = "enabled"} else {cookieValue = "disabled"};
  Cookies.set('dark', cookieValue, { expires: Infinity });
  // Display Success Message
  UIkit.notification({message: 'Dark mode ' + cookieValue + ' successfully!', status: 'success'});
}

function setMode(mode){
  // Set cookie.
  Cookies.set('mode', mode, { expires: Infinity });
  // Based on mode, display corresponding success message.
  switch(mode){
      case 0:
        UIkit.notification({message: 'Default set to Call Center.', status: 'success'})
        break;
      case 1:
        UIkit.notification({message: 'Default set to Walk-in.', status: 'success'})
        break;
      case 2:
        UIkit.notification({message: 'Default set to Desktop Pros.', status: 'success'})
        break;
      case 3:
        UIkit.notification({message: 'Default set to Deployment.', status: 'success'})
        break;
  }        
}

function replaceGrid(newgrid){
  document.getElementById("grid-holder").setAttribute("it-include-html", newgrid);
}

function toggleDarkmode(lightswitch){

    var oldlink = document.getElementsByTagName("link").item(0);
    var newlink = document.createElement("link");
    var stoldlink = document.getElementsByTagName("link").item(1);
    var stnewlink = document.createElement("link");

    if(lightswitch){
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", "./styles/uikit-dark.css");

      stnewlink.setAttribute("rel", "stylesheet");
      stnewlink.setAttribute("type", "text/css");
      stnewlink.setAttribute("href", "./styles/mst-custom-dark.css");

      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
      document.getElementsByTagName("head").item(0).replaceChild(stnewlink, stoldlink);
    } else {
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", "./styles/uikit.css");

      stnewlink.setAttribute("rel", "stylesheet");
      stnewlink.setAttribute("type", "text/css");
      stnewlink.setAttribute("href", "./styles/mst-custom.css");

      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
      document.getElementsByTagName("head").item(0).replaceChild(stnewlink, stoldlink);
    }  
}

function setPageName(name){
    document.getElementById('page-title').innerHTML = name;
}

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("it-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("it-include-html");
            includeHTML();
          }
        } 
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
}


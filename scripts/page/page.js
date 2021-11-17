/* IT Dashboard Page Functions
Written By: Sean Apple
Modified: 4/18/19 by Sean Apple

Contains functions related to page generation */

/* Constant URL Parameters */
const rootFile = '';
const versionNumber = '?65';
const urlParams = new URLSearchParams(window.location.search);
const appParam = parseInt(urlParams.get('app'), 10);
const modeParam = parseInt(urlParams.get('mode'), 10);
const typeParam = urlParams.get('type');
const radarParam = urlParams.get('radar');
const errorParam = urlParams.get('code');
// Others will be handled by each app.

/* Other Variables */
var isDark = false; // Lets the page/script check if dark mode is active without reading cookie everytime.
var isSetup = Cookies.get('setup');

function generatePage(){

    // Check if setup
    if(isSetup == 'yes'){
        var goMode = parseInt(Cookies.get('mode'), 10);
        // Check if app and mode exist in URL
        if(isNaN(appParam) && isNaN(modeParam)){
            // Redirect to dashboard
            window.location.replace('./'+rootFile+'?app=1&mode='+goMode);
        } else if (isNaN(modeParam)) {
            // Redirect with correct mode
            window.location.replace(constructURL(goMode));
        } else {
            // Continue
            // Set the Application Mode
            setApp(appParam);
            // Replace CSS for darkmode, if needed
            var darkSwitch = Cookies.get('dark');
            if(darkSwitch == 'enabled'){enableDarkmode(); isDark = true;}
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
    } else {
        // Set to Welcome
        replaceGrid("./templates/page/welcome.html");
        loadJsApp("./scripts/settings/app.js");
    }
    // Check version and add update alert if needed
    checkVersion();
    // Bring in external HTML
    includeHTML();
    // Wait half second for completion
    setTimeout(function (){
        // Update Navbar
        updateNav();
        
        // Set Opacity if not Email App or Error App
        if(appParam != 4 && appParam !=9){
            const opacity = Cookies.get('cardOpacity');
            document.documentElement.style.setProperty("--CARD-OPACITY", opacity);
        }
        // Call up application
        if(isSetup == 'yes'){  
            loadApp();
        }
        else{
            loadSetup();
        }
    }, 500);
}

function checkVersion(){
    try{
        //See if the cookie exists
        var version = Cookies.get('version');
        if (version !== versionNumber){
            addAlert();
            Cookies.set('version', versionNumber, { expires: Infinity });
        }
        else{
            // Do nothing.
        }
    }
    catch{
        //If cookie does not exist, do the same
        //addAlert();
    }
}

function setAlert(message){
    document.body.getElementById("alert-message").innerHTML = message;
}

function constructURL(Cookiemode){
    var constructURL = './' + rootFile + '?app=' + appParam;

    if (isNaN(modeParam)){
        constructURL += '&mode=' + Cookiemode;
    }
    if (typeParam !== null){
        constructURL += '&type=' + typeParam;
    }
    if (radarParam !== null){
        constructURL += '&radar=' + radarParam;
    }
    if (errorParam !== null){
        constructURL += '&code=' + errorParam;
    }
    return constructURL;
}

function updateNav(){ // This also controls RDP and Apps page elements
    // Remove HD items if not HD modes
    if(modeParam > 1){
        var toDelete = getAllElementsWithAttribute('dept');
        for(var i=0;i<toDelete.length;i++){
            if(toDelete[i].getAttribute("dept") == 'hd'){
                toDelete[i].remove();
            }
        }
    }
    // Remove Deployment items if not Deployment
    if(modeParam != 3){
        var toDelete = getAllElementsWithAttribute('dept');
        for(var i=0;i<toDelete.length;i++){
            if(toDelete[i].getAttribute("dept") == 'deploy'){
                toDelete[i].remove();
            }
        }
    }
}

function setApp(app){
    switch(app){
        // We do not add 0: Welcome because page.js will auto detect if needed.
        case 1: // Dashboard
            // Set Display Mode
            switch(modeParam){
                case 0:
                    replaceGrid("./templates/dash/helpdesk.html");
                    break;
                case 1:
                    replaceGrid("./templates/dash/pros.html");
                    break;
                case 2:
                    replaceGrid("./templates/dash/deploy.html");
                    break;
                default:
                    // Error 1
                    window.location.replace('./'+rootFile+'?app=9&code=100');
                    break;
            }
            // Add JS Files
            loadJsApp("./data/dashboard/netgroups.js");
            loadJsApp("./data/dashboard/buildings.js");
            loadJsApp("./scripts/dashboard/app.js");
            break;
        case 2: // Settings
            replaceGrid("./templates/dash/settings.html");
            loadJsApp("./scripts/settings/app.js");
            break;
        case 3: // Forms
            replaceGrid("./templates/form/general.html");
            loadJsApp("./scripts/forms/app.js");
            break;
        case 4: // Emails
            replaceGrid("./templates/email/general.html");
            loadJsApp("./scripts/email/app.js");
            break;
        case 5: // Loaners
            replaceGrid("./templates/loaner/general.html");
            loadJsApp("./scripts/loaner/app.js");
            break;
        case 6: // Status
            replaceGrid("./templates/status/general.html");
            loadJsApp("./scripts/status/app.js");
            break;
        case 7: // Trivia
            replaceGrid("./templates/trivia/general.html");
            loadJsApp("./scripts/trivia/app.js");
            break;
        case 8: // Weather
            // Set Display Mode
            switch(typeParam){
                case 'nws':
                    replaceGrid("./templates/wx/nws.html");
                    break;
                case 'nws-single':
                    replaceGrid("./templates/wx/cards/radar/"+radarParam+".html");
                    break;
                case 'wu':
                default:
                    replaceGrid("./templates/wx/general.html");
                    break;
            }
            loadJsApp("./scripts/weather/app.js");
            break;
        case 9: // Errors
            replaceGrid("./templates/page/error.html");
            loadJsApp("./scripts/page/error.js");
            break;
        case 10: // Help
            replaceGrid("./templates/page/help.html");
            loadJsApp("./scripts/page/help.js");
            break;
        case 11: // Bug Tracking
            replaceGrid("./templates/page/bugs.html");
            loadJsApp("./scripts/page/bugs.js");
            break;
        case 12: // Apps Page
            replaceGrid("./templates/page/apps/general.html");
            loadJsApp("./scripts/page/apps.js");
            break;
        case 13: // Apps Page
            replaceGrid("./templates/rdp/general.html");
            loadJsApp("./scripts/rdp/app.js");
            break;
        default: // Nothing
            // Error 0
            window.location.replace('./'+rootFile+'?app=9&code=0');
            break;
    }
}

function loadJsApp(filepath){
    var fileref=document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filepath + versionNumber);
    if (typeof fileref!="undefined"){
        document.head.appendChild(fileref);
    }
}

function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function replaceGrid(newgrid){
    document.getElementById("grid-holder").setAttribute("it-include-html", newgrid);
}

function addAlert(){
    document.getElementById("alert-holder").setAttribute("it-include-html", "./templates/page/alert.html");
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
          UIkit.notification({message: 'Operation Mode set to IT Help Desk.', status: 'success'})
          break;
        case 1:
          UIkit.notification({message: 'Operation Mode set to Desktop Pros.', status: 'success'})
          break;
        case 2:
          UIkit.notification({message: 'Operation Mode set to Deployment.', status: 'success'})
          break;
}        
}

function enableDarkmode() {
    const darkLink = document.createElement("link");
    const darkLink2 = document.createElement("link");
    darkLink.rel = "stylesheet";
    darkLink2.rel = "stylesheet";
    darkLink.href = "./styles/uikit-dark.css";
    darkLink2.href = "./styles/mst-custom-dark.css";
    darkLink.classList.add("darkmode");
    darkLink2.classList.add("darkmode");
    document.head.appendChild(darkLink);
    document.head.appendChild(darkLink2);
}


function disableDarkmode() {
    for (const darkLink of document.querySelectorAll(".darkmode")) {
        darkLink.remove();
    }
}

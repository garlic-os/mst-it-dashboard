/**
 * IT Dashboard Page Functions
 * Written By: Sean Apple
 * Modified: 4/18/19 by Sean Apple
 *
 * Contains functions related to page generation
 */

const rootFile = '';
const versionNumber = '?66';

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const appParam = urlParams.get('app');
const modeParam = urlParams.get('mode');
const typeParam = urlParams.get('type');
const radarParam = urlParams.get('radar');
const errorParam = urlParams.get('code');


function generatePage() {
    const setupComplete = Cookies.get("setupComplete");
    // Check if setup
    if (setupComplete) {
        const operationMode = Cookies.get('mode');
        // Check if app and mode exist in URL
        if (!appParam && !modeParam) {
            // Redirect to dashboard
            window.location.replace(`./${rootFile}?app=dashboard&mode=${operationMode}`);
        } else if (!modeParam) {
            // Redirect with correct mode
            window.location.replace(constructURL(operationMode));
        } else {
            // Continue
            // Set the Application Mode
            setApp(appParam);
            // Replace CSS for theme, if needed
            if (Cookies.get("theme") === "false") {
                enableDarkMode();
            }
            // Load Background Image
            var bURL = Cookies.get('backgroundURL');
            if (bURL == 'none') {
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

    // Update Navbar
    updateNav();

    const opacity = Cookies.get('cardOpacity') ?? '1';
    document.documentElement.style.setProperty("--CARD-OPACITY", opacity);

    // Wait half second for completion
    setTimeout(function () {
        // Call up application
        if (setupComplete) {
            loadApp();
        }
    }, 1000);
}

function checkVersion() {
    try {
        // See if the cookie exists
        var version = Cookies.get('version');
        if (version !== versionNumber) {
            addAlert();
            Cookies.set('version', versionNumber, { expires: Infinity });
        } else {
            // Do nothing.
        }
    }
    catch {
        //If cookie does not exist, do the same
        //addAlert();
    }
}

function setAlert(message) {
    document.body.getElementById("alert-message").innerHTML = message;
}

function constructURL(cookieMode) {
    var constructURL = './' + rootFile + '?app=' + appParam;

    if (!modeParam) {
        constructURL += '&mode=' + cookieMode;
    }
    if (typeParam !== null) {
        constructURL += '&type=' + typeParam;
    }
    if (errorParam !== null) {
        constructURL += '&code=' + errorParam;
    }
    return constructURL;
}

function updateNav() {
    // Remove HD items if not HD modes
    if (modeParam !== "helpdesk") {
        var toDelete = getAllElementsWithAttribute('dept');
        for (var i=0;i<toDelete.length;i++) {
            if (toDelete[i].getAttribute("dept") == 'hd') {
                toDelete[i].remove();
            }
        }
    }
    // Remove Deployment items if not Deployment
    if (modeParam !== "deploy") {
        var toDelete = getAllElementsWithAttribute('dept');
        for (var i=0;i<toDelete.length;i++) {
            if (toDelete[i].getAttribute("dept") == 'deploy') {
                toDelete[i].remove();
            }
        }
    }
}

function setApp(app) {
    switch(app) {
        // We do not add 0: Welcome because page.js will auto detect if needed.
        case "dashboard":
            // Set Display Mode
            switch(modeParam) {
                case "helpdesk":
                    replaceGrid("./templates/dash/helpdesk.html");
                    break;
                case "pros":
                    replaceGrid("./templates/dash/pros.html");
                    break;
                case "deploy":
                    replaceGrid("./templates/dash/deploy.html");
                    break;
                default:
                    // Go to root
                    window.location.replace(`./${rootFile}`);
                    Cookies.set("mode", "helpdesk");
                    break;
            }
            // Add JS Files
            loadJsApp("./data/dashboard/netgroups.js");
            loadJsApp("./data/dashboard/buildings.js");
            loadJsApp("./scripts/dashboard/app.js");
            break;
        case "settings":
            replaceGrid("./templates/dash/settings.html");
            loadJsApp("./scripts/settings/app.js");
            break;
        case "forms":
            replaceGrid("./templates/form/general.html");
            loadJsApp("./scripts/forms/app.js");
            break;
        case "emails":
            replaceGrid("./templates/email/general.html");
            loadJsApp("./scripts/email/app.js");
            break;
        case "loaners":
            replaceGrid("./templates/loaner/general.html");
            loadJsApp("./scripts/loaner/app.js");
            break;
        case "error":
            replaceGrid("./templates/page/error.html");
            loadJsApp("./scripts/page/error.js");
            break;
        case "help":
            replaceGrid("./templates/page/help.html");
            loadJsApp("./scripts/page/help.js");
            break;
        default: // Nothing
            // Go to root
            window.location.replace(`./${rootFile}`);
            break;
    }
}

function loadJsApp(filepath) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filepath + versionNumber);
    if (typeof fileref != "undefined") {
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


NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function replaceGrid(newgrid) {
    document.getElementById("grid-holder").setAttribute("it-include-html", newgrid);
}

function addAlert() {
    document.getElementById("alert-holder").setAttribute("it-include-html", "./templates/page/alert.html");
}

function setPageName(name) {
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


function enableDarkMode() {
    const darkLink = document.createElement("link");
    const darkLink2 = document.createElement("link");
    darkLink.rel = "stylesheet";
    darkLink2.rel = "stylesheet";
    darkLink.href = "./styles/uikit-dark.css";
    darkLink2.href = "./styles/mst-custom-dark.css";
    darkLink.classList.add("theme");
    darkLink2.classList.add("theme");
    document.head.appendChild(darkLink);
    document.head.appendChild(darkLink2);
}


function disableDarkMode() {
    for (const darkLink of document.querySelectorAll(".theme")) {
        darkLink.remove();
    }
}

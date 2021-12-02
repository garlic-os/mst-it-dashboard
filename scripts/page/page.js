/**
 * IT Dashboard Page Functions
 * Written By: Sean Apple
 * Modified: 4/18/19 by Sean Apple
 *
 * Contains functions related to page generation
 */

const rootFile = "";
const versionNumber = "?69";  // nice

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const appParam = urlParams.get("app");
const modeParam = urlParams.get("mode");
const typeParam = urlParams.get("type");
const radarParam = urlParams.get("radar");
const errorParam = urlParams.get("code");


document.addEventListener("DOMContentLoaded", async function () {
    const setupComplete = Cookies.get("setupComplete");
    // Check if setup
    if (setupComplete) {
        const operationMode = Cookies.get("mode");
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
            const backgroundURL = Cookies.get("backgroundURL");
            if (backgroundURL) {
                setCSSvar("--BACKGROUND-IMAGE", `url("${backgroundURL}")`);
            }
        }
    } else {
        // Set to Welcome
        await replaceGrid("./templates/page/welcome.html");
        loadJsApp("./scripts/settings/app.js");
    }
    // Check version and add update alert if needed
    checkVersion();

    // Update Navbar
    updateNav();

    const cardOpacity = Cookies.get("cardOpacity") ?? "1";
    setCSSvar("--CARD-OPACITY", cardOpacity);

    const cardBlur = Cookies.get("cardBlur") ?? "0";
    setCSSvar("--CARD-BLUR-RADIUS", cardBlur);
});

function setCSSvar(name, value) {
    document.documentElement.style.setProperty(name, value);
}

function checkVersion() {
    try {
        // See if the cookie exists
        var version = Cookies.get("version");
        if (version !== versionNumber) {
            addAlert();
            Cookies.set("version", versionNumber, { expires: Infinity });
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
    var constructURL = "./" + rootFile + "?app=" + appParam;

    if (!modeParam) {
        constructURL += "&mode=" + cookieMode;
    }
    if (typeParam !== null) {
        constructURL += "&type=" + typeParam;
    }
    if (errorParam !== null) {
        constructURL += "&code=" + errorParam;
    }
    return constructURL;
}

function updateNav() {
    // Remove HD items if not HD modes
    if (modeParam !== "helpdesk") {
        var toDelete = getAllElementsWithAttribute("dept");
        for (var i=0;i<toDelete.length;i++) {
            if (toDelete[i].getAttribute("dept") == "hd") {
                toDelete[i].remove();
            }
        }
    }
    // Remove Deployment items if not Deployment
    if (modeParam !== "deploy") {
        var toDelete = getAllElementsWithAttribute("dept");
        for (var i=0;i<toDelete.length;i++) {
            if (toDelete[i].getAttribute("dept") == "deploy") {
                toDelete[i].remove();
            }
        }
    }
}

async function setApp(app) {
    switch(app) {
        // We do not add 0: Welcome because page.js will auto detect if needed.
        case "dashboard":
            // Set Display Mode
            switch(modeParam) {
                case "helpdesk":
                    await replaceGrid("./templates/dash/helpdesk.html");
                    break;
                case "pros":
                    await replaceGrid("./templates/dash/pros.html");
                    break;
                case "deploy":
                    await replaceGrid("./templates/dash/deploy.html");
                    break;
                default:
                    // Go to root
                    window.location.replace(`./${rootFile}`);
                    Cookies.set("mode", "helpdesk");
                    break;
            }
            loadJsApp("./scripts/dashboard/app.js");
            break;
        case "settings":
            await replaceGrid("./templates/dash/settings.html");
            loadJsApp("./scripts/settings/app.js");
            break;
        case "forms":
            await replaceGrid("./templates/form/general.html");
            loadJsApp("./scripts/forms/app.js");
            break;
        case "emails":
            await replaceGrid("./templates/email/general.html");
            loadJsApp("./scripts/email/app.js");
            break;
        case "loaners":
            await replaceGrid("./templates/loaner/general.html");
            loadJsApp("./scripts/loaner/app.js");
            break;
        case "error":
            await replaceGrid("./templates/page/error.html");
            loadJsApp("./scripts/page/error.js");
            break;
        case "help":
            await replaceGrid("./templates/page/help.html");
            loadJsApp("./scripts/page/help.js");
            break;
        case "status":
            await replaceGrid("/templates/dash/status.html");
            loadJsApp("./scripts/status/app.js");
            break;
        default: // Nothing
            // Go to root
            window.location.replace(`./${rootFile}`);
            break;
    }
}

function loadJsApp(filePath) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = filePath + versionNumber;
    document.head.appendChild(script);
}

function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName("*");
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

async function replaceGrid(newgrid) {
    document.getElementById("grid-holder").setAttribute("it-include-html", newgrid);
    await includeHTML();
}

function addAlert() {
    document.getElementById("alert-holder").setAttribute("it-include-html", "./templates/page/alert.html");
}

function setPageName(name) {
    document.getElementById("page-title").innerHTML = name;
}

async function includeHTML() {
    // Loop all the elements on the page
    for (const element of document.getElementsByTagName("*")) {
        // Search for elements with a certain atrribute
        const filePath = element.getAttribute("it-include-html");
        if (filePath) {
            // Make an HTTP request using the attribute value as the file name
            // and replace the element"s content with the response text
            try {
                const response = await fetch(filePath);
                const responseText = await response.text();
                element.innerHTML = responseText;
            } catch {
                element.innerHTML = "Page not found.";
            }
            element.removeAttribute("it-include-html");
            await includeHTML();
            break;
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

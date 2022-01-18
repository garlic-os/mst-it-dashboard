/**
 * IT Dashboard Page Functions
 * Written By: Sean Apple
 * Modified: 12/6/21 by Nate Kean
 *
 * Contains functions related to page generation
 */

const versionNumber = "?75";

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const appParam = urlParams.get("app") ?? "dashboard";
const typeParam = urlParams.get("type");
const radarParam = urlParams.get("radar");
const errorParam = urlParams.get("code");

const operationMode = Cookies.get("mode");


document.addEventListener("DOMContentLoaded", async function () {
    const setupComplete = Cookies.get("setupComplete");
    let appLoaded;
    // Check if setup is complete and the operation mode is set
    if (setupComplete && operationMode) {
        // Load the requested app
        appLoaded = setApp(appParam);

        if (Cookies.get("theme") === "false") {
            enableDarkMode();
        }

        const backgroundURL = Cookies.get("backgroundURL");
        if (backgroundURL) {
            setCSSvar("--BACKGROUND-IMAGE", `url("${backgroundURL}")`);
        }
    } else {
        // Set to Welcome
        await replaceGrid("./templates/page/welcome.html");
        loadJsApp("./scripts/settings/app.js");
    }
    // Update Navbar
    updateNav();

    const cardOpacity = Cookies.get("cardOpacity") ?? "1";
    setCSSvar("--CARD-OPACITY", cardOpacity);

    const cardBlur = Cookies.get("cardBlur") ?? "0";
    setCSSvar("--CARD-BLUR-RADIUS", cardBlur);

    updateBackground(Cookies.get("backgroundURL"));

    // Check version and add update alert if needed
    checkVersion();

    await appLoaded;
    convertToSinglePage();
});


function setCSSvar(name, value) {
    document.documentElement.style.setProperty(name, value);
}


function checkVersion() {
    if (Cookies.get("version") !== versionNumber) {
        addAlert();
        Cookies.set("version", versionNumber, { expires: Infinity });
    }
}


function setAlert(message) {
    document.body.getElementById("alert-message").innerHTML = message;
}


function constructURL() {
    let url = `./?app=${appParam}`;
    if (typeParam) {
        url += "&type=" + typeParam;
    }
    if (errorParam) {
        url += "&code=" + errorParam;
    }
    return url;
}


function updateNav() {
    // Remove HD items if not HD modes
    if (operationMode !== "helpdesk") {
        for (const element of document.querySelectorAll("[dept='hd']")) {
            element.remove();
        }
    }
    // Remove Deployment items if not Deployment
    if (operationMode !== "deploy") {
        for (const element of document.querySelectorAll("[dept='deploy']")) {
            element.remove();
        }
    }
}


async function setApp(app) {
    switch(app) {
        // We do not add 0: Welcome because page.js will auto detect if needed.
        case "dashboard":
        default:
            // Set operation mode
            switch(operationMode) {
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
                    // If operation mode is missing, require redo setup
                    Cookies.set("setupComplete", null);
                    window.location.reload();
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
    }
}


function loadJsApp(filePath) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = filePath + versionNumber;
    document.head.appendChild(script);
}


async function replaceGrid(newgrid) {
    document.querySelector("#grid-holder").setAttribute("it-include-html", newgrid);
    await loadIncludes();
}


function addAlert() {
    document.querySelector("#alert-holder").setAttribute("it-include-html", "./templates/page/alert.html");
}


function setPageName(name) {
    document.querySelector("#page-title").textContent = name;
}


async function loadIncludes(parent=document.body) {
    const operations = [];  // Array of promises
    for (const element of parent.children) {
        // Get URL for element's template
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
            operations.push(loadIncludes(element));
        }
    }
    await Promise.all(operations);
    convertToSinglePage();  // Apply SPA functionality to the newly loaded page
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


let ytAPIready = false;

function onYouTubeIframeAPIReady() {
    ytAPIready = true;
}

function getYouTubeID(url) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return (match && match[2] && match[2].length === 11)
		? match[2]
		: null;
}

function loadYouTubeVideo(id) {
    if (!ytAPIready) {
        return setTimeout(() => {
            loadYouTubeVideo(id);
        }, 100);
    }
	new YT.Player("bg-youtube", {
		height: "100%",
		width: "100%",
		videoId: id,
		playerVars: {
			autoplay: 1,
			loop: 1,
            mute: 1,
			controls: 0,
			disablekb: 1,
			fs: 0,
			iv_load_policy: 3,
			modestbranding: 1,
			showinfo: 0,
			start: 0,
			playsinline: 1,
            playlist: id,
			vq: "hd1080"
		},
	});
}


function updateBackground(url) {
	if (!url) {
		document.body.style.backgroundImage = "none";
		document.querySelector("#bg-youtube").src = "";
		document.querySelector("#bg-video").src = "";
	} else if (url.includes("youtu")) {
		document.body.style.backgroundImage = "none";
		document.querySelector("#bg-video").src = "";
		loadYouTubeVideo(getYouTubeID(url));
	} else if (url.endsWith(".mp4")) {
		document.body.style.backgroundImage = "none";
		document.querySelector("#bg-youtube").src = "";
		document.querySelector("#bg-video").src = url;
	} else {
		document.querySelector("#bg-youtube").src = "";
		document.querySelector("#bg-video").src = "";
		document.body.style.backgroundImage = `url("${url}")`;
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundAttachment = "fixed";
	}
}


function updateCardOpacity(opacity) {
	root.style.setProperty("--CARD-OPACITY", opacity);
}


function updateCardBlur(blurRadius) {
	root.style.setProperty("--CARD-BLUR-RADIUS", blurRadius);
}


let navigating = false;
function convertToSinglePage() {
    for (const a of document.querySelectorAll('a:not([href="#"]):not([spa])')) {
        if (
            !a.href.startsWith(window.location.origin + window.location.pathname) ||
            !a.href.includes("?") ||
            !a.href.includes("app=")
        ) {
            continue;
        }
        a.addEventListener("click", async (event) => {
            if (event.which !== 1) return;  // Only left click
            event.preventDefault();
            if (navigating) return;  // Only respond once to double-clicks
            navigating = true;
            window.history.pushState("", "", a.href);
            const urlParams = new URLSearchParams(window.location.search);
            await setApp(urlParams.get("app"));
            navigating = false;
        });
        a.setAttribute("spa", "");  // Mark this link as converted
    }
}

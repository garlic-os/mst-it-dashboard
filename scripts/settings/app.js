const root = document.documentElement;
const backgroundURLInput = document.getElementById("backURL");
const cardOpacityInput = document.getElementById("cardOpat");
const cardBlurInput = document.getElementById("cardBlur");
const themeInput = document.getElementById("theme");
let backgroundURL = null;
let cardOpacity = null;
let cardBlur = null;


setPageName("Settings");

// Load user settings from cookies
document.getElementById("runMode").value = Cookies.get("mode") ?? "helpdesk";
document.getElementById("theme").checked = Cookies.get("theme") === "false" ? false : true;
backgroundURLInput.value = Cookies.get("backgroundURL") ?? "";
cardOpacityInput.value = Cookies.get("cardOpacity") ?? 1;
cardBlurInput.value = Cookies.get("cardBlur") ?? 0;

// Live reload user settings
requestAnimationFrame(pollSettingsChange);


function pollSettingsChange() {
	if (backgroundURLInput.value !== backgroundURL) {
		backgroundURL = backgroundURLInput.value;
		updateBackground(backgroundURL);
	}
	if (cardOpacityInput.value !== cardOpacity) {
		cardOpacity = cardOpacityInput.value;
		updateCardOpacity(cardOpacity);
	}
	if (cardBlurInput.value !== cardBlur) {
		cardBlur = cardBlurInput.value;
		updateCardBlur(cardBlur);
	}
	requestAnimationFrame(pollSettingsChange);
}

function saveSettings() {
	// Clear setup hold
	Cookies.set("setupComplete", true, { expires: Infinity });

	// Save user settings to cookies
	Cookies.set("mode", document.getElementById("runMode").value, { expires: Infinity });
	Cookies.set("theme", themeInput.checked, { expires: Infinity });
	Cookies.set("backgroundURL", backgroundURLInput.value, { expires: Infinity });
	Cookies.set("cardOpacity", cardOpacityInput.value, { expires: Infinity });
	Cookies.set("cardBlur", cardBlurInput.value, { expires: Infinity });

	// Refresh back to the Dashboard
	window.location.replace("./");
}

themeInput.addEventListener("change", function () {
	if (themeInput.checked) {
		disableDarkMode();
	} else {
		enableDarkMode();
	}
});

function getYouTubeID(url) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return (match && match[2] && match[2].length === 11)
		? match[2]
		: null;
}

function updateBackground(url) {
	if (url === "") {
		document.body.style.backgroundImage = "none";
		document.getElementById("backVideo").src = "";
	} else if (url.includes("youtu")) {
		document.body.style.backgroundImage = "none";
		document.getElementById("backVideo").src = `//www.youtube.com/embed/${getYouTubeID(url)}?autoplay=1`;
	} else {
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

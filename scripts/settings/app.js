const root = document.documentElement;
const backgroundURLInput = document.getElementById("bg-url");
const cardOpacityInput = document.getElementById("cardOpat");
const cardBlurInput = document.getElementById("cardBlur");
const themeInput = document.getElementById("theme");


// Load user settings from cookies
document.getElementById("runMode").value = Cookies.get("mode") ?? "helpdesk";
document.getElementById("theme").checked = Cookies.get("theme") === "false" ? false : true;
backgroundURLInput.value = Cookies.get("backgroundURL") ?? "";
cardOpacityInput.value = Cookies.get("cardOpacity") ?? 1;
cardBlurInput.value = Cookies.get("cardBlur") ?? 0;


function saveSettings() {
	// Clear setup hold
	Cookies.set("setupComplete", true, { expires: Infinity });

	// Save user settings to cookies
	Cookies.set("mode", document.getElementById("runMode").value, { expires: Infinity });
	Cookies.set("theme", themeInput.checked, { expires: Infinity });
	Cookies.set("backgroundURL", backgroundURLInput.value, { expires: Infinity });
	Cookies.set("cardOpacity", cardOpacityInput.value, { expires: Infinity });
	Cookies.set("cardBlur", cardBlurInput.value, { expires: Infinity });

	setApp("dashboard");
	history.pushState(null, null, "./");  // Remove URL parameters
}

themeInput.addEventListener("change", function () {
	if (themeInput.checked) {
		disableDarkMode();
	} else {
		enableDarkMode();
	}
});

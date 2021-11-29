

function loadApp() {
    // Set Navigation Title
    setTimeout(function () {
        setPageName("Dashboard");
        // Load User Settings from Cookies
        document.getElementById("runMode").value = Cookies.get("mode");
        document.getElementById("theme").checked = Cookies.get("theme") === "false" ? false : true;
        document.getElementById("backURL").value = Cookies.get("backgroundURL");
        document.getElementById("cardOpat").value = Cookies.get("cardOpacity");
    }, 500);
}

function saveSettings() {
    // Clear setup hold
    Cookies.set("setupComplete", true, { expires: Infinity });
  
    Cookies.set("mode", document.getElementById("runMode").value, { expires: Infinity });
    Cookies.set("theme", document.getElementById("theme").checked, { expires: Infinity });
    Cookies.set("backgroundURL", document.getElementById("backURL").value, { expires: Infinity });
    Cookies.set("cardOpacity", document.getElementById("cardOpat").value, { expires: Infinity });
    Cookies.set("cardBlur", document.getElementById("cardBlur").value, { expires: Infinity });
    Cookies.set("backgroundURL", document.getElementById("backURL").value, { expires: Infinity });
    Cookies.set("cardOpacity", document.getElementById("cardOpat").value, { expires: Infinity });
    Cookies.set("cardBlur", document.getElementById("cardBlur").value, { expires: Infinity });
    UIkit.notification("Settings saved. Reloading page...");
    setTimeout(function () {
      window.location.replace("./");
    }, 750);
}

function toggleTheme() {
  if (document.getElementById("theme").checked) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

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

function updateOpacity() {
  const root = document.documentElement;
  const opacity = document.getElementById("cardOpat").value;
  root.style.setProperty("--CARD-OPACITY", opacity);
}

function updateBlur() {
  const root = document.documentElement;
  const blurRadius = document.getElementById("cardBlur").value;
  root.style.setProperty("--CARD-BLUR-RADIUS", blurRadius + "px");
}

}

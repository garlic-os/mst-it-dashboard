

function loadApp(){
    // Set Navigation Title
    setTimeout(function () {
        setPageName("Dashboard");
        // Load User Settings from Cookies
        document.getElementById("runMode").selectedIndex = parseInt(Cookies.get('mode'), 10);
        var darkSwitch = Cookies.get('dark');
        if(darkSwitch == 'enabled') {
            document.getElementById("darkmode").checked = true;
        } else {
        document.getElementById("darkmode").checked = false;
        }
        document.getElementById("backURL").value = Cookies.get('backgroundURL');
        document.getElementById("cardOpat").value = Cookies.get('cardOpacity');
        // Add Event Listeners
        document.getElementById("fileUpload").addEventListener('change', processFile, false);
    }, 500);
    
}

function loadSetup(){
    // Set Navigation Title
    setTimeout(function () {
        setPageName("Dashboard");
        // Add Event Listeners
        document.getElementById("fileUpload").addEventListener('change', processFile, false);
    }, 500);
}

function saveSettings(){
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
    // Save Opacity
    Cookies.set('cardOpacity', document.getElementById("cardOpat").value, { expires: Infinity });
    UIkit.notification('Opacity and Background Image saved...');
    // Alert refresh, 3 seconds and refresh.
    UIkit.notification('Settings saved. Reloading page...');
    setTimeout(function () {
      window.location.replace("./index.html");
      }, 100);
    
  }

function checkDarkmode(){
  var checkbox = document.getElementById('darkmode');
  toggleDarkmode(checkbox.checked);
}

function updateBackground(){
  var imgURL = document.getElementById("backURL").value;
  if(imgURL == '') {
    document.body.style.backgroundImage = "none"
    } else {
        document.body.style.backgroundImage = "url('" + imgURL + "')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
    }
}

function updateOpacity(){
  var cardList = document.getElementsByClassName("uk-card");
  var opat = document.getElementById("cardOpat").value;

  for(var i=0; i<cardList.length; i++){
    cardList[i].style.opacity = opat;
  }
}

function exportSettings(){
  var userSettings = {
    mode: document.getElementById("runMode").selectedIndex,
    cardOpacity: document.getElementById("cardOpat").value,
    backgroundURL: document.getElementById("backURL").value,
    dark: document.getElementById("darkmode").checked,
  }

  var filename = 'dashboardSettings.json';
  jsonStr = JSON.stringify(userSettings);

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function processFile(evt) {
  try {
    let files = evt.target.files;
    if(!files.length) {
      UIkit.notification('No file selected!', 'danger');
      return;
    }
    let file = files[0];
    let reader = new FileReader();
    const self = this;
    reader.onload = (event) => {
      console.log('FILE CONTENT', event.target.result);
      var contents = JSON.parse(event.target.result);
      console.log(contents.mode);
      console.log(contents.cardOpacity);
      console.log(contents.backgroundURL);
      console.log(contents.dark)
      UIkit.notification('Importing settings...', 'success');
      document.getElementById("runMode").selectedIndex = contents.mode;
        var darkSwitch = contents.dark;
        if(darkSwitch) {
            document.getElementById("darkmode").checked = true;
        } else {
        document.getElementById("darkmode").checked = false;
        }
        document.getElementById("backURL").value = contents.backgroundURL;
        document.getElementById("cardOpat").value = contents.cartOpacity;
    };
    reader.readAsText(file);
  }catch (err) {
    UIkit.notification(err, 'danger');
  }
  toggleImport();
  setTimeout(function () {
    updateBackground();
    updateOpacity();
    checkDarkmode();
  }, 500);
}

function toggleImport(){
	var currentView = window.getComputedStyle(document.querySelector('#importCard')).display;
	if(currentView == "none"){
		document.getElementById("importCard").style.display = "inherit";
	}else{
		document.getElementById("importCard").style.display = "none";
	}
}
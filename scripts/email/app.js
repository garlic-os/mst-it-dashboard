/* Email Generator
/* Originally by Stuart Miller
/* Modified for UI Kit Dashboard by Sean Apple
***********************************************/

/* --------- APPLICATION VARIABLES ------------- */
var templates = [];
var currTempId = 0;
var msgTmpl = "";
var custName = "";
var tickOpen = true;
var tickUpdateInfo = "";
var tickUpdateInstText = "";

function loadApp() {
  // Set Navigation Title
  setTimeout(function () {
  setPageName("Email Generator");
  startEmail();
  }, 500);       
}

function loadEmail() {
  // Load Template Configuration File into 
}

function startEmail() {
  // Load Template Configuration File
  templates = JSON.parse(getFile("./data/email/templates.json"));

  // Get query string
  var template = "default.txt";
  var regex = new RegExp(/template=\w+/);
  results = regex.exec(window.location.href);

  // Look for specific template
  currTempId = 0;
  if (results !== null) {
    template = results[0].substring(9) + ".txt";
    for (var i=0; i<templates.length;i++) {
      if (templates[i].fileName == template) {
        currTempId = i;
      }
    }
  }


  // Initialize all areas based on the chosen template
  tickUpdateInstText = getFile("./data/email/tickUpdateInst.txt");
  msgTmpl = getFile("./data/email/" + templates[currTempId].fileName);
  updateOptions();
  updateList();
  updateMessage();
}

function updateMessage() {
	var msg = msgTmpl;
    var text;
    var custName = document.getElementById("custNameInput").value;
    msg = replaceGlobal(msg, "custName", (custName === "" ? "" : " " + custName));
	var tickOpen = document.getElementById("tickOpen_true").checked;
	msg = replaceGlobal(msg, "tickOpen", (tickOpen ? "updating this" : "submitting a"));
	msg = replaceGlobal(msg, "resolving", (tickOpen ? "" :"We will now be resolving this ticket.\n\n"));
    var tickUpdateInst = document.getElementById("tickUpdateInfo").checked;
    msg = replaceGlobal(msg, "tickUpdateInfo", (tickUpdateInst ? tickUpdateInstText : ""));
	for (var i = 0; i < templates[currTempId].options.length; i++) {
		str = templates[currTempId].options[i].id;
		msg = replaceGlobal(msg, str, document.getElementById(str).value);
	}
	document.getElementById("msg").value = msg;
  document.getElementById("tmpl_title").innerHTML = templates[currTempId].displayName + " Email Template";
  document.getElementById("emailTemplateSearch").placeholder = templates[currTempId].displayName;
}

function updateOptions() {
  // Remove old options
	var toRemove = document.getElementsByClassName("tmpl_opt_input");
	while (toRemove.length > 0) {
        toRemove[0].parentNode.removeChild(toRemove[0]);
    }
	// Get our current template
	var options = templates[currTempId].options;
	// Make options for this template in HTML
	if (options.length === 0) {
		document.getElementById("template_options").innerHTML = "No options for this template :(";
	} else {
		document.getElementById("template_options").innerHTML = "";
		for (var i = 0; i < options.length; i++) {
			var inputOption = document.createElement("input");
			inputOption.setAttribute("type", "text");
			inputOption.setAttribute("class", "uk-input uk-form-width-medium uk-form-small");
			inputOption.setAttribute("oninput", "updateMessage()" );
            // Set an attribute in HTML for each option element
			for (var j in options[i]) {
				if (options[i].hasOwnProperty(j)) {
					inputOption.setAttribute(j, options[i][j] );
				}
			}
      document.getElementById("template_options").appendChild(inputOption);
      document.getElementById("template_options").appendChild(document.createElement('br'));
		}
	}
	// Update ticket open/resolved default
	if (typeof(templates[currTempId].tickOpen) == "undefined" || templates[currTempId].tickOpen)
		document.getElementById("tickOpen_true").click();
	else
		document.getElementById("tickOpen_false").click();
}

function updateList(str) {
  // Clear old list
var toRemove = document.getElementsByClassName("tmpl_list_item");
while (toRemove.length > 0) {
      toRemove[0].parentNode.removeChild(toRemove[0]);
  }
  // Sanity check if undefined
  if (typeof str == "undefined") {
      str = "";
  }
  // Make a matching list from our JSON data
  var i = -1;
  var tmplList = templates.map(function (x) {
  i++;
      var skip;
  if (x.displayName == "Default")
    skip = true;
  else
    skip = x.displayName.toLowerCase().indexOf(str.toLowerCase()) == -1
  return {name: x.displayName, idx: i, skip: skip };
});
  // Sort the list alphabetically by name
tmplList.sort(function (a, b) {
      return a.name.localeCompare(b.name);
  });
// Make the list elements in HTML
document.getElementById('emailTemplateSearch').innerHTML = '';
var options = '';
for (i = 0; i < tmplList.length; i++) {
      if (tmplList[i].skip)
          continue;
  
  options += '<option value="'+tmplList[i].idx+'">'+tmplList[i].name+'</option>';
  
}
document.getElementById("emailTemplateSearch").innerHTML = options;
}





function getFile(fileName) {
	var rawFile = new XMLHttpRequest();
	var allText = "Error!";
	rawFile.open("GET", fileName, false);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status === 0) {
				allText = rawFile.responseText;
			}
		}
	};
	rawFile.send(null);
	return allText;
}

function replaceGlobal(str, find, replace) {
    return str.replace(new RegExp("\\[" + find + "\\]", "g"), replace);
}

function listSelect(x) {
	document.getElementById("custNameInput").value = "";
	currTempId = x;
    msgTmpl = getFile("./data/email/" + templates[currTempId].fileName);
	updateOptions();
	updateMessage();
}

function emailSelect() {
  var x = document.getElementById("emailTemplateSearch").value;
  listSelect(x);
}

function copyEmail() {
  var copyText = document.getElementById("msg");
  copyText.select();
  document.execCommand("copy");
}
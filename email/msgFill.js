/*jslint browser: true, devel: true, windows: true, vars: true, plusplus: true, bitwise: true, regexp: true, sloppy: true, indent: 4 */
/**************************************************************
* msgFill.js
* Stuart Miller
*
**************************************************************/

/**************************************************
* Variable Declarations
**************************************************/
var tmplData = [];
var tmpl = 0;
var msgTmpl = "";
var custName = "";
var tickOpen = true;
var tickUpdateInfo = "";
var tickUpdateInstText = "";

/**************************************************
* Onload Function
**************************************************/
window.onload = function () {
	// Get master configuration
	tmplData = JSON.parse(getFile(".//templates//templates.json"));	
		
	// Get query string
	var template = "default.txt";
	var regex = new RegExp(/template=\w+/);
	results = regex.exec(window.location.href);
	
	// Look for specific template
	tmpl = 0;
	if(results !== null) {
		template = results[0].substring(9) + ".txt";
		for(var i=0; i<tmplData.length;i++) {
			if(tmplData[i].fileName == template) {
				tmpl = i;
			}
		}
	}
	
	
	// Initialize all areas based on our chosen template
	tickUpdateInstText = getFile(".//templates//tickUpdateInst.txt");
	msgTmpl = getFile(".//templates//" + tmplData[tmpl].fileName);
	updateTmplOpts();
	updateTmplList();
	updateMsg();
};

/**************************************************
* Functions
**************************************************/
function updateMsg() {
	var msg = msgTmpl;
    var text;
    var custName = document.getElementById("custNameInput").value;
    msg = replaceGlobal(msg, "custName", (custName === "" ? "" : " " + custName));
	var tickOpen = document.getElementById("tickOpen_true").checked;
	msg = replaceGlobal(msg, "tickOpen", (tickOpen ? "updating this" : "submitting a"));
	msg = replaceGlobal(msg, "resolving", (tickOpen ? "" :"We will now be resolving this ticket.\n\n"));
    var tickUpdateInst = document.getElementById("tickUpdateInfo").checked;
    msg = replaceGlobal(msg, "tickUpdateInfo", (tickUpdateInst ? tickUpdateInstText : ""));
	for (var i = 0; i < tmplData[tmpl].options.length; i++) {
		str = tmplData[tmpl].options[i].id;
		msg = replaceGlobal(msg, str, document.getElementById(str).value);
	}
	document.getElementById("msg").value = msg;
	document.getElementById("tmpl_title").innerHTML = tmplData[tmpl].displayName;
}

function updateTmplOpts() {
	// Remove old options
	var toRemove = document.getElementsByClassName("tmpl_opt_input");
	while (toRemove.length > 0) {
        toRemove[0].parentNode.removeChild(toRemove[0]);
    }
	// Get our current template
	var options = tmplData[tmpl].options;
	// Make options for this template in HTML
	if (options.length === 0) {
		document.getElementById("template_options").innerHTML = "No options for this template :(";
	} else {
		document.getElementById("template_options").innerHTML = "";
		for (var i = 0; i < options.length; i++) {
			var inputOption = document.createElement("input");
			inputOption.setAttribute("type", "text");
			inputOption.setAttribute("class", "tmpl_opt_input opt_input mdl-textfield__input");
			inputOption.setAttribute("oninput", "updateMsg()" );
            // Set an attribute in HTML for each option element
			for (var j in options[i]) {
				if (options[i].hasOwnProperty(j)) {
					inputOption.setAttribute(j, options[i][j] );
				}
			}
			document.getElementById("template_options").appendChild(inputOption);
		}
	}
	// Update ticket open/resolved default
	if(typeof(tmplData[tmpl].tickOpen) == "undefined" || tmplData[tmpl].tickOpen)
		document.getElementById("tickOpen_true").click();
	else
		document.getElementById("tickOpen_false").click();
}

function updateTmplList(str) {
    // Clear old list
	var toRemove = document.getElementsByClassName("tmpl_list_item");
	while (toRemove.length > 0) {
        toRemove[0].parentNode.removeChild(toRemove[0]);
    }
    // Sanity check if undefined
    if(typeof str == "undefined") {
        str = "";
    }
    // Make a matching list from our JSON data
    var i = -1;
    var tmplList = tmplData.map(function (x) {
		i++;
        var skip;
		if(x.displayName == "Default")
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
	for (i = 0; i < tmplList.length; i++) {
        if(tmplList[i].skip)
            continue;
		li_wrap = document.createElement("li");
		li_wrap.setAttribute("class", "mdl-list__item tmpl_list_item");
		li_wrap.setAttribute("onclick", "listSelect(" + tmplList[i].idx + ")");
		li_wrap.setAttribute("onmouseover", "this.style.backgroundColor='rgb(222, 222, 222)'");
		li_wrap.setAttribute("onmouseout", "this.style.backgroundColor=null");
		li_span = document.createElement("span");
		li_span.setAttribute("class", "mdl-list__item-primary-content");
		li_span.innerHTML = tmplList[i].name;
		li_wrap.appendChild(li_span);
		document.getElementById("tmpl_list").appendChild(li_wrap);
	}
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
	tmpl = x;
    msgTmpl = getFile(".//templates//" + tmplData[tmpl].fileName);
	updateTmplOpts();
	updateMsg();
	dialog.close();
}

/**************************************************
* Explicit Event Handlers
**************************************************/
/*
document.getElementById("msg").onkeydown = function(event) {
	var pos = getTextCursorPos(document.getElementById("msg"));
	//msgTmpl = msgTmpl.slice(0,pos) + 
	console.log(event.key);
}*/

document.getElementById("reset").onclick = function(){
    options = document.getElementsByClassName("opt_input");
    for(i=0;i<options.length;i++){
		options[i].className = options[i].className.replace(/\bmandatory_missing\b/, "");
        options[i].value = "";
    }
    updateMsg();
}

document.getElementById("copy").onclick = function() { copyToClipboard(false); };
function copyToClipboard(ignoreMandatory) {
    var options = tmplData[ tmpl ][ "options" ];
    var mandatoryOk = 0;
	for( i = 0; i < options.length; i++ ){
        option = document.getElementById(options[i].id);
        if(option.hasAttribute("mandatory")){
            if( option.getAttribute("mandatory") == "true" && option.value == "" ){
                mandatoryOk++;
                option.className += " mandatory_missing";
            }
        }
    }
    if( !mandatoryOk || ignoreMandatory ){
        document.getElementById( "msg" ).select();
        try {
            document.execCommand( "copy" );
        }
        catch( err ) {
            console.log( "Copy to clipboard failed! Err: " + err );
        }
    }
	else{
		var handler = function(event) {copyToClipboard(true);};
		var data = {
			message: "Missing " + mandatoryOk + " Required Fields",
			timeout: 2000,
			actionHandler: handler,
			actionText: "Copy Anyway?"
			};
		document.querySelector("#snackbar").MaterialSnackbar.showSnackbar(data);
	}
};


function getTextCursorPos(oField) {
	/* http://stackoverflow.com/a/2897229 */	
	var iCaretPos = 0;
	if (document.selection) {
		oField.focus();
		var oSel = document.selection.createRange();
		oSel.moveStart("character", -oField.value.length);
		iCaretPos = oSel.text.length;
	}
	else if (oField.selectionStart || oField.selectionStart == "0")
		iCaretPos = oField.selectionStart;
	return iCaretPos;
}

/**************************************************
* Dialog Logic & Handlers
**************************************************/
var dialog = document.querySelector('dialog');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
document.getElementById("select").onclick = function() {
    document.getElementById("tmplInput").value = "";
    updateTmplList();
	dialog.showModal();
};
document.getElementById("close_dialog").onclick = function() {
    dialog.close();
}
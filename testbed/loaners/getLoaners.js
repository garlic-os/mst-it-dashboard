/*jslint browser: true, devel: true, windows: true, vars: true, plusplus: true, bitwise: true, regexp: true, sloppy: true, indent: 4 */
/**************************************************************
* getLoaners.js
* Sean Apple
*   JSON handling and Dialogs adapted from msgFill.js by Stuart Miller
*    at mst.edu/~ithelp/email
*
* Loads the Json array that contains LoanerPC information and hosts
*  dialog action functions.
**************************************************************/

/**************************************************
* Variable Declarations
**************************************************/
var loanerData = [];
var id = 0;
var computerName = "";
var fileName = "";
var model = "";
var type = "";
var serial = "";
var os = "";
var loaned = "";
var date = "";

/**************************************************
* Onload Function
**************************************************/
window.onload = function () {
	// Get master configuration
	loanerData = JSON.parse(getFile(".//computers//data.json"));
	
	// Add each loaner to the page
	id = 0;
	for(var i=0; i<loanerData.length; i++) {
		// Filter Model Information
		model = "";
		if(loanerData[i].computerModel.includes("Latitude ")){
			model = loanerData[i].computerModel.replace('Latitude ', '');
		}
		else if(loanerData[i].computerModel.includes(" Pro 3")){
			model = loanerData[i].computerModel.replace(' Pro 3', '');
		}
		// Create Card for every device in list
		document.getElementById("loanerholder").innerHTML +=
		'<div class="'+model+'-square mdl-card mdl-shadow--2dp">'+
		'<div class="mdl-card__title mdl-card--expand">'+
		'<h2 class="mdl-card__title-text">'+loanerData[i].computerName+'</h2>'+
		'</div>'+
		'<div class="mdl-card__supporting-text">'+
		'<strong>'+loanerData[i].computerModel+'</strong><br />'+
		'<strong>Serial: </strong>'+loanerData[i].serialNumber+'<br />'+
		'<strong>Operating System: </strong>'+loanerData[i].operatingSystem+'<br />'+
		'<strong>Loaned To: </strong>'+loanerData[i].loanedTo+'<br />'+
		'<strong>Since: </strong>'+loanerData[i].dateSince+
		'</div>'+
		'<div class="mdl-card__actions mdl-card--border">'+
		'<button id="'+(loanerData[i].loanedTo == 'On Deck' ? 'checkoutLoan' : 'checkinLoan')+'" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary">'+
		(loanerData[i].loanedTo == 'On Deck' ? 'Loan Out' : 'Check In')+
		'</button>'+
		'<button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary">'+
		'Update Info'+
		'</button>'+
		'</div>'+
		'</div>'
	};
});
};
/**************************************************
* Functions
**************************************************/
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

function loadData() {
          var url = "https://docs.google.com/spreadsheet/pub?key=1I63SW0FmZOeDuNDISUFWJ-xp9sSZihXnxMFequTZ7j8&single=true&gid=0&range=A1&output=csv";
          xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4) {
                  document.getElementById("display").innerHTML = xmlhttp.responseText;
                  //alert(xmlhttp.responseText);
              }
          };
          xmlhttp.open("GET", url, true);
        

function checkout(id) {
	
}
/**************************************************
* Dialog Logic & Handlers
**************************************************/
var dialog = document.querySelector('dialog');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
document.getElementById("checkoutLoan").onclick = function() {
    document.getElementById("checkOutTo").value = "";
	document.getElementById("returnDate").value = "";
	document.getElementById("dialog_title").innerHTML = 'Check Out ' + loanerData[id].computerName;
    
	dialog.showModal();
};
document.getElementById("close_dialog").onclick = function() {
    dialog.close();
}

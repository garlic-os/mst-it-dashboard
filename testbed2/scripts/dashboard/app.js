/* IT Dashboard Customization Functions
Written By: Sean Apple
Modified: 11/12/21 by Nate Kean

Contains functions related to the dashboard app */

function loadApp() {
    // Load Auto Completes
    document.addEventListener("DOMContentLoaded", () => {
        // Netgroups
        // Clear out JavaScript warning
        document.getElementById('netgroupList').innerHTML = '';

        // Go through entire Netgroup list and add option for each.
        for(var i=0; i<netgroups.length; i++){
            var node = document.createElement("option");
            var val = document.createTextNode(netgroups[i]);
            node.appendChild(val);
            // Create netgroup list
            document.getElementById("netgroupList").appendChild(node);
        }

        // Building Codes
        // 0: Code | 1: Building
        // Clear out JavaScript warning
        document.getElementById('buildingList').innerHTML = '';
        // Go through entire building list and add option for each put code in data-value and name in value
        var options = '';
        for(var i=0; i<building.length; i++){
            // Create options
            options+= '<option data-value="'+building[i][0]+'" value="'+building[i][1]+'" />';   
        }
        // Send to page
        document.getElementById('buildingList').innerHTML = options;

        // onEnter actions
        setEnter();
    });
}

function setEnter(){
    var auser = document.getElementById("analyzeUser");
    var sccm = document.getElementById("sccm");
    var phone = document.getElementById("analyzePhone");
    var laps = document.getElementById("lapsPassword");
    var dell = document.getElementById("serviceTag");
    var ndbView = document.getElementById("netdb");
    var ndbReg = document.getElementById("netdbMac");
    var portB = document.getElementById("portBuilding");
    var portN = document.getElementById("portNumber");
    var turbo = document.getElementById("googleInput");

    // Create AUSER if exist
    if(cardExists(auser)){createEnter(auser, "analyzeUserButton");}
    // Create SCCM if exist
    if(cardExists(sccm)){createEnter(sccm, "sccmButton");}
    // Create Phone if exist
    if(cardExists(phone)){createEnter(phone, "phoneButton");}
    // Create laps if exist
    if(cardExists(laps)){createEnter(laps, "lapsButton");}
    // Create Dell if exist
    if(cardExists(dell)){createEnter(dell, "dellButton");}
    // Create ndbView if exist
    if(cardExists(ndbView)){createEnter(ndbView, "ndbViewButton");}
    // Create ndbReg if exist
    if(cardExists(ndbReg)){createEnter(ndbReg, "ndbRegButton");}
    // Create portB if exist
    if(cardExists(portB)){createEnter(portB, "portButton");}
    // Create portN if exist
    if(cardExists(portN)){createEnter(portN, "portButton");}
    // Create TURBO if exist
    if(cardExists(turbo)){createEnter(turbo, "turboButton");}
}

function createEnter(elementName, buttonName){
    elementName.addEventListener("keyup", function(event){
        // Number 13 is the 'enter' key on the keyboard
        if (event.keyCode === 13){
            // Cancel default action, if needed
            event.preventDefault();
            // Trigger button
            document.getElementById(buttonName).click();
        }
    })
}

function cardExists(elementName){
    var check = document.body.contains(elementName);
    return check;
}

function showPopup(){
    document.getElementById("iframeCard").className = "uk-animation-fade iframe-show";
}

function closePopup(){
    document.getElementById("iframeCard").className = "uk-animation-fade iframe-hide";
}

function expandPopup(){
	window.open(document.getElementById("iframeURL").src);
}

function navigate(title, URL){
    var self = this;
    setTimeout(function(){
        document.getElementById("iframeTitle").innerHTML = title;
        document.getElementById("iframeURL").method = 'get';
        document.getElementById("iframeURL").src = URL;
        self.showPopup();
    }, 300);   
}

function clearInput(element){
    document.getElementById(element).value = '';
}

function handleAnalyzeUser(mode){
    var value = document.getElementById("analyzeUser").value;
    switch(mode){
        case 0: // SSO or ID number
            var url = /^\d+$/.test(value) ? "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_emplid&emplid="+value+"&which=all" :
										    "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=view&userid="+value+"&which=all";
            navigate("Analyze User", url);
            clearInput("analyzeUser");
            break;
        case 1: // Name (partial)
            navigate("Analyze User - Name Search", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_name&partial_name="+value+"&which=all");
            clearInput("analyzeUser");
            break;
        case 2: // Email (partial)
            navigate("Analyze User - Email", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_email&email="+value+"&which=all");
			clearInput("analyzeUser");
            break;
        default:
            UIkit.notification({
                message: 'Unknown error in Analyze User! Please refresh and try again.',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
    }
}

function handleSccm(mode){
    var value = document.getElementById("sccm").value;
    switch(mode){
        case 0: // SSO or ID number
			navigate("Web Template Generator - OS Install","https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win10-x64-sccm2012&host=" + value);
			clearInput("sccm");
            break;
        case 1: // Name (partial)
            navigate("Web Template Generator - View Templates","https://cmdesk-p1.srv.mst.edu/ReportServer_RDP/Pages/ReportViewer.aspx?%2fConfigMgr_RDP%2f00+Desktop+Engineering%2fMST+All+task+sequence+deployments");
            clearInput("sccm");
            break;
        default:
            UIkit.notification({
                message: 'Unknown error in SCCM! Please refresh and try again.',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
    }
}

function handleAnalyzePhone(){
	var value = document.getElementById("analyzePhone").value;
	navigate("Analyze Phone", "https://telcom.mst.edu/auth-cgi-bin/cgiwrap/mysofttools/analyze-number.pl?phone=" + value);
	clearInput("analyzePhone");
}

function handleLaps(){
	var value = document.getElementById("lapsPassword").value;
	navigate("LAPS", "https://laps.mst.edu/auth-cgi-bin/cgiwrap/mstlaps/search.pl?query=" + value);
	clearInput("lapsPassword");
}

function handleDell(){
	var value = document.getElementById("serviceTag").value;
	// Dell sets X-Frame-Options to deny, so we cannot display this in an iframe
	window.open("http://www.dell.com/support/home/us/en/19/product-support/servicetag/" + value);
	clearInput("serviceTag");
}

function handleNetDB(mode){
    var value = document.getElementById("netdb").value;
    var regUser = document.getElementById("netdbOwner").value;
    var regMac = document.getElementById("netdbMac").value;

	switch(mode){
		case 0: // Host/MAC
			value = value.replace(/\:/g, '');
			var url = /^[0-9A-Fa-f]{6}[0-9A-Fa-f]*$/.test(value) ? "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byether&search=" + value :
																   "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search=" + value;
			navigate("NetDB Search - Host or MAC", url);
			break;
		case 1: // Location
			navigate("NetDB Search - Location", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byloc&search=" + value);
			break;
		case 2: // Owner
			navigate("NetDB Search - Owner", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byowner&search=" + value);
            break;
        case 3: // Register Standard
            navigate("NetDB Register Standard", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner=" + regUser + "&ether=" + regMac);
            break;
        case 4: // Register Traveling
            navigate("NetDB Register Traveling", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner=" + regUser + "&nametype=travelname&ether=" + regMac);
            break;
        case 5: // Description
            value = value.replace(' ', '+');
            navigate("NetDB Search - Description", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=bydesc&search=" + value);
            break;
        case 6: // IP
            navigate("NetDB Search - IP", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byip&search=" + value);
        default:
            UIkit.notification({
                message: 'Unknown error in NetDB! Please refresh and try again.',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
    }
    clearInput("netdbOwner");
    clearInput("netdbMac");
    clearInput("netdb");
}


function handleForm() {
    var self = this;
    this.showPopup();
    // We have to wait a split second or the model is updated before the form can be opened
    setTimeout(function () {
        clearInput("netgroupUserInput");
        clearInput("netgroupNetGroupInput");
        clearInput("netgroupViewInput");
    }, 250);
}

function handlePorts() {
    var shownBuilding = document.getElementById("portBuilding").value;
    var building = '';
    var port = document.getElementById("portNumber").value;
    //Check if input in Building, if yes, convert to building code.
    if (shownBuilding != "") {
        building = document.querySelector("#buildingList option[value='" + shownBuilding + "']").dataset.value;
    }
    navigate('Port Search', 'https://itweb.mst.edu/auth-cgi-bin/cgiwrap/swconf/user-port-search.pl?mode=search&location=' + building + '&jack=' + port);
    clearInput("portBuilding");
    clearInput("portNumber");
}

function handlePeople(mode) {
    switch (mode) {
        case 0: // Normal
            var self = this;
            // We have to wait a split second or the model is updated before the form can be opened
            setTimeout(function () {
                clearInput("peopleInput");
            }, 250);
            break;
        case 1: // Turbo (Google)
            var value = document.getElementById("googleInput").value;
            window.open("https://www.google.com/contacts/u/0/search/" + value.replace(/ /g, "+"));
            clearInput("googleInput");
            break;
        default:
            UIkit.notification({
                message: 'Unknown error in People Search! Please refresh and try again.',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
    }
}
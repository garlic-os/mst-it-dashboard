/* IT Dashboard Customization Functions
Written By: Sean Apple
Modified: 11/12/21 by Nate Kean

Contains functions related to the dashboard app */

const countryCodesPromise = loadJSON("./data/dashboard/countryCodes.json");
const formatPhone = document.getElementById("formatPhone");

(async function () {
    // Netgroups
    // Clear out JavaScript warning
    const netgroupList = document.getElementById('netgroupList');
    netgroupList.innerHTML = "";

    // Go through entire Netgroup list and add option for each.
    let options = "";
    for (const netgroup of await loadJSON("./data/dashboard/netgroups.json")) {
        options += `<option value="${netgroup}" />`;
    }
    netgroupList.innerHTML = options;

    // Building Codes
    // 0: Code | 1: Building

    // Clear out JavaScript warning
    const buildingList = document.getElementById('buildingList');
    buildingList.innerHTML = "";

    // Go through entire building list and add option for each put code in data-value and name in value
    options = "";
    for (const building of await loadJSON("./data/dashboard/buildings.json")) {
        // Create options
        options += `<option data-value="${building[0]}" value="${building[1]}" />`;
    }
    buildingList.innerHTML = options;
})();

// onEnter actions
setEnter();

function setEnter() {
    const auser = document.getElementById("analyzeUser");
    const sccm = document.getElementById("sccm");
    const phone = document.getElementById("analyzePhone");
    const laps = document.getElementById("lapsPassword");
    const dell = document.getElementById("serviceTag");
    const ndbView = document.getElementById("netdb");
    const ndbReg = document.getElementById("netdbMac");
    const portB = document.getElementById("portBuilding");
    const portN = document.getElementById("portNumber");
    const turbo = document.getElementById("googleInput");

    if (cardExists(auser))   createEnter(auser, "analyzeUserButton");
    if (cardExists(sccm))    createEnter(sccm, "sccmButton");
    if (cardExists(phone))   createEnter(phone, "phoneButton");
    if (cardExists(laps))    createEnter(laps, "lapsButton");
    if (cardExists(dell))    createEnter(dell, "dellButton");
    if (cardExists(ndbView)) createEnter(ndbView, "ndbViewButton");
    if (cardExists(ndbReg))  createEnter(ndbReg, "ndbRegButton");
    if (cardExists(portB))   createEnter(portB, "portButton");
    if (cardExists(portN))   createEnter(portN, "portButton");
    if (cardExists(turbo))   createEnter(turbo, "turboButton");
    if (cardExists(formatPhone))   createEnter(formatPhone, "formatNumberButton");
}

function createEnter(elementName, buttonName) {
    elementName.addEventListener("keyup", function(event) {
        // Number 13 is the 'enter' key on the keyboard
        if (event.keyCode === 13) {
            // Cancel default action, if needed
            event.preventDefault();
            // Trigger button
            document.getElementById(buttonName).click();
        }
    })
}

async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

function cardExists(elementName) {
    var check = document.body.contains(elementName);
    return check;
}

function showPopup() {
    document.getElementById("iframeCard").className = "uk-animation-fade iframe-show";
}

function closePopup() {
    document.getElementById("iframeCard").className = "uk-animation-fade iframe-hide";
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Escape") {
        closePopup();
    }
});

}

function navigate(title, url) {
    document.getElementById("iframeTitle").innerHTML = title;
    document.getElementById("iframeURL").src = url;
    document.getElementById("expandButton").href = url;
    showPopup();
}

function clearInput(element) {
    document.getElementById(element).value = '';
}

function handleAnalyzeUser(mode) {
    var value = document.getElementById("analyzeUser").value;
    switch(mode) {
        case 0: // SSO or ID number
            var url = /^\d+$/.test(value) ? "https://analyzer.apps.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_emplid&emplid="+value+"&which=all" :
										    "https://analyzer.apps.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=view&userid="+value+"&which=all";
            navigate("Analyze User", url);
            clearInput("analyzeUser");
            break;
        case 1: // Name (partial)
            navigate("Analyze User - Name Search", "https://analyzer.apps.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_name&partial_name="+value+"&which=all");
            clearInput("analyzeUser");
            break;
        case 2: // Email (partial)
            navigate("Analyze User - Email", "https://analyzer.apps.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_email&email="+value+"&which=all");
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

function handleAnalyzePhone() {
	var value = document.getElementById("analyzePhone").value;
	navigate("Analyze Phone", "https://telcom.mst.edu/auth-cgi-bin/cgiwrap/mysofttools/analyze-number.pl?phone=" + value);
	clearInput("analyzePhone");
}

function handleLaps() {
	var value = document.getElementById("lapsPassword").value;
	navigate("LAPS", "https://laps.mst.edu/auth-cgi-bin/cgiwrap/mstlaps/search.pl?query=" + value);
	clearInput("lapsPassword");
}

function handleDell() {
	var value = document.getElementById("serviceTag").value;
	// Dell sets X-Frame-Options to deny, so we cannot display this in an iframe
	window.open("http://www.dell.com/support/home/us/en/19/product-support/servicetag/" + value);
	clearInput("serviceTag");
}

function handleNetDB(mode) {
    var value = document.getElementById("netdb").value;
    var regUser = document.getElementById("netdbOwner").value;
    var regMac = document.getElementById("netdbMac").value;

	switch(mode) {
		case 0: // Host/MAC
			value = value.replace(/\:/g, '');
			var url = /^[0-9A-Fa-f]{6}[0-9A-Fa-f]*$/.test(value) ? "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byether&search=" + value :
																   "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search=" + value;
			navigate("NetDB Search - Host or MAC", url);
			break;
		case 1: // Location
			navigate("NetDB Search - Location", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byloc&search=" + value);
			break;
		case 2: // Owner
			navigate("NetDB Search - Owner", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byowner&search=" + value);
            break;
        case 3: // Register Standard
            navigate("NetDB Register Standard", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner=" + regUser + "&ether=" + regMac);
            break;
        case 4: // Register Traveling
            navigate("NetDB Register Traveling", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner=" + regUser + "&nametype=travelname&ether=" + regMac);
            break;
        case 5: // Description
            value = value.replace(' ', '+');
            navigate("NetDB Search - Description", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=bydesc&search=" + value);
            break;
        case 6: // IP
            navigate("NetDB Search - IP", "https://netdb.apps.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byip&search=" + value);
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


function handleNetgroups() {
    // navigate("Netgroups", "https://netgroups.apps.mst.edu/auth-cgi-bin/cgiwrap/netgroups/netmngt.pl");
    showPopup();
    clearInput("netgroupUserInput");
    clearInput("netgroupNetGroupInput");
    clearInput("netgroupViewInput");
}

function handlePorts() {
    var shownBuilding = document.getElementById("portBuilding").value;
    var building = '';
    var port = document.getElementById("portNumber").value;
    //Check if input in Building, if yes, convert to building code.
    if (shownBuilding != "") {
        building = document.querySelector("#buildingList option[value='" + shownBuilding + "']").dataset.value;
    }
    navigate('Port Search', 'https://swconf.apps.mst.edu/auth-cgi-bin/cgiwrap/swconf/user-port-search.pl?mode=search&location=' + building + '&jack=' + port);
    clearInput("portBuilding");
    clearInput("portNumber");
}

function handlePeople(mode) {
    switch (mode) {
        case 0: // Normal
            // We have to wait a split second or the model is updated before the form can be opened
            clearInput("peopleInput");
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

async function getCountryCode(phoneNumber) {
    const countryCodes = await countryCodesPromise;
    for (const code of countryCodes) {
        if (phoneNumber.startsWith(code)) {
            return code;
        }
    }
    return "";
}

async function handleFormatNumber() {
    let phoneNumber = formatPhone.value.replace(/\D/g, "");
    const countryCode = await getCountryCode(phoneNumber);
    formatPhone.value = "+" + countryCode + " " + phoneNumber.substring(countryCode.length);
}

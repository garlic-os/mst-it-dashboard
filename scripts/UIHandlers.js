var analyzeUserHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		if (/^\d+$/.test(e.target.value)) {
			window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_emplid&emplid="+e.target.value+"&which=all");
		}
		else {
			window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=view&userid="+e.target.value+"&which=all");
		}
		e.target.value = "";
	}
}

var netDBRegisterHandler = function(e) {
	var user = document.querySelector("#netdb_user").value;
	var mac = document.querySelector("#netdb_mac").value;
	window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner="+user+"&ether=" + mac);
	user = "";
	mac = "";
}

var netDBSearchHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		var dbsearchInput = document.querySelector("#netdb_search");
		dbsearch = dbsearchInput.value.replace(/\:/g, '');
		if (/^[0-9A-Fa-f]{6}[0-9A-Fa-f]*$/.test(dbsearch)) {
			window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byether&search=" + dbsearch);
		}
		else {
			window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search=" + dbsearch);
		}
		dbsearchInput.value = "";
	}
}

var passResetHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		window.open("https://password.mst.edu/auth-cgi-bin/cgiwrap/pwchanger/reset.pl?userid=" + e.target.value);
		e.target.value = "";
	}
}

var sccmHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win7-x64-sccm2012&host=" + e.target.value);
		e.target.value = "";
	}
}

var phoneHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		window.open("https://telcom.mst.edu/auth-cgi-bin/cgiwrap/mysofttools/analyze-number.pl?phone=" + e.target.value);
		e.target.value = "";
	}
}

var fillNetgroupInput = function(e) {
	document.querySelector("#netgroupInput").value = e.target.value;
	var menu = document.querySelector("#netgroupMenu");
	while (menu.firstChild) {
	    menu.removeChild(menu.firstChild);
	}
}
var fillNetgroupViewInput = function(e) {
	document.querySelector("#netgroupViewInput").value = e.target.value;
	var menu = document.querySelector("#netgroupViewMenu");
	while (menu.firstChild) {
	    menu.removeChild(menu.firstChild);
	}
}

var addNetgroupElement = function(text) {
	var el = document.createElement("div");
	var elText = document.createTextNode(text);
	el.appendChild(elText);
	el.value = text;
	el.addEventListener("click", fillNetgroupInput);
	document.querySelector("#netgroupMenu").appendChild(el);
}

var addNetgroupViewElement = function(text) {
	var el = document.createElement("div");
	var elText = document.createTextNode(text);
	el.appendChild(elText);
	el.value = text;
	el.addEventListener("click", fillNetgroupViewInput);
	document.querySelector("#netgroupViewMenu").appendChild(el);
}

var findSuggestions = function(subString) {
	var suggestions = []
	if (subString.length == 0) {
		return [];
	}
	netgroups.forEach(function(netgroup){
		if (netgroup.search(subString) !== -1 || netgroup.search(subString.toLowerCase()) !== -1) {
			suggestions.push(netgroup);
		}
	});
	return suggestions;
}

var dellHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		window.open("http://www.dell.com/support/home/us/en/19/product-support/servicetag/" + e.target.value);
		e.target.value = "";
	}
}

var stephenHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		document.querySelector("#toast").MaterialSnackbar.showSnackbar({message: "Stephen Says: " + e.target.value});
		e.target.value = "";
	}
}

var turboHandler = function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		window.open("https://www.google.com/contacts/u/0/#contacts/search/" + e.target.value.split(" ").join("+"));
		e.target.value = "";
	}
}

// Enter on Analyze input field
document.querySelector("#analyzeUserInput").addEventListener("keypress", function(e) {
	analyzeUserHandler(e);
});

// Analyze Search Button
document.querySelector("#analyzeSearch").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#analyzeUserInput")};
	analyzeUserHandler(fakeKeyInputEvent);
});

// Enter on Netdb Search input field
document.querySelector("#netdb_search").addEventListener("keypress", function(e) {
	netDBSearchHandler(e);
});

// NetDB Search Button
document.querySelector("#netdbSearch").addEventListener("click", function(e) {
	var fakeKeyInputEvent = {which: 13};
	netDBSearchHandler(fakeKeyInputEvent);
});

// NetDB Register Button
document.querySelector("#netdbRegister").addEventListener("click", function(e) {
	netDBRegisterHandler(e);
});

// Enter on PassReset input field
document.querySelector("#passResetInput").addEventListener("keypress", function(e) {
	passResetHandler(e);
});

// PassReset Button
document.querySelector("#passReset").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#passResetInput")};
	passResetHandler(fakeKeyInputEvent);
});

// Enter on sccm input field
document.querySelector("#sccmInput").addEventListener("keypress", function(e) {
	sccmHandler(e);
});

document.querySelector("#sccm").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#sccmInput")};
	sccmHandler(fakeKeyInputEvent);
});
// phone Button
document.querySelector("#phone").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#phoneInput")};
	phoneHandler(fakeKeyInputEvent);
});

// Enter on phone input field
document.querySelector("#phoneInput").addEventListener("keypress", function(e) {
	phoneHandler(e);
});

// phone Button
document.querySelector("#phone").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#phoneInput")};
	phoneHandler(fakeKeyInputEvent);
});

//netgroup input field
document.querySelector("#netgroupInput").addEventListener("input", function(e) {
	var menu = document.querySelector("#netgroupMenu");
	while (menu.firstChild) {
	    menu.removeChild(menu.firstChild);
	}
	var suggestions = findSuggestions(e.target.value);
	suggestions.forEach(addNetgroupElement);
});

document.querySelector("#netgroupViewInput").addEventListener("input", function(e) {
	var menu = document.querySelector("#netgroupViewMenu");
	while (menu.firstChild) {
	    menu.removeChild(menu.firstChild);
	}
	var suggestions = findSuggestions(e.target.value);
	suggestions.forEach(addNetgroupViewElement);
});

document.querySelector("#stephen_input").addEventListener("keypress", function(e){
	stephenHandler(e);
});

// Enter on dell input field
document.querySelector("#dellInput").addEventListener("keypress", function(e) {
	dellHandler(e);
});

// Dell Search Button
document.querySelector("#dellSearch").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#dellInput")};
	dellHandler(fakeKeyInputEvent);
});

// Enter on peopleTurbo input field
document.querySelector("#turboPeopleInput").addEventListener("keypress", function(e) {
	turboHandler(e);
});

// People Turbo Search Button
document.querySelector("#turboPeopleSearch").addEventListener("click", function() {
	var fakeKeyInputEvent = {which: 13, target: document.querySelector("#turboPeopleInput")};
	turboHandler(fakeKeyInputEvent);
});
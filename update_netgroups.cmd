@set @junk=1/*
@echo off
cscript //nologo //E:jscript %0 %*
pause
goto :eof
*/

WScript.StdOut.WriteLine("********************************\r\n* Netgroup List Update Utility *\r\n********************************");

// Variables
var filename = "scripts/dashboard/netgroups.js";
var url = "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netgroups/netmngt.pl"
var output = "";

// Create & send HTTP request
WScript.StdOut.WriteLine("-> Fetching HTML from Netgroup Tool...");
var http = WScript.CreateObject('Msxml2.XMLHTTP.6.0');
http.open("GET", url, false);
http.send();

// Parse response
if (http.status != 200) {
	WScript.StdOut.WriteLine("-> Error: Status " + http.status + " returned on download.");
} else {
	WScript.StdOut.WriteLine("-> Parsing netgroup names...");
	html = http.responseText;
	html = html.slice(html.search("<select name='groups'"), html.search("</select>"));
	var idx1 = 0, idx2 = 0;
	while(1){
		idx3 = idx1;
		idx1 = html.indexOf("<option value=" ,idx2) + 14;
		idx2 = html.indexOf(">" ,idx1);
		if(idx3 > idx1)
			break;
		else
			output = output + "\"" + html.slice(idx1, idx2) + "\",\r\n";
	}
	output = output.slice(0,-1);
	output = "var netgroups = [\r\n" + output + "]";

	// Write output to file
	WScript.StdOut.WriteLine("-> Writing output to file...");
	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
	fso.CreateTextFile(filename);
	var fileObj = fso.GetFile(filename);
	var fileStream = fileObj.OpenAsTextStream(2, -2);
	fileStream.WriteLine(output);
	fileStream.Close();
	WScript.StdOut.WriteLine("-> Done!");
}
/* New Tab Redirect Scripts
 * *****************************
 * Orignally by: Cody Gieseke
 * Updated by; Stuart Miller
 * October 29, 2015
 */
$(document).ready(function()
{
	$("#analyze1").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=view&userid="
				+$("#analyze1").val()+"&which=all");
				document.getElementById("analyze1").value = "";
			}
	});
	
	$("#analyze2").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_emplid&emplid="
				+$("#analyze2").val()+"&which=all");
				document.getElementById("analyze2").value = "";
			}
	});
	
	$("#netdb1").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search="
				+$("#netdb1").val());
				document.getElementById("netdb1").value = "";
			}
	});
		
	$("#netdb2").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner="
				+$("#netdb2").val());
				document.getElementById("netdb2").value = "";
			}
	});
	
	$("#password").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://password.mst.edu/auth-cgi-bin/cgiwrap/pwchanger/reset.pl?userid="
				+$("#password").val());
				document.getElementById("password").value = "";
			}
	});
	
	$("#sccm").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win7-x64-sccm2012&host="
				+$("#sccm").val()+".managed.mst.edu");
				document.getElementById("sccm").value = "";
			}
	});
	
	$("#phone").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://telcom.mst.edu/auth-cgi-bin/cgiwrap/mysofttools/analyze-number.pl?phone="
				+$("#phone").val());
				document.getElementById("phone").value = "";
			}
	});	
	
	$("#ggroups").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/listmgr/google/list_pubutil.pl?mode=show&id="
				+$("#ggroups").val()+"@mst.edu");
				document.getElementById("ggroups").value = "";
			}
	});
	
	$("#printer").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://printer.mst.edu/auth-cgi-bin/cgiwrap/lprsrv/control.pl?mode=view&printers="
				+$("#printer").val());
				document.getElementById("printer").value = "";
			}
	});
	$("#stephen-text").keypress(function (e)
	{
	    if (e.which == 13) {
	        alert("Stephen says: \r\n"+$("#stephen-text").val());
	    }
	});
	
});

function solidworks() {
	document.getElementById("solidworks").value = "it-solidworks-download-users";
	
	
}
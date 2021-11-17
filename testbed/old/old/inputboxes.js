//Cody Gieseke

$(document).ready(function()
{
  $("#analyze").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=view&userid="
				+$("#analyze").val()+"&which=all");
				document.getElementById("analyze").value = "";
			}
	});
	
	$("#netdb").keypress(function(e)
	{
			if(e.which == 13)
			{
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search="
				+$("#netdb").val());
				document.getElementById("netdb").value = "";
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
				window.open("https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win7-x64-sccm&host="
				+$("#sccm").val()+".managed.mst.edu");
				document.getElementById("sccm").value = "";
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
	
});
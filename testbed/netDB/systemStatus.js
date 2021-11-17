document.addEventListener('DOMContentLoaded', function() {
	
	// Feed URL
	var url = "https://status.missouri.edu/history.rss";
	
	// Get all systemStatus container elements
	var statusElements = document.getElementsByClassName("systemStatus");
	for (var i = 0; i < statusElements.length; i++) {
		
		// Find the button child element
		for (var j = 0; j < statusElements[i].children.length; j++) {
			var el = statusElements[i].children[j];
			if (el.classList.contains("systemStatus-button")) {
				
				// Add an event handler that finds the siblings content element
				// and then toggles its "display: none" style
				el.onclick = function(){
					var siblings = this.parentNode.children;
					for (var k = 0; k < siblings.length; k++) {
						if(siblings[k].classList.contains("systemStatus-content")){
							if(siblings[k].style.display != "inherit")
								siblings[k].style.display = "inherit";
							else
								siblings[k].style.display = "none";
						}
					}
				};
				
			}
		}
	}
	
	// Create and send a request to get feed data
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
		   var parser = new DOMParser();
		   xml = parser.parseFromString(this.responseText, "text/xml");
		   /* console.log(xml); */
		   
			// When data is ready, fill content element(s)
			fillElements()
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
		
	function fillElements() {
		
		var inProgress = false;
		
		contentEls = document.getElementsByClassName("systemStatus-content");
		for (var i = 0; i < contentEls.length; i++) {

			// Format and insert data
			contentEls[i].innerHTML = "";
			var items = xml.getElementsByTagName("item");
			for (var k = 0; k < items.length; k++) {
				
				// Get each tage that we care about
				var title = items[k].getElementsByTagName("title")[0].innerHTML;
				var date = items[k].getElementsByTagName("pubDate")[0].innerHTML;
				var desc = items[k].getElementsByTagName("description")[0].textContent;
				
				/* // Test "in progress" option
				if(k == 0)
					desc = desc.replace("Resolved", "~~~~~~~"); */
				
				// Build up a string of html
				var html = "<div><button class='systemStatus-expand'>";
				if((desc.search("Resolved") == -1) && (desc.search("Complete") == -1)) {
					html += "<span class='systemStatus-status' style='color: #f48b8b;'>&#x2717;</span>";
					inProgress = true;
				} else {
					html += "<span class='systemStatus-status' style='color: #90f48b;'>&#10004</span>";
				}
				html += "<span class='systemStatus-titleContainer'>";
				html += "<div class='systemStatus-title'>" + title + "</div>";
				html += "<div class='systemStatus-date'>" + date + "</div>";
				html += "</span></button>";;
				html += "<div class='systemStatus-desc'><p>" + desc + "</p></div>";
				html += "</div>";						
				
				contentEls[i].innerHTML += html;
			}
		}
			
		// Add an expansion callback to each expandable button
		var buttons = document.getElementsByClassName("systemStatus-expand");
		for (j = 0; j < buttons.length; j++) {
			buttons[j].onclick = function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.maxHeight) {
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				} 
			};
		}
		
		// Update status button color
		if(inProgress) {
			var buttons = document.getElementsByClassName("systemStatus-button");
			for (var k = 0; k < buttons.length; k++)
				buttons[k].style.color = "#f48b8b";
		}
	}
});

// Feed URL
const url = "https://status.missouri.edu/history.rss";

(async function () {
	// Request and parse the feed data
	const response = await fetch(url);
	const responseText = await response.text();
	const parser = new DOMParser();
	const xml = parser.parseFromString(responseText, "text/xml");

	// Format and insert data
	const pageContent = document.querySelector(".system-status");
	for (const item of xml.querySelectorAll("item")) {
		// Get the content of each tag that we care about
		const title = item.querySelectorAll("title")[0].innerHTML;
		const date = item.querySelectorAll("pubDate")[0].innerHTML;
		const desc = item.querySelectorAll("description")[0].textContent;
		
		/* // Test "in progress" option
		if (items.length == 0)
			desc = desc.replace("Resolved", "~~~~~~~"); */
		
		// Build up a string of html
		let statusIcon;
		if (!desc.includes("Resolved") && !desc.includes("Complete") && !desc.includes("Monitoring")) {
			statusIcon = `<span class="status-icon" style="color: #f48b8b;">&#x2717;</span>`;
		} else {
			statusIcon = `<span class="status-icon" style="color: #90f48b;">&#10004</span>`;
		}
		
		pageContent.innerHTML += `
			<div class="entry">
				<button class="expand-button">
					${statusIcon}
					<span class="title-container">
						<div class="title">${title}</div>
						<div class="date">${date}</div>
					</span>
				</button>
				<div class="desc">
					<p>${desc}</p>
				</div>
			</div>
		`;
	}
		
	// Add an expansion callback to each expandable button
	for (const button of document.querySelectorAll(".system-status .expand-button")) {
		button.addEventListener("click", function () {
			button.classList.toggle("active");
		});
	}
	
	// Update status button color
	// if (inProgress) {
	// 	var buttons = document.getElementsByClassName("system-status-button");
	// 	for (var k = 0; k < buttons.length; k++)
	// 		buttons[k].style.color = "#f48b8b";
	// }
})();

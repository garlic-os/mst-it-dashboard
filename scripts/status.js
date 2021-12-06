// Feed URL
const url = "https://status.missouri.edu/history.rss";

// Keywords to look for in the XML and the corresponding colors to give the
// notification icon
const statusHeirarchy = {
    "warning": ["Monitoring", "Investigating"],
}

function includesAny(str, arr) {
    return arr.some(v => str.includes(v));
}

(async function () {
	// Request and parse the feed data
	const response = await fetch(url);
	const xml = await response.text();

    for (const [ statusType, keywords ] of Object.entries(statusHeirarchy)) {
        if (includesAny(xml, keywords)) {
            document.addEventListener("DOMContentLoaded", function () {
                document.querySelector(".system-status-button").classList
                    .add(`system-status-button--${statusType}`);
            });
            break;
        }
    }
})();

/*
	app.js

	The primary script run as an event page. Uses message passing to the content
	script (fontfetch.js) for accessing the DOM of the current active tab.
*/

/* Create context menu onclick callback */
function clickCallback() {
	/* Pass message to fontfetch.js content script in current tab */
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { msg: "fontfetch" }, function(response) {
			if (typeof response.fonts === 'undefined')
				return;

			/* Turn font-family string into array of strings */
			var fonts = response.fonts.replace(/'/g, '').split(', ');

			/* Find the first installed font */
			chrome.fontSettings.getFontList(function (results) {
				/* Names in font list don't match those in the font-family list.
				Maybe read from Dev Console? */
			});
		});
	});
}

/* Create Context Menu item */
var props = {
	type: 'normal',
	title: 'Ooh, what font is this?',
	/* ID is arbitrary, needed for operating as an event page */
	id: 'fontQuery',
	contexts: [ 'all' ]
}

var menuItem = chrome.contextMenus.create(props);

/* Register context menu item callback */
chrome.contextMenus.onClicked.addListener(clickCallback);

/* For keeping up to date.
Make sure the content scripts are injected into every page on first install and
on upgrade */
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason === "install" || details.reason === "update") {
		chrome.windows.getAll({ populate: true }, function(windows) {
			/* For every window */
			for (var i = 0; i < windows.length; i++) {
				/* For every tab */
				var tabs = windows[i].tabs;
				for (var j = 0; j < tabs.length; j++)
					chrome.tabs.executeScript(tabs[j].id, { file: "fontfetch.js" });
			}
		});
	}
});
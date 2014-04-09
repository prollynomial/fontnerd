/*
	fontfetch.js

	Content script acting as a bridge between the extension	(app.js) and the
	current active tab's DOM.
*/

/* Keep track of where the user right clicks. */
var lastClicked;
window.addEventListener('contextmenu', function(event) {
	lastClicked = event.target;
});

/* Listen for incoming messages from the extension. */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	/* Upon receiving a message from the extension, send the computed font-family 
	property for the element that was last right clicked. */
	if (typeof request.msg !== 'undefined' &&  request.msg === "fontfetch")
		sendResponse({ fonts: window.getComputedStyle(lastClicked).fontFamily });
});
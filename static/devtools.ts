/// <reference types="chrome" />

chrome.devtools.panels.create('DataWeaver', 'favicon.png', 'index.html', (panel) => {
	console.info('DevTools panel created', panel);
});

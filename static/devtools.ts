/// <reference types="chrome" />

chrome.devtools.panels.create('DataWeaver', 'favicon.png', 'index.html', ({ onShown }) => {
	onShown.addListener(() => {
		chrome.runtime.sendMessage({ type: 'DW_START' }, (response) => {
			console.log('[DevTools] Inject request sent', response);
		});
	});
});

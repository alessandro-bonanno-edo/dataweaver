/// <reference types="chrome" />

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'DW_START') {
		chrome.tabs
			.query({ active: true, currentWindow: true })
			.then(([tab]) => {
				if (tab?.id) {
					return chrome.scripting.executeScript({
						target: { tabId: tab.id },
						world: 'MAIN',
						files: ['main.js']
					});
				} else {
					throw new Error('No active tab found');
				}
			})
			.then(() => sendResponse({ success: true }))
			.catch((err) => sendResponse({ success: false, error: err.message }));

		return true;
	}
	if (message.type === 'DW_DATA_ISOLATED') {
		chrome.runtime.sendMessage({
			type: 'DW_DATA_BACKGROUND',
			payload: message.payload
		});
	}
});

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

		return true; // ✅ keeps the message channel open for async sendResponse
	}
	if (message.type === 'DW_DATA_ISOLATED') {
		// Handle the data received from the isolated world
		console.log('[Background] Received data from isolated world:', message.payload);
		chrome.runtime.sendMessage({
			type: 'DW_DATA_BACKGROUND',
			payload: message.payload
		});
	}
	// For other messages you can add handlers, and return true as needed
});

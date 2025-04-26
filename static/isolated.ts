/// <reference types="chrome" />

window.addEventListener('message', (event) => {
	if (event.source !== window) return;
	if (!event.data?.source || event.data.source !== 'DW_DATA') return;

	console.log('[Isolated] Received from main world:', event.data.payload);

	// Forward to background if needed
	chrome.runtime.sendMessage({
		type: 'DW_DATA_ISOLATED',
		payload: event.data.payload
	});
});

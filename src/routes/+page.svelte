<script lang="ts">
	let dataLayer = $state<unknown[]>([]);
	let tc_vars = $state<Record<string, unknown>>({});
	let sessionScope = $state<Record<string, unknown>>({});

	function handleIncomingMessage(message: any) {
		if (message?.type === 'DW_DATA_BACKGROUND') {
			console.log('[Svelte] Received data from extension:', message.payload);

			dataLayer = message.payload.dataLayer || [];
			tc_vars = message.payload.tc_vars || {};
			sessionScope = message.payload.sessionScope || {};
		}
	}

	$effect(() => {
		const listener = (message: any) => handleIncomingMessage(message);

		chrome.runtime.onMessage.addListener(listener);

		return () => chrome.runtime.onMessage.removeListener(listener);
	});
</script>

<div>
	<h2>DataLayer</h2>
	<pre>{JSON.stringify(dataLayer, null, 2)}</pre>
</div>

<div>
	<h2>tc_vars</h2>
	<pre>{JSON.stringify(tc_vars, null, 2)}</pre>
</div>

<div>
	<h2>SessionScope</h2>
	<pre>{JSON.stringify(sessionScope, null, 2)}</pre>
</div>

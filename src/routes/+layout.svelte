<script lang="ts">
	import '$lib/styles/index.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<Header />

<main>
	{@render children()}
</main>

<Footer />

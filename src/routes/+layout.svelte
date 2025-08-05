<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Background from '$lib/background/Background.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
	<Background />
	<Header />
	<div class="content">
		<main>
			{@render children?.()}
		</main>
	</div>
</div>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.app-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>

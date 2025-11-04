<script lang="ts">
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { page } from '$app/stores';
	import '../app.css';

	let { children } = $props();

	// Check if we're on an admin route (excluding login)
	let isAdminRoute = $derived($page.url.pathname.startsWith('/admin') && !$page.url.pathname.startsWith('/admin/login'));
</script>

<div class="app">
	{#if !isAdminRoute}
		<Header />
	{/if}

	<main>
		{@render children()}
	</main>

	{#if !isAdminRoute}
		<Footer />
	{/if}

	<!-- Global Notifications -->
	<Notification />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		position: relative;
	}
</style>

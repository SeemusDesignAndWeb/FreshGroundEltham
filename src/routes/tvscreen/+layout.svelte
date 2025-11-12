<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import '../../app.css';

	let { children } = $props();
</script>

<div class="tv-screen-layout">
	<main>
		{@render children()}
	</main>

	<!-- Global Notifications -->
	<Notification />
</div>

<style>
	.tv-screen-layout {
		position: fixed;
		inset: 0;
		overflow: hidden;
	}

	main {
		width: 100%;
		height: 100%;
	}
</style>


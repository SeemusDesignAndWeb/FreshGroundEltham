<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { TvScreenSettings } from '$lib/server/database';

	let images = $state<string[]>([]);
	let currentIndex = $state(0);
	let transitionDuration = $state(5000);
	let isLoading = $state(true);
	let transitionTimer: ReturnType<typeof setInterval> | null = null;
	let loadedImages = $state<Set<string>>(new Set());

	onMount(async () => {
		await loadTvScreenSettings();
		if (images.length > 0) {
			preloadImages();
			startTransition();
		}
		isLoading = false;
	});

	onDestroy(() => {
		if (transitionTimer) {
			clearInterval(transitionTimer);
		}
	});

	async function loadTvScreenSettings() {
		try {
			const response = await fetch('/api/tv-screen');
			if (response.ok) {
				const data: TvScreenSettings = await response.json();
				images = data.images || [];
				transitionDuration = data.transitionDuration || 5000;
			}
		} catch (error) {
			console.error('Error loading TV screen settings:', error);
		}
	}

	function startTransition() {
		if (images.length <= 1) return;
		
		if (transitionTimer) {
			clearInterval(transitionTimer);
		}
		
		transitionTimer = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, transitionDuration);
	}

	function goToImage(index: number) {
		currentIndex = index;
		if (transitionTimer) {
			clearInterval(transitionTimer);
		}
		startTransition();
	}

	function preloadImages() {
		images.forEach((imageUrl) => {
			const img = new Image();
			img.onload = () => {
				loadedImages.add(imageUrl);
			};
			img.onerror = () => {
				console.error('Failed to preload image:', imageUrl);
			};
			img.src = imageUrl;
		});
	}
</script>

<svelte:head>
	<title>TV Screen - Fresh Ground Eltham</title>
	<meta name="description" content="TV Screen Display" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="tv-screen-container fixed inset-0 bg-black overflow-hidden">
	{#if isLoading}
		<div class="flex items-center justify-center h-full">
			<div class="text-white text-xl">Loading...</div>
		</div>
	{:else if images.length === 0}
		<div class="flex items-center justify-center h-full">
			<div class="text-white text-xl text-center px-4">
				<p>No images configured for TV screen.</p>
				<p class="text-sm mt-2 text-gray-400">Please configure images in the admin panel.</p>
			</div>
		</div>
	{:else}
		{#each images as image, index}
			<div
				class="tv-image absolute inset-0 transition-opacity duration-1000 ease-in-out {index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
			>
				<img
					src={image}
					alt="TV Screen Image {index + 1}"
					class="w-full h-full object-cover"
					onerror={(e) => {
						console.error('Failed to load image:', image);
						(e.target as HTMLImageElement).style.display = 'none';
					}}
				/>
			</div>
		{/each}
	{/if}
</div>

<style>
	.tv-screen-container {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.tv-image img {
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}
</style>


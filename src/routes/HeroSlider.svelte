<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentIndex = $state(0);
	let images = [
		'/images/coffee-cup-hero.jpg',
		'/images/coffee-making.jpg',
		'/images/coffee-latte-art.jpg',
		'/images/pastries.jpg',
		'/images/coffee-beans-background.jpg'
	];
	
	let interval: ReturnType<typeof setInterval>;
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}
	
	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}
	
	onMount(() => {
		// Change image every 5 seconds
		interval = setInterval(nextImage, 5000);
		
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	});
</script>

<div class="hero-slider relative w-full h-screen overflow-hidden -mt-[120px] z-0">
	{#each images as image, index}
		<div 
			class="hero-slide absolute inset-0 {index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
		>
			<img 
				src={image} 
				alt="Fresh Ground Eltham" 
				class="w-full h-full object-cover"
				onerror={handleImageError}
			/>
			<div class="absolute inset-0 bg-gradient-to-r from-[#39918c] to-[#2f435a] z-20 opacity-30"></div>
		</div>
	{/each}
	
	<!-- Content overlay -->
	<div class="absolute inset-0 z-30 flex items-center justify-center">
		<div class="text-center text-white px-4 max-w-4xl mx-auto">
			<h1 class="text-5xl md:text-6xl font-bold mb-4">Fresh Ground Coffee House</h1>
			<p class="text-xl md:text-2xl text-gray-100 mb-2">A community café run by Eltham Green Community Church</p>
			<p class="text-lg md:text-xl text-gray-200">Quality coffee, delicious food, and a warm welcome for everyone</p>
		</div>
	</div>
	
	<!-- Navigation dots -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
		{#each images as _, index}
			<button 
				class="w-3 h-3 rounded-full transition-all duration-300 {index === currentIndex ? 'bg-white w-8' : 'bg-white/50'}"
				onclick={() => currentIndex = index}
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</div>

<style>
	.hero-slider {
		min-height: 100vh;
		height: 100vh;
	}
	
	.hero-slide {
		transition: opacity 2s ease-in-out;
	}
	
	@media (max-width: 768px) {
		.hero-slider {
			height: 80vh;
			min-height: 80vh;
		}
	}
</style>


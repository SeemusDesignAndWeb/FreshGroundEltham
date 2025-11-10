<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { addToCart } from '$lib/stores/cart';
	import type { SpecialOffer } from '$lib/stores/cart';
	
	let currentIndex = $state(0);
	let images = $state<string[]>([]);
	let specialOffers = $state<SpecialOffer[]>([]);
	
	let interval: ReturnType<typeof setInterval>;
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}
	
	function nextImage() {
		if (images.length > 0) {
			currentIndex = (currentIndex + 1) % images.length;
		}
	}
	
	function handleBuyOffer(offer: SpecialOffer) {
		addToCart(offer);
		goto('/cart');
	}
	
	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}
	
	onMount(async () => {
		// Load hero slider images from API
		try {
			const response = await fetch('/api/hero-slider');
			if (response.ok) {
				const data = await response.json();
				images = data.images || [];
			}
		} catch (error) {
			console.error('Error loading hero slider images:', error);
			images = [];
		}
		
		// Load special offers
		try {
			const response = await fetch('/api/special-offers');
			if (response.ok) {
				const data = await response.json();
				specialOffers = data.offers || [];
			}
		} catch (error) {
			console.error('Error loading special offers:', error);
		}
		
		// Only start interval if we have images
		if (images.length > 0) {
			// Change image every 5 seconds
			interval = setInterval(nextImage, 5000);
		}
		
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
		<div class="text-center text-white px-4 max-w-4xl mx-auto w-full">
			<div class="mb-6 flex justify-center">
				<img
					src="/images/freshgroundlogowhite.svg"
					alt="Fresh Ground Eltham Logo"
					class="h-20 md:h-24 w-auto"
					onerror={handleImageError}
				/>
			</div>
	
			<h1 class="text-5xl md:text-6xl font-bold mb-4">A community café serving the best coffee in Eltham</h1>
			<p class="text-lg md:text-xl text-gray-200 mb-8">Run by <a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200">Eltham Green Community Church</a></p>
			
			<!-- Special Offers Banner -->
			{#if specialOffers.length > 0}
				<div class="mt-8 space-y-4">
					{#each specialOffers as offer (offer.id)}
						<div class="bg-black/25 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-black/20 max-w-xl mx-auto special-offer-banner relative">
							<div class="absolute top-3 left-3">
								<div class="text-xs md:text-sm text-white/80 drop-shadow-md -mb-1">Only</div>
								<span class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{formatPrice(offer.price)}</span>
							</div>
							<a 
								href="javascript:void(0)"
								onclick={() => handleBuyOffer(offer)}
								class="absolute top-3 right-3 bg-[#ff8c42]/30 backdrop-blur-sm text-[#ff8c42] px-4 py-1.5 rounded-full hover:bg-[#ff8c42]/40 transition-all duration-300 text-sm font-medium border border-[#ff8c42]/50 hover:border-[#ff8c42]/70 shadow-md hover:shadow-lg whitespace-nowrap inline-block font-bold z-10"
							>
								Buy Now
							</a>
							<div class="text-center space-y-2 leading-tight">
								<div class="space-y-1">
									<span class="inline-block text-sm md:text-base font-bold text-[#ff8c42] uppercase tracking-wider px-3 py-1 bg-[#ff8c42]/30 rounded-full drop-shadow-lg animate-pulse-bright">Special Offer</span>
									<h3 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight">{offer.name}</h3>
									<p class="text-sm md:text-base text-white/90 drop-shadow-md leading-tight">
										{offer.description}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
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
	
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes pulseGlow {
		0%, 100% {
			box-shadow: 0 0 20px rgba(255, 140, 66, 0.3);
		}
		50% {
			box-shadow: 0 0 30px rgba(255, 140, 66, 0.6);
		}
	}
	
	@keyframes pulseBright {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
	}
	
	.special-offer-banner {
		animation: fadeInUp 0.8s ease-out, pulseGlow 3s ease-in-out 1s infinite;
	}
	
	.animate-pulse-bright {
		animation: pulseBright 2s ease-in-out infinite;
	}
</style>


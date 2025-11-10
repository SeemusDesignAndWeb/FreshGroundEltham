<script lang="ts">
	import { onMount } from 'svelte';
	import HeroSlider from './HeroSlider.svelte';
	import TestimonialCarousel from './TestimonialCarousel.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	
	let galleryImages = $state<Array<{src: string; alt: string; category: string}>>([]);
	
	onMount(async () => {
		// Load gallery images from API
		try {
			const response = await fetch('/api/gallery');
			if (response.ok) {
				const data = await response.json();
				galleryImages = (data.images || []).slice(0, 4); // Show first 4 images on home page
			}
		} catch (error) {
			console.error('Error loading gallery images:', error);
		}
	});
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}
	
	function handleGalleryImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img && img.parentElement) {
			img.style.display = 'none';
			const fallback = img.nextElementSibling as HTMLElement;
			if (fallback) {
				fallback.style.display = 'flex';
			}
		}
	}
</script>

<SEOHead />

<!-- Structured Data for SEO -->
<StructuredData type="LocalBusiness" />
<StructuredData type="WebSite" />

<!-- Hero Slider Section -->
<div class="relative z-0">
	<HeroSlider />
</div>

<!-- About Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-4xl font-bold text-center text-[#39918c] mb-6">About Fresh Ground</h2>
		<div class="max-w-3xl mx-auto text-center text-gray-700 space-y-4 mb-12">
			<p class="text-xl">
				Fresh Ground is a welcoming community café offering quality food and beverages at accessible prices. We're run by <a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="text-[#39918c] hover:underline font-semibold">Eltham Green Community Church</a> and strive to create a safe and enjoyable environment for all ages.
			</p>
			<p class="text-xl">
				We're particularly welcoming to parents and caregivers with children, offering a family-friendly space where everyone feels at home.
			</p>
			<p class="text-xl">
				We're proud to work with <strong>Old Spike Roastery</strong> for our coffee, a social enterprise committed to making a positive difference, and <strong>Suki Tea</strong> for our tea selection.
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
			<div class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-200 card-hover-blur">
				<div class="mb-4 flex justify-center">
					<svg width="56" height="56" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="mx-auto">
						<path fill="#39918c" d="M203.043 26.648c-8.893.062-17.672 1.326-26.193 3.873-8.454 2.53-16.242 6.197-23.31 10.867 7.722 19.622 27.435 44.53 50.27 65.793 23.842 22.202 51.18 41.065 68.835 49.572l.207.1.203.103c16.224 8.335 27.71 21.453 34.34 35.924 4.27 9.318 6.757 19.078 8.207 29 13-10.14 26.704-18.26 40.636-24.153-1.06-18.31-5.088-37.51-12.424-56.735-15.386-40.32-42.26-72.78-72.695-92.576-21.875-14.228-45.35-21.926-68.077-21.768zm-76.408 42.305c-5.113 7.934-9.306 16.78-12.492 26.387-10.64 32.074-9.777 72.308 5.61 112.63 9.312 24.403 22.837 45.92 38.81 63.5 15.736 4.708 31.3 11.982 45.92 21.852 11.296 7.627 21.362 16.357 30.085 25.852 2.847.692 5.695 1.282 8.54 1.746 5.42-14.138 12.455-28.204 21.124-41.85 5.353-8.424 11.116-16.354 17.21-23.757.072-5.192.03-10.223-.217-15.026-.67-12.99-2.75-24.1-6.56-32.414-3.808-8.314-8.77-14.122-18.06-18.894l.41.202c-22.878-11.025-51.447-31.172-77.74-55.655-20.9-19.46-40.288-41.258-52.64-64.574zm279.752 135.725c-13.507.11-27.796 3.247-42.252 9.248-30.84 12.802-61.806 38.75-84.71 74.797-11.717 18.442-20.137 37.67-25.372 56.523 20.55 34.478 25.597 74.082 10.793 107.342 2.417 3.444 5.08 6.657 7.986 9.613 21.644-18.674 46.588-34.143 64.316-50.028 9.69-8.68 17.027-17.275 21.104-25.46 4.077-8.187 5.48-15.697 3.36-25.923l-.124-.595-.082-.6c-8.053-58.294 6.075-92.552 26.664-113.51 16.556-16.85 33.036-25.725 44.405-37.442-8.214-2.73-16.972-4.04-26.088-3.965zm56.746 23.953c-16.63 20.67-37.133 30.217-49.383 42.686-14.076 14.328-23.793 31.575-16.715 83.104 3.408 17.52.413 34.346-6.558 48.342-7.097 14.247-17.71 25.832-29.305 36.222-17.613 15.782-37.93 29.296-54.926 42.48 19.275 5.007 41.22 2.584 63.565-6.693 30.84-12.8 61.808-38.75 84.71-74.797 22.905-36.048 33.24-75.107 31.728-108.463-1.156-25.51-9.035-47.368-23.115-62.88zm-66.098 125.79c-.06-.315-.108-.628-.174-.943l.208 1.193c-.01-.085-.02-.165-.033-.25zm-280.223-71.424c-18.383-.166-35.7 3.865-50.275 11.807.1.003.187.01.287.013 8.63.305 19.464-.713 31.938.99 12.473 1.704 27.085 7.368 38.154 19.893 11.07 12.524 18.66 30.28 23.947 55.78l.125.594.082.602c2.453 17.792 13.786 28.085 33.434 37.722 16.764 8.223 38.287 14.095 58.717 20.073 9.15-41-12.56-91.006-58.81-122.23-24.938-16.836-52.274-25.015-77.597-25.244zm-81.078 41.447c-25.27 43.53-5.004 107.405 50.106 144.612 54.225 36.61 119.786 32.276 151.34-5.7-18.436-5.254-39.336-11.22-58.53-20.634-24.75-12.14-48.34-32.54-53.1-64.222-4.533-21.7-10.59-33.28-15.61-38.96-5.04-5.707-8.97-7.095-16.05-8.06-7.08-.968-16.81-.277-28.333-.683-8.98-.316-19.516-1.605-29.823-6.352zm89.817 54.055c.022.1.044.192.065.293l-.207-1.196c.042.304.097.6.143.904z"/>
					</svg>
				</div>
				<h3 class="text-3xl font-bold text-[#39918c] mb-3">Coffee</h3>
				<p class="text-gray-600 mb-5 text-xl">Sourced from Old Spike Roastery, a social enterprise supporting the homeless</p>
				<a href="/about" class="inline-block bg-[#39918c] text-white px-5 py-2 rounded hover:bg-[#ab6b51] transition-colors text-lg font-medium">
					Learn More →
				</a>
			</div>
			<div class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-200 card-hover-blur">
				<div class="mb-4">
					<svg class="w-14 h-14 mx-auto text-[#39918c]" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
					</svg>
				</div>
				<h3 class="text-3xl font-bold text-[#39918c] mb-3">Food</h3>
				<p class="text-gray-600 mb-5 text-xl">Fresh cakes, toasted sandwiches, baguettes, and paninis - all at accessible prices</p>
				<a href="/menu" class="inline-block bg-[#39918c] text-white px-5 py-2 rounded hover:bg-[#ab6b51] transition-colors text-lg font-medium">
					View Menu →
				</a>
			</div>
			<div class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-200 card-hover-blur">
				<div class="mb-4">
					<svg class="w-14 h-14 mx-auto text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
					</svg>
				</div>
				<h3 class="text-3xl font-bold text-[#39918c] mb-3">Community</h3>
				<p class="text-gray-600 mb-5 text-xl">A welcoming community space for everyone, bringing people together over great coffee and friendly conversation</p>
				<a href="/about" class="inline-block bg-[#39918c] text-white px-5 py-2 rounded hover:bg-[#ab6b51] transition-colors text-lg font-medium">
					Learn More →
				</a>
			</div>
		</div>
		<!-- Testimonials Carousel -->
		<TestimonialCarousel />
	</div>
</section>

<!-- Donate Section -->
<section class="py-16 px-4 bg-gradient-to-r from-[#39918c] to-[#2f435a] text-white">
	<div class="max-w-7xl mx-auto text-center">
		<h2 class="text-4xl font-bold mb-4">Support Fresh Ground</h2>
		<p class="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
			As a community café, we welcome donations to help us continue serving our community. Every contribution helps us maintain our welcoming space and affordable prices.
		</p>
		<a href="/donate" class="inline-block bg-white text-[#39918c] px-8 py-3 rounded hover:bg-gray-100 transition-colors font-medium shadow-lg">
			Donate Now →
		</a>
	</div>
</section>

<!-- Gallery Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-4xl font-bold text-center text-[#39918c] mb-8">Fresh Ground Gallery</h2>
		{#if galleryImages.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
				{#each galleryImages as image, index}
					<div class="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
						<img 
							src={image.src} 
							alt={image.alt}
							class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
							onerror={handleGalleryImageError}
						/>
						<div class="hidden absolute inset-0 items-center justify-center bg-gray-300">
							<span class="text-gray-500">Photo {index + 1}</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Fallback while loading or if no images -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
				{#each Array(4) as _, index}
					<div class="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
						<div class="absolute inset-0 items-center justify-center bg-gray-300 flex">
							<span class="text-gray-500">Loading...</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class="text-center mt-8">
			<a href="/gallery" class="text-[#39918c] hover:underline font-medium">
				More Photos →
			</a>
		</div>
	</div>
</section>

<!-- Community Banner -->
<section class="py-12 px-4 bg-gradient-to-r from-[#39918c] to-[#2f435a] text-white text-center">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-4xl font-bold italic">a welcoming community space</h2>
	</div>
</section>

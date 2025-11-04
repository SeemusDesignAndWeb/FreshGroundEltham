<script lang="ts">
	import { onMount } from 'svelte';

	let selectedImage = $state<string | null>(null);
	let images = $state([
		{
			src: '/images/coffee-cup-hero.jpg',
			alt: 'Fresh coffee cup',
			category: 'coffee'
		},
		{
			src: '/images/coffee-latte-art.jpg',
			alt: 'Beautiful latte art',
			category: 'coffee'
		},
		{
			src: '/images/coffee-making.jpg',
			alt: 'Coffee being prepared',
			category: 'coffee'
		},
		{
			src: '/images/pastries.jpg',
			alt: 'Delicious pastries',
			category: 'food'
		},
		{
			src: '/images/coffee-beans-background.jpg',
			alt: 'Coffee beans',
			category: 'coffee'
		},
		{
			src: '/images/coffeebeans.png',
			alt: 'Coffee beans close up',
			category: 'coffee'
		}
	]);

	let filteredImages = $state(images);
	let selectedCategory = $state<string>('all');

	const categories = [
		{ id: 'all', label: 'All' },
		{ id: 'coffee', label: 'Coffee' },
		{ id: 'food', label: 'Food' }
	];

	function filterImages(category: string) {
		selectedCategory = category;
		if (category === 'all') {
			filteredImages = images;
		} else {
			filteredImages = images.filter(img => img.category === category);
		}
	}

	function openModal(imageSrc: string) {
		selectedImage = imageSrc;
		document.body.style.overflow = 'hidden';
	}

	function closeModal() {
		selectedImage = null;
		document.body.style.overflow = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectedImage) {
			closeModal();
		}
	}

	function navigateImage(direction: 'prev' | 'next') {
		if (!selectedImage) return;
		
		const currentIndex = filteredImages.findIndex(img => img.src === selectedImage);
		if (currentIndex === -1) return;

		let newIndex: number;
		if (direction === 'next') {
			newIndex = (currentIndex + 1) % filteredImages.length;
		} else {
			newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
		}

		selectedImage = filteredImages[newIndex].src;
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>Gallery - Fresh Ground Eltham</title>
	<meta name="description" content="Photo gallery showcasing Fresh Ground Eltham - our coffee, food, and welcoming atmosphere" />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
			<p class="text-xl text-gray-100">Take a look around Fresh Ground Eltham</p>
		</div>
	</section>
</div>

<!-- Gallery Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<!-- Category Filter -->
		<div class="flex justify-center gap-4 mb-12 flex-wrap">
			{#each categories as category}
				<button
					onclick={() => filterImages(category.id)}
					class="px-6 py-2 rounded-lg font-medium transition-all duration-200 {selectedCategory === category.id 
						? 'bg-[#39918c] text-white shadow-lg' 
						: 'bg-[#d0b49f] text-[#39918c] hover:bg-[#39918c] hover:text-white'}"
				>
					{category.label}
				</button>
			{/each}
		</div>

		<!-- Image Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredImages as image}
				<div 
					class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-[#d0b49f] aspect-square"
					onclick={() => openModal(image.src)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && openModal(image.src)}
				>
					<img
						src={image.src}
						alt={image.alt}
						class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
						<p class="text-white p-4 font-medium">{image.alt}</p>
					</div>
					<div class="absolute inset-0 bg-[#39918c]/0 group-hover:bg-[#39918c]/10 transition-colors duration-300"></div>
				</div>
			{/each}
		</div>

		{#if filteredImages.length === 0}
			<div class="text-center py-16">
				<p class="text-gray-600 text-lg">No images found in this category.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Modal/Lightbox -->
{#if selectedImage}
	<div 
		class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
		onclick={closeModal}
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
	>
		<!-- Close Button -->
		<button
			onclick={closeModal}
			class="absolute top-4 right-4 text-white hover:text-[#39918c] transition-colors z-10"
			aria-label="Close image viewer"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>

		<!-- Navigation Buttons -->
		{#if filteredImages.length > 1}
			<button
				onclick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
				class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#39918c] transition-colors z-10 bg-black/50 rounded-full p-3"
				aria-label="Previous image"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
			</button>
			<button
				onclick={(e) => { e.stopPropagation(); navigateImage('next'); }}
				class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#39918c] transition-colors z-10 bg-black/50 rounded-full p-3"
				aria-label="Next image"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
				</svg>
			</button>
		{/if}

		<!-- Image -->
		<div 
			class="max-w-7xl max-h-[90vh] w-full"
			onclick={(e) => e.stopPropagation()}
		>
			<img
				src={selectedImage}
				alt={filteredImages.find(img => img.src === selectedImage)?.alt || 'Gallery image'}
				class="max-w-full max-h-[90vh] mx-auto object-contain rounded-lg shadow-2xl"
			/>
		</div>
	</div>
{/if}

<style>
	/* Smooth animations */
	img {
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}
</style>

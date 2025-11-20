<script lang="js">
	import { onMount } from 'svelte';
	import { addToCart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	// Activity type not needed in JavaScript
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data } = $props();
	let activities = $state(data?.activities || []);
	let settings = $state(data?.settings || { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' });
	let backgroundImage = $state(data?.backgroundImage || null);

	onMount(async () => {
		
		// Reload activities in case they've been updated
		try {
			const response = await fetch('/api/activities');
			if (response.ok) {
				const result = await response.json();
				activities = result.activities || [];
				settings = result.settings || { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' };
			}
		} catch (error) {
			console.error('Error loading activities:', error);
		}
	});

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}

    function handleBookActivity(activity) {
		addToCart(activity);
		goto('/cart');
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Kids Activities</h1>
			<p class="text-xl text-gray-100">Book activities for children during half term and school holidays</p>
		</div>
	</section>
</div>

<!-- Activities Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		{#if settings.hidden}
			<!-- Show custom message when activities are hidden -->
			<div class="text-center py-16">
				<div class="max-w-3xl mx-auto bg-white rounded-lg p-12 shadow-lg border-2 border-[#39918c]">
					<div class="mb-6">
						<svg class="w-20 h-20 mx-auto text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
						</svg>
					</div>
					<div class="prose prose-lg mx-auto text-gray-700 whitespace-pre-line text-lg leading-relaxed">
						{settings.message}
					</div>
				</div>
			</div>
		{:else}
			<!-- Show activities list -->
			<h2 class="text-4xl font-bold text-center text-[#39918c] mb-12">Upcoming Activities</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each activities as activity (activity.id)}
					<div class="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
						<div class="relative h-40 overflow-hidden">
							<img 
								src={activity.image} 
								alt={activity.title}
								class="w-full h-full object-cover"
								onerror={handleImageError}
							/>
						</div>
						
						<div class="p-4">
							<div class="flex justify-between items-start mb-2">
								<h3 class="text-2xl font-bold text-[#39918c] flex-1">{activity.title}</h3>
								<span class="text-xl font-bold text-[#39918c] ml-2">{formatPrice(activity.price)}</span>
							</div>
							
							<p class="text-base text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
							
							<div class="space-y-1 mb-4 text-base text-gray-600">
								<div class="flex items-center gap-1.5">
									<svg class="w-4 h-4 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
									</svg>
									<span>{new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
								</div>
								<div class="flex items-center gap-1.5">
									<svg class="w-4 h-4 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<span>{activity.time}</span>
								</div>
							</div>
							
							<button 
								onclick={() => handleBookActivity(activity)}
								class="w-full bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors text-base font-medium"
							>
								Book Now
							</button>
						</div>
					</div>
				{/each}
			</div>

			{#if activities.length === 0}
				<div class="text-center py-12">
					<p class="text-xl text-gray-600 mb-4">No activities scheduled at the moment.</p>
					<p class="text-gray-500">Check back soon for upcoming kids activities!</p>
				</div>
			{/if}
		{/if}
	</div>
</section>


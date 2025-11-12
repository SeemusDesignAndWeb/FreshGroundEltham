<script lang="ts">
	import { onMount } from 'svelte';
	import type { Event } from '$lib/stores/cart';
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data } = $props<PageData>();
	let events = $state<Event[]>(data?.events || []);
	let backgroundImage = $state<string | null>(data?.backgroundImage || null);

	onMount(async () => {
		// Reload events in case they've been updated
		try {
			const response = await fetch('/api/events');
			if (response.ok) {
				const result = await response.json();
				events = result.events || [];
			}
		} catch (error) {
			console.error('Error loading events:', error);
		}
	});

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}

	function formatTime(time24: string): string {
		if (!time24) return '';
		const [hours, minutes] = time24.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'pm' : 'am';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Events</h1>
			<p class="text-xl text-gray-100">Upcoming events at Fresh Ground Eltham</p>
		</div>
	</section>
</div>

<!-- Events Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-4xl font-bold text-center text-[#39918c] mb-12">Upcoming Events</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each events as event (event.id)}
				<div class="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
					<div class="relative h-48 overflow-hidden">
						<img 
							src={event.image} 
							alt={event.title}
							class="w-full h-full object-cover"
							onerror={handleImageError}
						/>
					</div>
					
					<div class="p-6">
						<h3 class="text-2xl font-bold text-[#39918c] mb-3">{event.title}</h3>
						
						<p class="text-base text-gray-600 mb-4 line-clamp-3">{event.description}</p>
						
						<div class="space-y-2 text-base text-gray-600">
							<div class="flex items-center gap-2">
								<svg class="w-5 h-5 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
								</svg>
								<span>
									{#if event.recurring && event.recurring.length > 0}
										Every {event.recurring.join(', ')}
									{:else}
										{formatDate(event.date)}
									{/if}
								</span>
							</div>
							<div class="flex items-center gap-2">
								<svg class="w-5 h-5 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<span>{formatTime(event.time)}{event.endTime ? ` - ${formatTime(event.endTime)}` : ''}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if events.length === 0}
			<div class="text-center py-12">
				<p class="text-xl text-gray-600 mb-4">No events scheduled at the moment.</p>
				<p class="text-gray-500">Check back soon for upcoming events!</p>
			</div>
		{/if}
	</div>
</section>


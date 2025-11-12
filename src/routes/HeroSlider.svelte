<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { addToCart } from '$lib/stores/cart';
	import type { SpecialOffer, Event as EventType } from '$lib/stores/cart';
	
	let currentIndex = $state(0);
	let images = $state<string[]>([]);
	let specialOffers = $state<SpecialOffer[]>([]);
	let events = $state<EventType[]>([]);
	let nextEvent = $state<EventType | null>(null);
	
	let interval: ReturnType<typeof setInterval>;
	
	function handleImageError(e: Event) {
		const img = e.target as HTMLImageElement;
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

	function formatTime(time24: string): string {
		if (!time24) return '';
		const [hours, minutes] = time24.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'pm' : 'am';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	}

	function formatEventDate(event: EventType): string {
		if (event.recurring && event.recurring.length > 0) {
			return `Every ${event.recurring.join(', ')}`;
		} else {
			const date = new Date(event.date);
			return date.toLocaleDateString('en-GB', { 
				weekday: 'long', 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			});
		}
	}

	function getNextEvent(events: EventType[], maxDays: number = Infinity): EventType | null {
		if (events.length === 0) return null;

		const now = new Date();
		const today = now.toLocaleDateString('en-GB', { weekday: 'long' });
		const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
		const maxDate = new Date(now);
		maxDate.setDate(maxDate.getDate() + maxDays);
		maxDate.setHours(23, 59, 59, 999);

		// Sort events to find the next one
		const sortedEvents = [...events].sort((a, b) => {
			// Prioritize recurring events that match today
			if (a.recurring && a.recurring.length > 0 && a.recurring.includes(today)) {
				if (b.recurring && b.recurring.length > 0 && b.recurring.includes(today)) {
					// Both are recurring today, compare times
					const aTime = a.time ? parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]) : 0;
					const bTime = b.time ? parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]) : 0;
					return aTime - bTime;
				}
				return -1; // a is recurring today, prioritize it
			}
			if (b.recurring && b.recurring.length > 0 && b.recurring.includes(today)) {
				return 1; // b is recurring today, prioritize it
			}

			// For single date events, compare dates
			if (!a.recurring && !b.recurring) {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			}

			// Recurring events come after single date events if not today
			if (a.recurring && a.recurring.length > 0) return 1;
			if (b.recurring && b.recurring.length > 0) return -1;

			return 0;
		});

		let nextEvent: EventType | null = null;

		// Find the first valid upcoming event within the date range
		for (const event of sortedEvents) {
			if (event.recurring && event.recurring.length > 0) {
				// Check if recurring event matches today and time hasn't passed
				if (event.recurring.includes(today)) {
					if (event.time) {
						const [hours, minutes] = event.time.split(':');
						const eventTime = parseInt(hours) * 60 + parseInt(minutes);
						if (eventTime >= currentTime) {
							nextEvent = event;
							break;
						}
					} else {
						nextEvent = event; // No time specified, show it
						break;
					}
				}
				// Check if any recurring day is in the future within maxDays
				const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
				const todayIndex = dayNames.indexOf(today);
				for (let i = 0; i < maxDays; i++) {
					const futureDayIndex = (todayIndex + i) % 7;
					const futureDay = dayNames[futureDayIndex];
					if (event.recurring.includes(futureDay) && (i > 0 || !event.time || (event.time && (() => {
						const [hours, minutes] = event.time.split(':');
						const eventTime = parseInt(hours) * 60 + parseInt(minutes);
						return eventTime >= currentTime;
					})()))) {
						nextEvent = event;
						break;
					}
				}
				if (nextEvent) break;
			} else {
				// Single date event
				const eventDate = new Date(event.date);
				const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				eventDate.setHours(0, 0, 0, 0);

				// Check if event is within maxDays
				if (eventDate.getTime() <= maxDate.getTime() && eventDate.getTime() >= todayDate.getTime()) {
					// If it's today, check if time hasn't passed
					if (eventDate.getTime() === todayDate.getTime() && event.time) {
						const [hours, minutes] = event.time.split(':');
						const eventTime = parseInt(hours) * 60 + parseInt(minutes);
						if (eventTime >= currentTime) {
							nextEvent = event;
							break;
						}
					} else if (eventDate.getTime() > todayDate.getTime()) {
						// Future date within range
						nextEvent = event;
						break;
					}
				}
			}
		}

		// If the next event is recurring, check for non-recurring events within 7 days
		if (nextEvent && nextEvent.recurring && nextEvent.recurring.length > 0) {
			const sevenDaysFromNow = new Date(now);
			sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
			sevenDaysFromNow.setHours(23, 59, 59, 999);
			const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			// Look for non-recurring events within 7 days
			for (const event of events) {
				if (!event.recurring || event.recurring.length === 0) {
					const eventDate = new Date(event.date);
					eventDate.setHours(0, 0, 0, 0);

					// Check if event is within 7 days
					if (eventDate.getTime() <= sevenDaysFromNow.getTime() && eventDate.getTime() >= todayDate.getTime()) {
						// If it's today, check if time hasn't passed
						if (eventDate.getTime() === todayDate.getTime() && event.time) {
							const [hours, minutes] = event.time.split(':');
							const eventTime = parseInt(hours) * 60 + parseInt(minutes);
							if (eventTime >= currentTime) {
								return event; // Prefer this non-recurring event
							}
						} else if (eventDate.getTime() > todayDate.getTime()) {
							return event; // Prefer this non-recurring event
						}
					}
				}
			}
		}

		return nextEvent;
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
				
				// Load events if no enabled special offers (offers with enabled=false won't be in the response)
				// Also check if we need to show events within 10 days when offers exist but are disabled
				if (specialOffers.length === 0) {
					try {
						// Check events settings first
						const settingsResponse = await fetch('/api/events/settings');
						let hideFromHomePage = false;
						if (settingsResponse.ok) {
							const settingsData = await settingsResponse.json();
							hideFromHomePage = settingsData.settings?.hideFromHomePage || false;
						}
						
						// Only load events if not hidden globally
						if (!hideFromHomePage) {
							const eventsResponse = await fetch('/api/events');
							if (eventsResponse.ok) {
								const eventsData = await eventsResponse.json();
								events = eventsData.events || [];
								// If no enabled offers, show next event within 10 days
								nextEvent = getNextEvent(events, 10);
							}
						}
					} catch (error) {
						console.error('Error loading events:', error);
					}
				}
			} else {
				// If special offers fetch fails, try loading events anyway
				try {
					// Check events settings first
					const settingsResponse = await fetch('/api/events/settings');
					let hideFromHomePage = false;
					if (settingsResponse.ok) {
						const settingsData = await settingsResponse.json();
						hideFromHomePage = settingsData.settings?.hideFromHomePage || false;
					}
					
					// Only load events if not hidden globally
					if (!hideFromHomePage) {
						const eventsResponse = await fetch('/api/events');
						if (eventsResponse.ok) {
							const eventsData = await eventsResponse.json();
							events = eventsData.events || [];
							nextEvent = getNextEvent(events, 10);
						}
					}
				} catch (error) {
					console.error('Error loading events:', error);
				}
			}
		} catch (error) {
			console.error('Error loading special offers:', error);
			// If special offers fetch fails, try loading events anyway
			try {
				// Check events settings first
				const settingsResponse = await fetch('/api/events/settings');
				let hideFromHomePage = false;
				if (settingsResponse.ok) {
					const settingsData = await settingsResponse.json();
					hideFromHomePage = settingsData.settings?.hideFromHomePage || false;
				}
				
				// Only load events if not hidden globally
				if (!hideFromHomePage) {
					const eventsResponse = await fetch('/api/events');
					if (eventsResponse.ok) {
						const eventsData = await eventsResponse.json();
						events = eventsData.events || [];
						nextEvent = getNextEvent(events, 10);
					}
				}
			} catch (eventsError) {
				console.error('Error loading events:', eventsError);
			}
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

<div class="hero-slider relative w-full overflow-hidden -mt-[120px] z-0">
	{#if images.length > 0}
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
	{:else}
		<!-- Fallback gradient background when no images loaded -->
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c] to-[#2f435a]"></div>
	{/if}
	
	<!-- Content overlay -->
	<div class="absolute inset-0 z-30 flex items-center justify-center">
		<div class="text-center text-white px-4 max-w-4xl mx-auto w-full">
			<div class="hidden md:flex mb-3 md:mb-6 justify-center">
				<img
					src="/images/freshgroundlogowhite.svg"
					alt="Fresh Ground Eltham Logo"
					class="h-12 md:h-24 w-auto"
					onerror={handleImageError}
				/>
			</div>
	
			<h1 class="text-4xl md:text-6xl font-bold mb-2 md:mb-4 px-2">A community café serving the best coffee in Eltham</h1>
			<p class="text-base md:text-xl text-gray-200 mb-4 md:mb-8 px-2">Run by <a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200">Eltham Green Community Church</a></p>
			
			<!-- Special Offers Banner -->
			{#if specialOffers.length > 0}
				<div class="mt-4 md:mt-8 space-y-3 md:space-y-4 flex flex-col items-center">
					{#each specialOffers as offer (offer.id)}
						<div class="bg-black/25 backdrop-blur-md rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-2xl border border-black/20 max-w-xl w-full mx-auto special-offer-banner relative">
							<div class="absolute top-2 left-2 md:top-3 md:left-3">
								<div class="text-xs md:text-sm text-white/80 drop-shadow-md -mb-0.5 md:-mb-1">Only</div>
								<span class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{formatPrice(offer.price)}</span>
							</div>
							<a 
								href="javascript:void(0)"
								onclick={() => handleBuyOffer(offer)}
								class="absolute top-2 right-2 md:top-3 md:right-3 bg-[#ff8c42]/30 backdrop-blur-sm text-[#ff8c42] px-3 py-1.5 md:px-4 md:py-1.5 rounded-full hover:bg-[#ff8c42]/40 transition-all duration-300 text-sm md:text-sm font-medium border border-[#ff8c42]/50 hover:border-[#ff8c42]/70 shadow-md hover:shadow-lg whitespace-nowrap inline-block font-bold z-10"
							>
								Buy Now
							</a>
							<div class="text-center space-y-1.5 md:space-y-2 leading-tight pt-8 md:pt-0">
								<div class="space-y-0.5 md:space-y-1">
									<span class="inline-block text-sm md:text-base font-bold text-[#ff8c42] uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 bg-[#ff8c42]/30 rounded-full drop-shadow-lg animate-pulse-bright">Special Offer</span>
									<h3 class="text-2xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight px-2">{offer.name}</h3>
									<p class="text-sm md:text-base text-white/90 drop-shadow-md leading-tight px-2">
										{offer.description}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if nextEvent}
				<!-- Next Event Banner (same style as special offer) -->
				<div class="mt-4 md:mt-8 space-y-3 md:space-y-4 flex flex-col items-center">
					<a 
						href="/events"
						class="bg-black/25 backdrop-blur-md rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-2xl border border-black/20 max-w-xl w-full mx-auto special-offer-banner block hover:bg-black/35 transition-all duration-300 cursor-pointer"
					>
						<div class="text-center space-y-1.5 md:space-y-2 leading-tight">
							<h3 class="text-2xl md:text-4xl font-bold text-[#ff8c42] drop-shadow-lg leading-tight px-2">{nextEvent.title}</h3>
							<div class="text-base md:text-lg text-white drop-shadow-md">
								{formatEventDate(nextEvent)}
								{#if nextEvent.time}
									<span class="text-sm md:text-base text-white/90 drop-shadow-md">
										{formatTime(nextEvent.time)}{nextEvent.endTime ? ` - ${formatTime(nextEvent.endTime)}` : ''}
									</span>
								{/if}
							</div>
							<p class="text-sm md:text-base text-white/90 drop-shadow-md leading-tight px-2">
								{nextEvent.description}
							</p>
						</div>
					</a>
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
			/* Account for navbar height - approximately 120px on mobile */
			height: calc(100vh - 120px);
			min-height: calc(100vh - 120px);
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


<script lang="ts">
	import type { MenuItem } from '$lib/server/database';
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let menuItems = $state<MenuItem[]>(data?.menuItems || []);
	let isMenuHidden = $state(false);
	let backgroundImage = $state<string | null>(data?.backgroundImage || null);
	let selectedCategory = $state<string | null>(null);

	onMount(async () => {
		
		// Check if menu is hidden in navigation
		try {
			const navResponse = await fetch('/api/navigation');
			if (navResponse.ok) {
				const navData = await navResponse.json();
				const menuNavItem = navData.items?.find((item: any) => item.path === '/menu');
				if (menuNavItem && menuNavItem.hidden) {
					isMenuHidden = true;
					menuItems = []; // Clear any menu items
					return; // Don't load menu items if hidden
				}
			}
		} catch (error) {
			console.error('Error loading navigation:', error);
		}

		// Reload menu items to get latest data
		try {
			const response = await fetch('/api/menu');
			if (response.ok) {
				const result = await response.json();
				menuItems = result.menuItems || [];
			}
		} catch (error) {
			console.error('Error loading menu:', error);
		}
	});

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function groupByCategory(items: MenuItem[]) {
		const grouped: Record<string, MenuItem[]> = {};
		items.forEach(item => {
			if (!grouped[item.category]) {
				grouped[item.category] = [];
			}
			grouped[item.category].push(item);
		});
		return grouped;
	}

	const groupedMenu = $derived.by(() => groupByCategory(menuItems));
	
	// Get unique categories - will be sorted by the API based on category settings
	const categories = $derived.by(() => {
		const categorySet = new Set<string>();
		menuItems.forEach(item => {
			if (item.category && item.category.trim()) {
				categorySet.add(item.category.trim());
			}
		});
		// Categories are already sorted by the API based on category settings
		return Array.from(categorySet);
	});

	// Filter menu items by selected category
	const filteredMenuItems = $derived.by(() => {
		if (!selectedCategory) {
			return menuItems;
		}
		return menuItems.filter(item => item.category === selectedCategory);
	});

	const filteredGroupedMenu = $derived.by(() => groupByCategory(filteredMenuItems));
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
			<p class="text-xl text-gray-100">Quality food and beverages at accessible prices</p>
		</div>
	</section>
</div>

<!-- Menu Section -->
<section class="py-16 px-4 bg-gradient-to-b from-[#f5f1eb] via-[#faf8f5] to-[#f5f1eb]">
	<div class="max-w-6xl mx-auto">
		{#if isMenuHidden}
			<div class="text-center py-12">
				<p class="text-xl text-[#5d4e37] mb-4">We are updating our menu, come back soon</p>
			</div>
		{:else if categories.length > 0}
			<!-- Category Filter Tabs -->
			<div class="mb-12">
				<div class="flex flex-wrap justify-center gap-3 border-b-2 border-[#d0b49f] pb-3">
					<button
						onclick={() => selectedCategory = null}
						class="relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out {selectedCategory === null 
							? 'bg-[#ab6b51] text-white shadow-lg transform translate-y-[-2px]' 
							: 'bg-[#e8ddd4] text-[#5d4e37] hover:bg-[#d0b49f] hover:text-[#3d2f1f]'}"
					>
						All
						{#if selectedCategory === null}
							<span class="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#ab6b51] rotate-45"></span>
						{/if}
					</button>
					{#each categories as category, index}
						<button
							onclick={() => selectedCategory = category}
							class="relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out {selectedCategory === category 
								? 'bg-[#ab6b51] text-white shadow-lg transform translate-y-[-2px]' 
								: 'bg-[#e8ddd4] text-[#5d4e37] hover:bg-[#d0b49f] hover:text-[#3d2f1f]'}"
						>
							{category}
							{#if selectedCategory === category}
								<span class="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#ab6b51] rotate-45"></span>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Menu Items -->
			{#if selectedCategory}
				<!-- Show items for selected category only -->
				{#if filteredMenuItems.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
						{#each filteredMenuItems as item (item.id)}
							<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3.5 shadow-sm border border-[#d0b49f]/30 hover:shadow-md hover:border-[#ab6b51]/50 transition-all duration-200">
								<div class="flex justify-between items-start gap-2 mb-1">
									<h3 class="text-xl font-bold text-[#3d2f1f] flex-1 leading-tight">{item.name}</h3>
									<span class="text-base font-bold text-[#ab6b51] whitespace-nowrap">{formatPrice(item.price)}</span>
								</div>
								{#if item.description}
									<p class="text-xs text-[#5d4e37] leading-snug mt-1.5 italic line-clamp-2">{item.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12">
						<p class="text-xl text-[#5d4e37] mb-4">No items in this category</p>
					</div>
				{/if}
			{:else if Object.keys(filteredGroupedMenu).length > 0}
				<!-- Show all items grouped by category -->
				{#each Object.entries(filteredGroupedMenu) as [category, items], categoryIndex}
					<div class="mb-12 last:mb-0">
						<!-- Category Header -->
						<div class="mb-6 text-center">
							<div class="inline-block relative">
								<h2 class="text-3xl md:text-4xl font-bold text-[#3d2f1f] mb-2 tracking-wide">
									{category}
								</h2>
								<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ab6b51] to-transparent"></div>
							</div>
						</div>
						
						<!-- Menu Items Cards -->
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
							{#each items as item (item.id)}
								<div class="bg-white/80 backdrop-blur-sm rounded-lg p-3.5 shadow-sm border border-[#d0b49f]/30 hover:shadow-md hover:border-[#ab6b51]/50 transition-all duration-200">
									<div class="flex justify-between items-start gap-2 mb-1">
										<h3 class="text-base font-bold text-[#3d2f1f] flex-1 leading-tight">{item.name}</h3>
										<span class="text-base font-bold text-[#ab6b51] whitespace-nowrap">{formatPrice(item.price)}</span>
									</div>
									{#if item.description}
										<p class="text-xs text-[#5d4e37] leading-snug mt-1.5 italic line-clamp-2">{item.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-12">
					<p class="text-xl text-[#5d4e37] mb-4">No items found</p>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<p class="text-xl text-[#5d4e37] mb-4">Menu coming soon!</p>
				<p class="text-[#5d4e37]/70">Check back soon for our full menu.</p>
			</div>
		{/if}
	</div>
</section>


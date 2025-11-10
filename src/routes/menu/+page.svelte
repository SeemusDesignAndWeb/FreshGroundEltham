<script lang="ts">
	import type { MenuItem } from '$lib/server/database';
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let menuItems = $state<MenuItem[]>(data?.menuItems || []);
	let isMenuHidden = $state(false);
	let backgroundImage = $state<string | null>(data?.backgroundImage || null);

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

	const groupedMenu = $derived(groupByCategory(menuItems));
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
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		{#if isMenuHidden}
			<div class="text-center py-12">
				<p class="text-xl text-gray-600 mb-4">We are updating our menu, come back soon</p>
			</div>
		{:else if Object.keys(groupedMenu).length > 0}
			{#each Object.entries(groupedMenu) as [category, items]}
				<div class="mb-12">
					<h2 class="text-4xl font-bold text-[#39918c] mb-6 text-center">{category}</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each items as item (item.id)}
							<div class="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
								<div class="flex justify-between items-start mb-2">
									<h3 class="text-2xl font-bold text-[#39918c] flex-1">{item.name}</h3>
									<span class="text-xl font-bold text-[#39918c] ml-4">{formatPrice(item.price)}</span>
								</div>
								{#if item.description}
									<p class="text-gray-600">{item.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		{:else}
			<div class="text-center py-12">
				<p class="text-xl text-gray-600 mb-4">Menu coming soon!</p>
				<p class="text-gray-500">Check back soon for our full menu.</p>
			</div>
		{/if}
	</div>
</section>


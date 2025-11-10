<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	let showMobileMenu = $state(false);
	let openDropdown = $state<string | null>(null);

	async function handleLogout() {
		try {
			await fetch('/api/admin/logout', { method: 'POST' });
			goto('/admin/login');
		} catch (error) {
			console.error('Error logging out:', error);
			goto('/admin/login');
		}
	}

	function toggleDropdown(name: string) {
		openDropdown = openDropdown === name ? null : name;
	}

	// Close dropdown when clicking outside
	onMount(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			// If click is outside any dropdown button or menu, close all dropdowns
			if (!target.closest('.dropdown-container')) {
				openDropdown = null;
			}
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});

	// Define navigation categories
	const navCategories = [
		{
			name: 'Content',
			key: 'content',
			items: [
				{ path: '/admin/special-offers', label: 'Special Offers' },
				{ path: '/admin/activities', label: 'Activities' },
				{ path: '/admin/testimonials', label: 'Testimonials' },
				{ path: '/admin/menu', label: 'Menu' },
				{ path: '/admin/opening-times', label: 'Opening Times' }
			]
		},
		{
			name: 'Design',
			key: 'design',
			items: [
				{ path: '/admin/images', label: 'Images' },
				{ path: '/admin/page-backgrounds', label: 'Page Backgrounds' },
				{ path: '/admin/hero-slider', label: 'Hero Slider' },
				{ path: '/admin/gallery', label: 'Gallery' }
			]
		},
		{
			name: 'Settings',
			key: 'settings',
			items: [
				{ path: '/admin/banner', label: 'Banner' },
				{ path: '/admin/navigation', label: 'Navigation' }
			]
		}
	];

	// Check if current page is in a category
	function isCategoryActive(items: Array<{ path: string; label: string }>) {
		return items.some(item => $page.url.pathname === item.path);
	}
</script>

<div class="admin-layout min-h-screen bg-gray-50">
	<!-- Admin Navbar -->
	<nav class="bg-[#2f435a] text-white shadow-lg relative z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6">
			<div class="flex justify-between items-center h-16">
				<!-- Logo and Navigation -->
				<div class="flex items-center gap-6 flex-1 min-w-0">
					<a href="/admin" class="text-xl font-bold text-white hover:text-[#39918c] transition-colors whitespace-nowrap">
						Admin
					</a>
					<!-- Desktop Navigation -->
					<div class="hidden lg:flex items-center gap-3 flex-1">
						{#each navCategories as category}
							<div class="relative dropdown-container">
								<button
									type="button"
									onclick={() => toggleDropdown(category.key)}
									class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 {isCategoryActive(category.items) ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
								>
									{category.name}
									<svg 
										class="w-4 h-4 transition-transform {openDropdown === category.key ? 'rotate-180' : ''}" 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</button>

								{#if openDropdown === category.key}
									<div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
										{#each category.items as item}
											<a
												href={item.path}
												class="block px-4 py-3 text-sm text-gray-700 hover:bg-[#39918c] hover:text-white transition-colors {$page.url.pathname === item.path ? 'bg-[#39918c]/10 font-semibold' : ''}"
												onclick={() => openDropdown = null}
											>
												{item.label}
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
				
				<!-- Right Side Actions -->
				<div class="flex items-center gap-4 flex-shrink-0">
					<a href="/" class="hidden sm:block text-gray-200 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded hover:bg-[#39918c]/20">
						View Site
					</a>
					<button 
						onclick={handleLogout}
						class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors text-sm font-medium whitespace-nowrap"
					>
						Logout
					</button>
					<!-- Mobile Menu Button -->
					<button
						onclick={() => showMobileMenu = !showMobileMenu}
						class="lg:hidden text-gray-200 hover:text-white p-2"
						aria-label="Toggle menu"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if showMobileMenu}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
							{/if}
						</svg>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Mobile Menu -->
	<div class="lg:hidden bg-[#2f435a] border-t border-[#39918c]/30">
		<button
			onclick={() => showMobileMenu = !showMobileMenu}
			class="w-full px-6 py-4 flex items-center justify-between text-gray-200 hover:bg-[#39918c]/20 transition-colors"
		>
			<span class="font-medium">Menu</span>
			<svg class="w-5 h-5 transition-transform {showMobileMenu ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
			</svg>
		</button>
		{#if showMobileMenu}
			<div class="px-6 py-3 flex flex-col gap-2 border-t border-[#39918c]/20">
				{#each navCategories as category}
					<div class="mb-2">
						<p class="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">{category.name}</p>
						{#each category.items as item}
							<a 
								href={item.path}
								onclick={() => showMobileMenu = false}
								class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === item.path ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Page Content -->
	<main>
		{@render children()}
	</main>
</div>

<style>
	.admin-layout {
		min-height: 100vh;
	}
</style>


<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	import BannerIcon from '$lib/components/BannerIcon.svelte';
	
	let mobileMenuOpen = $state(false);
	
	// Close mobile menu when page changes and scroll to top
	$effect(() => {
		// Access $page to track it as a dependency
		const currentPath = $page.url.pathname;
		// Close menu and scroll to top whenever path changes
		mobileMenuOpen = false;
		// Scroll to top on page change to prevent starting halfway down
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
		}
	});
	let bookingsCount = $state(0);
	let isScrolled = $state(false);
	let bannerMessage = $state('');
	let bannerEnabled = $state(false);
	let bannerIcon = $state('');
	let bannerEndIcon = $state('');
	let navigationItems = $state<Array<{path: string; label: string; hidden: boolean}>>([]);
	
	let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
	
	// Get visible navigation items
	let visibleNavItems = $derived(navigationItems.filter(item => !item.hidden));
	
	onMount(() => {
		// Load banner message
		fetch('/api/banner')
			.then(response => {
				if (response.ok) {
					return response.json();
				}
			})
			.then(data => {
				if (data) {
					bannerMessage = data.message || '';
					bannerEnabled = data.enabled || false;
					bannerIcon = data.icon || 'none';
					bannerEndIcon = data.endIcon || data.icon || 'none';
				}
			})
			.catch(error => {
				console.error('Error loading banner:', error);
			});

		// Load navigation settings
		fetch('/api/navigation')
			.then(response => {
				if (response.ok) {
					return response.json();
				}
			})
			.then(data => {
				if (data && data.items) {
					navigationItems = data.items;
				}
			})
			.catch(error => {
				console.error('Error loading navigation:', error);
			});

		// Handle scroll
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		
		// Check initial scroll position
		isScrolled = window.scrollY > 50;
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
			// Show text if image fails
			const textElement = document.getElementById('logo-text');
			if (textElement) {
				textElement.classList.remove('hidden');
			}
		}
	}
</script>

	<header class="sticky top-0 z-[100] pointer-events-none transition-all duration-300 w-full">
		<!-- Top bar with social links and cart - bronze when banner is enabled, blue otherwise -->
		<div class="py-2 px-4 border-b w-full transition-colors duration-300 {bannerEnabled && bannerMessage ? 'bg-[#ab6b51] border-[#d0b49f]/30' : 'bg-[#2f435a] border-[#39918c]/30'}">
			<div class="max-w-7xl mx-auto flex justify-between items-center gap-4">
				<div class="flex items-center gap-4 pointer-events-auto">
					<a href="https://www.facebook.com/freshgroundeltham" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#39918c] transition-colors" aria-label="Facebook">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
					</a>
					<a href="https://www.instagram.com/freshgroundeltham/" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#39918c] transition-colors" aria-label="Instagram">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
					</a>
				</div>
				
				<!-- Banner Message -->
				{#if bannerEnabled && bannerMessage}
					<div class="flex-1 text-right pointer-events-auto">
						<p class="text-white text-md font-medium inline-flex items-center gap-1.5">
							{#if bannerIcon && bannerIcon !== 'none'}
								<BannerIcon icon={bannerIcon} size={16} />
							{/if}
							{bannerMessage}
							{#if bannerEndIcon && bannerEndIcon !== 'none'}
								<BannerIcon icon={bannerEndIcon} size={16} />
							{/if}
						</p>
					</div>
				{/if}
				
				<div class="flex items-center gap-4 ml-auto">
					{#if cartCount > 0}
						<button 
							onclick={() => goto('/cart')}
							class="relative flex items-center gap-1 text-white hover:text-[#39918c] transition-colors pointer-events-auto"
							aria-label="View cart"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
							</svg>
							<span class="absolute -top-2 -right-2 bg-[#39918c] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{cartCount}
							</span>
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Main navigation - blue on scroll, transparent when at top -->
		<nav class="w-full px-4 py-4 transition-all duration-300 pointer-events-auto" class:bg-[#2f435a]={isScrolled}>
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<a href="/" class="flex items-center">
				<img
					src="/images/freshgroundlogowhite.svg"
					alt="Fresh Ground Eltham Logo"
					class="h-12 w-auto"
					onerror={handleImageError}
				/>
				<span class="text-2xl font-bold ml-3 hidden transition-colors {isScrolled ? 'text-white' : 'text-white'}" id="logo-text">
					Fresh Ground Eltham
				</span>
			</a>

			<!-- Desktop menu -->
			<ul class="hidden md:flex items-center gap-6 list-none m-0 p-0">
				{#each visibleNavItems as item}
					<li>
						<a href={item.path} class="font-medium transition-colors {isScrolled ? 'text-white hover:text-[#39918c]' : 'text-white hover:text-[#39918c]'} {$page.url.pathname === item.path ? (isScrolled ? 'text-[#39918c]' : 'text-[#39918c]') : ''}">
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<!-- Mobile menu button -->
			<button
				class="md:hidden transition-colors {isScrolled ? 'text-white hover:text-[#39918c]' : 'text-white hover:text-[#39918c]'}"
				onclick={() => { mobileMenuOpen = !mobileMenuOpen; }}
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					{/if}
				</svg>
			</button>
		</div>

			<!-- Mobile menu -->
			{#if mobileMenuOpen}
				<ul class="md:hidden mt-4 space-y-2 list-none m-0 p-0 pb-4">
					{#each visibleNavItems as item}
						<li>
							<a 
								href={item.path} 
								onclick={() => { mobileMenuOpen = false; }}
								class="block py-2 transition-colors {isScrolled ? 'text-white hover:text-[#39918c]' : 'text-white hover:text-[#39918c]'}"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
	</nav>
</header>

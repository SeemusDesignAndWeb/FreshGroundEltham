<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let showMobileMenu = $state(false);

	async function handleLogout() {
		try {
			await fetch('/api/admin/logout', { method: 'POST' });
			goto('/admin/login');
		} catch (error) {
			console.error('Error logging out:', error);
			goto('/admin/login');
		}
	}
</script>

<div class="admin-layout min-h-screen bg-gray-50">
	<!-- Admin Navbar -->
	<nav class="bg-[#2f435a] text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6">
			<div class="flex justify-between items-center h-16">
				<!-- Logo and Navigation -->
				<div class="flex items-center gap-6 flex-1 min-w-0">
					<a href="/admin" class="text-xl font-bold text-white hover:text-[#39918c] transition-colors whitespace-nowrap">
						Admin
					</a>
					<!-- Desktop Navigation -->
					<div class="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
						<a 
							href="/admin/activities" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/activities' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Activities
						</a>
						<a 
							href="/admin/testimonials" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/testimonials' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Testimonials
						</a>
						<a 
							href="/admin/menu" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/menu' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Menu
						</a>
						<a 
							href="/admin/opening-times" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/opening-times' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Opening Times
						</a>
						<a 
							href="/admin/images" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/images' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Images
						</a>
						<a 
							href="/admin/page-backgrounds" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/page-backgrounds' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Page Backgrounds
						</a>
						<a 
							href="/admin/hero-slider" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/hero-slider' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Hero Slider
						</a>
						<a 
							href="/admin/gallery" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/gallery' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Gallery
						</a>
						<a 
							href="/admin/banner" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/banner' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Banner
						</a>
						<a 
							href="/admin/navigation" 
							class="px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap {$page.url.pathname === '/admin/navigation' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
						>
							Navigation
						</a>
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
				<div class="mb-2">
					<p class="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">Content</p>
					<a 
						href="/admin/activities" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/activities' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Activities
					</a>
					<a 
						href="/admin/testimonials" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/testimonials' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Testimonials
					</a>
					<a 
						href="/admin/menu" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/menu' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Menu
					</a>
					<a 
						href="/admin/opening-times" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/opening-times' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Opening Times
					</a>
				</div>
				<div class="mb-2">
					<p class="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">Design</p>
					<a 
						href="/admin/images" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/images' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Images
					</a>
					<a 
						href="/admin/page-backgrounds" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/page-backgrounds' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Page Backgrounds
					</a>
					<a 
						href="/admin/hero-slider" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/hero-slider' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Hero Slider
					</a>
					<a 
						href="/admin/gallery" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/gallery' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Gallery
					</a>
				</div>
				<div class="mb-2">
					<p class="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">Settings</p>
					<a 
						href="/admin/banner" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/banner' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Banner
					</a>
					<a 
						href="/admin/navigation" 
						onclick={() => showMobileMenu = false}
						class="block px-4 py-2.5 rounded-lg transition-colors {$page.url.pathname === '/admin/navigation' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/30'}"
					>
						Navigation
					</a>
				</div>
			</div>
		{/if}
	</div>

	<!-- Page Content -->
	<main>
		<slot />
	</main>
</div>

<style>
	.admin-layout {
		min-height: 100vh;
	}
</style>


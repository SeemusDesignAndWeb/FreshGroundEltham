<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

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
		<div class="max-w-7xl mx-auto px-4">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center gap-8">
					<a href="/admin" class="text-xl font-bold text-white hover:text-[#39918c] transition-colors">
						Admin Dashboard
					</a>
					<div class="hidden md:flex items-center gap-6">
						<a 
							href="/admin/activities" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/activities' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Activities
						</a>
						<a 
							href="/admin/testimonials" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/testimonials' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Testimonials
						</a>
						<a 
							href="/admin/menu" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/menu' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Menu
						</a>
						<a 
							href="/admin/opening-times" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/opening-times' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Opening Times
						</a>
						<a 
							href="/admin/banner" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/banner' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Banner
						</a>
						<a 
							href="/admin/images" 
							class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/images' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
						>
							Images
						</a>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<a href="/" class="text-gray-200 hover:text-white transition-colors text-sm">
						View Site
					</a>
					<button 
						onclick={handleLogout}
						class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors text-sm font-medium"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Mobile Menu -->
	<div class="md:hidden bg-[#2f435a] border-t border-[#39918c]/30">
		<div class="px-4 py-3 flex flex-col gap-2">
			<a 
				href="/admin/activities" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/activities' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Activities
			</a>
			<a 
				href="/admin/testimonials" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/testimonials' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Testimonials
			</a>
			<a 
				href="/admin/menu" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/menu' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Menu
			</a>
			<a 
				href="/admin/opening-times" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/opening-times' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Opening Times
			</a>
			<a 
				href="/admin/banner" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/banner' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Banner
			</a>
			<a 
				href="/admin/images" 
				class="px-3 py-2 rounded transition-colors {$page.url.pathname === '/admin/images' ? 'bg-[#39918c] text-white' : 'text-gray-200 hover:bg-[#39918c]/50'}"
			>
				Images
			</a>
		</div>
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


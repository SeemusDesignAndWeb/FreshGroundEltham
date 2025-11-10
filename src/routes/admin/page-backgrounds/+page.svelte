<script lang="ts">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	import type { SiteImage } from '$lib/server/database';

	// List of pages that can have background images
	const pages = [
		{ path: '/about', label: 'About Us' },
		{ path: '/menu', label: 'Menu' },
		{ path: '/activities', label: 'Kids Activities' },
		{ path: '/opening-times', label: 'Opening Times' },
		{ path: '/donate', label: 'Donate' },
		{ path: '/contact', label: 'Contact Us' },
		{ path: '/gallery', label: 'Gallery' },
		{ path: '/privacy', label: 'Privacy' },
		{ path: '/cookies', label: 'Cookies' }
	];

	let backgrounds = $state<Record<string, string>>({});
	let images = $state<SiteImage[]>([]);
	let isSaving = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		await Promise.all([loadBackgrounds(), loadImages()]);
		isLoading = false;
	});

	async function loadBackgrounds() {
		try {
			const response = await fetch('/api/admin/page-backgrounds');
			if (response.ok) {
				const data = await response.json();
				backgrounds = data.backgrounds || {};
			} else {
				throw new Error('Failed to load backgrounds');
			}
		} catch (error) {
			console.error('Error loading backgrounds:', error);
			notify.error('Failed to load page backgrounds');
		}
	}

	async function loadImages() {
		try {
			const response = await fetch('/api/admin/images');
			if (response.ok) {
				const data = await response.json();
				images = data.images || [];
			}
		} catch (error) {
			console.error('Error loading images:', error);
		}
	}

	async function handleSave() {
		isSaving = true;
		try {
			const response = await fetch('/api/admin/page-backgrounds', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(backgrounds)
			});

			if (!response.ok) {
				throw new Error('Failed to save page backgrounds');
			}

			notify.success('Page backgrounds saved successfully!');
		} catch (error) {
			console.error('Error saving backgrounds:', error);
			notify.error('Failed to save page backgrounds. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function updatePageBackground(path: string, imagePath: string) {
		backgrounds[path] = imagePath;
	}
</script>

<svelte:head>
	<title>Page Background Images - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage page background images" />
</svelte:head>

<!-- Page Backgrounds Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Page Background Images</h1>
		
		{#if isLoading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading...</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each pages as page}
						<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
							<h2 class="text-xl font-bold text-[#39918c] mb-4">{page.label}</h2>
							
							<div class="space-y-4">
								<!-- Image Selector -->
								<div>
									<label for="bg-{page.path}" class="block text-gray-700 font-medium mb-2">
										Background Image
									</label>
									<select 
										id="bg-{page.path}"
										value={backgrounds[page.path] || ''}
										onchange={(e) => updatePageBackground(page.path, e.target.value)}
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
									>
										<option value="">Select an image...</option>
										{#each images as img}
											<option value={img.path}>{img.name} ({img.path})</option>
										{/each}
									</select>
									<p class="text-sm text-gray-600 mt-1">
										Select from <a href="/admin/images" class="text-[#39918c] hover:underline" target="_blank">site images</a>, or enter a custom URL below
									</p>
									<div class="mt-2">
										<label for="url-{page.path}" class="block text-gray-700 font-medium mb-2 text-sm">Or enter a custom URL:</label>
										<input 
											id="url-{page.path}"
											type="text" 
											value={backgrounds[page.path] || ''}
											oninput={(e) => updatePageBackground(page.path, e.target.value)}
											placeholder="https://images.unsplash.com/photo-..."
											class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
										/>
									</div>
								</div>
								
								<!-- Preview -->
								<div>
									<label class="block text-gray-700 font-medium mb-2">Preview</label>
									{#if backgrounds[page.path]}
										<div class="relative h-32 rounded-lg overflow-hidden border-2 border-gray-300">
											<div 
												class="absolute inset-0 bg-cover bg-center"
												style="background-image: url('{backgrounds[page.path]}');"
											></div>
											<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20"></div>
										</div>
									{:else}
										<div class="relative h-32 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
											<p class="text-gray-400 text-sm">No image selected</p>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
					</div>

					<!-- Save Button -->
					<div class="flex gap-4 pt-6 mt-6 border-t border-gray-200">
						<button
							type="submit"
							disabled={isSaving}
							class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save Page Backgrounds'}
						</button>
					</div>
				</form>
			</div>

			<!-- Info Box -->
			<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
				<h3 class="text-xl font-bold text-[#39918c] mb-3">About Page Background Images</h3>
				<ul class="space-y-2 text-gray-600">
					<li>• Background images appear in the hero section of each page</li>
					<li>• Select from your site image library or enter a custom URL</li>
					<li>• Images should be high quality and at least 1920px wide for best results</li>
					<li>• Changes take effect immediately after saving</li>
				</ul>
			</div>
		{/if}
	</div>
</section>


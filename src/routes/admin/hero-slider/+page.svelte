<script lang="ts">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	import type { SiteImage } from '$lib/server/database';
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let heroImages = $state<string[]>([]);
	let images = $state<SiteImage[]>([]);
	let isSaving = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		await Promise.all([loadHeroSlider(), loadImages()]);
		isLoading = false;
	});

	async function loadHeroSlider() {
		try {
			const response = await fetch('/api/admin/hero-slider');
			if (response.ok) {
				const data = await response.json();
				heroImages = data.images || [];
			} else {
				throw new Error('Failed to load hero slider settings');
			}
		} catch (error) {
			console.error('Error loading hero slider:', error);
			notify.error('Failed to load hero slider settings');
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
			const response = await fetch('/api/admin/hero-slider', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					images: heroImages.filter(img => img.trim() !== '')
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save hero slider settings');
			}

			notify.success('Hero slider images saved successfully!');
		} catch (error) {
			console.error('Error saving hero slider:', error);
			notify.error('Failed to save hero slider settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function addImage() {
		heroImages = [...heroImages, ''];
	}

	function removeImage(index: number) {
		heroImages = heroImages.filter((_, i) => i !== index);
	}

	function updateImage(index: number, value: string) {
		heroImages[index] = value;
		heroImages = [...heroImages]; // Trigger reactivity
	}
</script>

<svelte:head>
	<title>Hero Slider Images - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage hero slider images" />
</svelte:head>

<!-- Hero Slider Settings Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Hero Slider Images</h1>
		
		{#if isLoading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading...</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
					<div>
						<div class="flex justify-between items-center mb-4">
							<h2 class="text-2xl font-bold text-[#39918c]">Slider Images</h2>
							<button
								type="button"
								onclick={addImage}
								class="bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#2f435a] transition-colors font-medium"
							>
								+ Add Image
							</button>
						</div>
						<p class="text-gray-600 mb-6">Select images from your library or enter custom URLs. Images will rotate every 5 seconds.</p>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each heroImages as image, index}
								<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
									<div class="flex gap-4 items-start">
										<!-- Image Selector -->
										<div class="flex-1">
											<ImageSelector
												images={images}
												value={image}
												onchange={(newValue) => updateImage(index, newValue)}
												label="Image {index + 1}"
												placeholder="Select an image from library..."
												allowCustomUrl={true}
												showPreview={true}
											/>
										</div>
										<!-- Remove Button -->
										<button
											type="button"
											onclick={() => removeImage(index)}
											class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium mt-8"
										>
											Remove
										</button>
									</div>
								</div>
							{/each}
						</div>
						
						{#if heroImages.length === 0}
							<div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<p class="text-gray-600 mb-4">No images added yet.</p>
								<button
									type="button"
									onclick={addImage}
									class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#2f435a] transition-colors font-medium"
								>
									Add First Image
								</button>
							</div>
						{/if}
					</div>

					<!-- Save Button -->
					<div class="flex gap-4 pt-6 border-t border-gray-200">
						<button
							type="submit"
							disabled={isSaving || heroImages.filter(img => img.trim() !== '').length === 0}
							class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save Hero Slider Images'}
						</button>
					</div>
				</form>
			</div>

			<!-- Info Box -->
			<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
				<h3 class="text-xl font-bold text-[#39918c] mb-3">About Hero Slider Images</h3>
				<ul class="space-y-2 text-gray-600">
					<li>• Images will automatically rotate every 5 seconds</li>
					<li>• Select from your site image library or enter custom URLs</li>
					<li>• You can add multiple images to create a slideshow</li>
					<li>• Images should be high quality and at least 1920px wide</li>
					<li>• Changes take effect immediately after saving</li>
				</ul>
			</div>
		{/if}
	</div>
</section>


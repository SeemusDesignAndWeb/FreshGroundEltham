<script lang="ts">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	import type { SiteImage } from '$lib/server/database';
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let tvScreenImages = $state<string[]>([]);
	let images = $state<SiteImage[]>([]);
	let transitionDuration = $state(5000);
	let isSaving = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		await Promise.all([loadTvScreen(), loadImages()]);
		isLoading = false;
	});

	async function loadTvScreen() {
		try {
			const response = await fetch('/api/admin/tv-screen');
			if (response.ok) {
				const data = await response.json();
				tvScreenImages = data.images || [];
				transitionDuration = data.transitionDuration || 5000;
			} else {
				throw new Error('Failed to load TV screen settings');
			}
		} catch (error) {
			console.error('Error loading TV screen:', error);
			notify.error('Failed to load TV screen settings');
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
			const response = await fetch('/api/admin/tv-screen', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					images: tvScreenImages.filter(img => img.trim() !== ''),
					transitionDuration: transitionDuration
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save TV screen settings');
			}

			notify.success('TV screen images saved successfully!');
		} catch (error) {
			console.error('Error saving TV screen:', error);
			notify.error('Failed to save TV screen settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function addImage() {
		tvScreenImages = [...tvScreenImages, ''];
	}

	function removeImage(index: number) {
		tvScreenImages = tvScreenImages.filter((_, i) => i !== index);
	}

	function updateImage(index: number, value: string) {
		tvScreenImages[index] = value;
		tvScreenImages = [...tvScreenImages]; // Trigger reactivity
	}
</script>

<svelte:head>
	<title>TV Screen Images - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage TV screen images" />
</svelte:head>

<!-- TV Screen Settings Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">TV Screen Images</h1>
		
		{#if isLoading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading...</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
					<!-- Transition Duration Setting -->
					<div class="mb-6 pb-6 border-b border-gray-200">
						<label class="block text-gray-700 font-medium mb-2">
							Transition Duration (milliseconds)
						</label>
						<input 
							type="number" 
							value={transitionDuration}
							oninput={(e) => transitionDuration = parseInt(e.target.value) || 5000}
							min="1000"
							max="30000"
							step="500"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
						/>
						<p class="text-sm text-gray-500 mt-2">Time each image is displayed before transitioning to the next (1000-30000ms)</p>
					</div>

					<div>
						<div class="flex justify-between items-center mb-4">
							<h2 class="text-2xl font-bold text-[#39918c]">TV Screen Images</h2>
							<button
								type="button"
								onclick={addImage}
								class="bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#2f435a] transition-colors font-medium"
							>
								+ Add Image
							</button>
						</div>
						<p class="text-gray-600 mb-6">Select images from your library or enter custom URLs. Images will display full-screen and transition continuously.</p>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each tvScreenImages as image, index}
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
						
						{#if tvScreenImages.length === 0}
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
							disabled={isSaving || tvScreenImages.filter(img => img.trim() !== '').length === 0}
							class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save TV Screen Images'}
						</button>
						<a
							href="/tv-screen"
							target="_blank"
							class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg shadow-md"
						>
							Preview TV Screen
						</a>
					</div>
				</form>
			</div>

			<!-- Info Box -->
			<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
				<h3 class="text-xl font-bold text-[#39918c] mb-3">About TV Screen Images</h3>
				<ul class="space-y-2 text-gray-600">
					<li>• Images will display full-screen and transition continuously between each other</li>
					<li>• Select from your site image library or enter custom URLs</li>
					<li>• You can adjust the transition duration (how long each image is displayed)</li>
					<li>• Images should be high quality and optimized for large displays</li>
					<li>• The TV screen page is accessible at <code class="bg-gray-200 px-2 py-1 rounded">/tv-screen</code></li>
					<li>• Changes take effect immediately after saving</li>
				</ul>
			</div>
		{/if}
	</div>
</section>


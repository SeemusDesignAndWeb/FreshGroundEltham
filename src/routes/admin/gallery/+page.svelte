<script lang="js">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	// SiteImage and GalleryImage types not needed in JavaScript
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let galleryImages = $state([]);
	let images = $state([]);
	let isSaving = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		await Promise.all([loadGallery(), loadImages()]);
		isLoading = false;
	});

	async function loadGallery() {
		try {
			const response = await fetch('/api/admin/gallery');
			if (response.ok) {
				const data = await response.json();
				galleryImages = data.images || [];
			} else {
				throw new Error('Failed to load gallery settings');
			}
		} catch (error) {
			console.error('Error loading gallery:', error);
			notify.error('Failed to load gallery settings');
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
			const response = await fetch('/api/admin/gallery', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					images: galleryImages.filter(img => img.src.trim() !== '')
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save gallery settings');
			}

			notify.success('Gallery images saved successfully!');
		} catch (error) {
			console.error('Error saving gallery:', error);
			notify.error('Failed to save gallery settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function addImage() {
		// Category will be auto-populated when image is selected from library
		galleryImages = [...galleryImages, { src: '', alt: '', category: 'other' }];
	}

	function removeImage(index) {
		galleryImages = galleryImages.filter((_, i) => i !== index);
	}

    function updateImage(index, field, value) {
		galleryImages[index] = { ...galleryImages[index], [field]: value };
		galleryImages = [...galleryImages]; // Trigger reactivity
	}

	// Handle image selection from library - auto-populate category and alt text
	function handleImageSrcChange(index, newSrc) {
		const selectedImage = images.find(img => img.path === newSrc);
		if (selectedImage) {
			// Auto-populate category and alt text from the image library
			const updatedImage = { ...galleryImages[index] };
			updatedImage.src = newSrc;
			
			// Use category from image library if available, otherwise use 'other' as default
			if (selectedImage.category && selectedImage.category.trim() !== '') {
				updatedImage.category = selectedImage.category.trim();
			} else if (!updatedImage.category || updatedImage.category.trim() === '') {
				updatedImage.category = 'other';
			}
			
			// Use alt text from image library if available, otherwise keep existing
			if (selectedImage.alt && selectedImage.alt.trim() !== '') {
				updatedImage.alt = selectedImage.alt.trim();
			}
			
			galleryImages[index] = updatedImage;
			galleryImages = [...galleryImages]; // Trigger reactivity
		} else {
			// Just update the src if it's a custom URL, and set default category
			const updatedImage = { ...galleryImages[index] };
			updatedImage.src = newSrc;
			if (!updatedImage.category || updatedImage.category.trim() === '') {
				updatedImage.category = 'other';
			}
			galleryImages[index] = updatedImage;
			galleryImages = [...galleryImages]; // Trigger reactivity
		}
	}
</script>

<svelte:head>
	<title>Gallery Images - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage gallery images" />
</svelte:head>

<!-- Gallery Settings Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Gallery Images</h1>
		
		{#if isLoading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading...</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
					<div>
						<div class="flex justify-between items-center mb-4">
							<h2 class="text-2xl font-bold text-[#39918c]">Gallery Images</h2>
							<button
								type="button"
								onclick={addImage}
								class="bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#2f435a] transition-colors font-medium"
							>
								+ Add Image
							</button>
						</div>
						<p class="text-gray-600 mb-6">Select images from your library or enter custom URLs. Images can be categorized for filtering.</p>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each galleryImages as image, index}
								<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
									<div class="flex gap-4 items-start">
										<!-- Image Selector and URL -->
										<div class="flex-1 space-y-3">
											<ImageSelector
												images={images}
												value={image.src}
												onchange={(newValue) => handleImageSrcChange(index, newValue)}
												label="Image {index + 1}"
												placeholder="Select an image from library..."
												allowCustomUrl={true}
												showPreview={true}
											/>
											
											<!-- Alt Text -->
											<input 
												type="text" 
												value={image.alt}
												oninput={(e) => updateImage(index, 'alt', e.target.value)}
												placeholder="Alt text (description for accessibility)"
												class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
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
						
						{#if galleryImages.length === 0}
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
							disabled={isSaving || galleryImages.filter(img => img.src.trim() !== '').length === 0}
							class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save Gallery Images'}
						</button>
					</div>
				</form>
			</div>

			<!-- Info Box -->
			<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
				<h3 class="text-xl font-bold text-[#39918c] mb-3">About Gallery Images</h3>
				<ul class="space-y-2 text-gray-600">
					<li>• When selecting an image from the library, category and alt text are automatically populated from the image's metadata</li>
					<li>• Categories are automatically extracted from the selected images and displayed as filter buttons on the front-end gallery page</li>
					<li>• Select from your site image library or enter custom URLs</li>
					<li>• Alt text is important for accessibility - describe what's in the image</li>
					<li>• Images are displayed in a grid with category filtering on the gallery page</li>
					<li>• Click any image to view it in a lightbox modal</li>
					<li>• Changes take effect immediately after saving</li>
				</ul>
			</div>
		{/if}
	</div>
</section>


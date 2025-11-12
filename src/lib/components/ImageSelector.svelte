<script lang="ts">
	import type { SiteImage } from '$lib/types';

	interface Props {
		images: SiteImage[];
		value?: string;
		label?: string;
		placeholder?: string;
		allowCustomUrl?: boolean;
		showPreview?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		images = $bindable(),
		value = $bindable(''),
		label = 'Select Image',
		placeholder = 'Select an image from library...',
		allowCustomUrl = true,
		showPreview = true,
		onchange
	}: Props = $props();

	let showModal = $state(false);
	let customUrl = $state('');
	let searchQuery = $state('');

	// Filter images based on search query
	$effect(() => {
		if (!searchQuery) return;
	});

	function filteredImages() {
		if (!searchQuery.trim()) {
			return images;
		}
		const query = searchQuery.toLowerCase();
		return images.filter(
			(img) =>
				img.name.toLowerCase().includes(query) ||
				img.path.toLowerCase().includes(query) ||
				(img.category && img.category.toLowerCase().includes(query)) ||
				(img.alt && img.alt.toLowerCase().includes(query))
		);
	}

	function selectImage(imagePath: string) {
		value = imagePath;
		if (onchange) {
			onchange(imagePath);
		}
		showModal = false;
		searchQuery = '';
		customUrl = '';
	}

	function handleCustomUrl() {
		if (customUrl.trim()) {
			value = customUrl.trim();
			if (onchange) {
				onchange(customUrl.trim());
			}
			showModal = false;
			searchQuery = '';
			customUrl = '';
		}
	}

	function openModal() {
		showModal = true;
		customUrl = value && !images.find((img) => img.path === value) ? value : '';
		searchQuery = '';
	}

	function closeModal() {
		showModal = false;
		searchQuery = '';
		customUrl = '';
	}

	// Close modal on Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showModal) {
			closeModal();
		}
	}

	// Close modal when clicking outside
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Get selected image name for display
	function getSelectedImageName() {
		if (!value) return placeholder;
		const selected = images.find((img) => img.path === value);
		if (selected) return selected.name;
		// For custom URLs, show a truncated version
		if (value.length > 40) {
			return value.substring(0, 37) + '...';
		}
		return value;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="image-selector">
	<label class="block text-gray-700 font-medium mb-2">{label}</label>
	
	<!-- Button to open modal -->
	<button
		type="button"
		onclick={openModal}
		class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
	>
		<span class="text-gray-700 {!value ? 'text-gray-400' : ''}">
			{getSelectedImageName()}
		</span>
		<svg
			class="w-5 h-5 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	</button>

	<!-- Custom URL input (optional, shown below button) -->
	{#if allowCustomUrl}
		<input
			type="text"
			value={value}
			oninput={(e) => {
				const newValue = (e.target as HTMLInputElement).value;
				value = newValue;
				if (onchange) {
					onchange(newValue);
				}
			}}
			placeholder="Or enter a custom URL (e.g., https://images.unsplash.com/...)"
			class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] mt-2"
		/>
	{/if}

	<!-- Preview -->
	{#if showPreview && value}
		<div class="mt-2">
			<img
				src={value}
				alt="Preview"
				class="max-w-full max-h-32 object-contain border border-gray-300 rounded"
				onerror={(e) => {
					(e.target as HTMLImageElement).style.display = 'none';
				}}
			/>
		</div>
	{/if}

	<!-- Modal/Popup -->
	{#if showModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			onclick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Header -->
				<div class="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 id="modal-title" class="text-2xl font-bold text-[#39918c]">
						Select Image
					</h2>
					<button
						type="button"
						onclick={closeModal}
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Close"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Search bar -->
				<div class="p-4 border-b border-gray-200">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search images by name, path, or category..."
						class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
						autofocus
					/>
				</div>

				<!-- Image grid -->
				<div class="flex-1 overflow-y-auto p-4">
					{#if filteredImages().length === 0}
						<div class="text-center py-12">
							<p class="text-gray-600">
								{searchQuery ? 'No images found matching your search.' : 'No images available.'}
							</p>
							<p class="text-sm text-gray-500 mt-2">
								<a
									href="/admin/images"
									target="_blank"
									class="text-[#39918c] hover:underline"
								>
									Add images to the library
								</a>
							</p>
						</div>
					{:else}
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{#each filteredImages() as image (image.id)}
								<button
									type="button"
									onclick={() => selectImage(image.path)}
									class="group relative aspect-square border-2 rounded-lg overflow-hidden transition-all hover:border-[#39918c] hover:shadow-lg {value === image.path ? 'border-[#39918c] ring-2 ring-[#39918c]' : 'border-gray-300'}"
									title="{image.name}"
								>
									<img
										src={image.path}
										alt={image.alt || image.name}
										class="w-full h-full object-cover"
										onerror={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
										}}
									/>
									<!-- Selected indicator -->
									{#if value === image.path}
										<div
											class="absolute inset-0 bg-[#39918c] bg-opacity-20 flex items-center justify-center"
										>
											<svg
												class="w-8 h-8 text-[#39918c]"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									{/if}
									<!-- Image info overlay on hover -->
									<div
										class="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform"
									>
										<p class="text-xs font-medium truncate">{image.name}</p>
										{#if image.category}
											<p class="text-xs text-gray-300 truncate">{image.category}</p>
										{/if}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Custom URL section -->
				{#if allowCustomUrl}
					<div class="p-4 border-t border-gray-200">
						<label class="block text-gray-700 font-medium mb-2">
							Or enter a custom URL:
						</label>
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={customUrl}
								placeholder="https://images.unsplash.com/photo-..."
								class="flex-1 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c]"
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										handleCustomUrl();
									}
								}}
							/>
							<button
								type="button"
								onclick={handleCustomUrl}
								disabled={!customUrl.trim()}
								class="bg-[#39918c] text-white px-6 py-2 rounded hover:bg-[#2f435a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Use URL
							</button>
						</div>
					</div>
				{/if}

				<!-- Footer -->
				<div class="flex justify-end gap-2 p-4 border-t border-gray-200">
					<button
						type="button"
						onclick={closeModal}
						class="px-6 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.image-selector {
		/* Component styles */
	}
</style>


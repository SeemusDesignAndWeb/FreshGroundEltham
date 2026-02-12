<script lang="js">
	import { onMount } from 'svelte';
	// SiteImage type not needed in JavaScript
	import { notify } from '$lib/stores/notifications';

	let images = $state([]);
	let editingId = $state(null);
	let showAddForm = $state(false);
	let uploading = $state(false);
	let selectedFile = $state(null);
	let uploadPreview = $state(null);
	let formData = $state({
		name: '',
		path: '',
		alt: '',
		category: ''
	});

	async function loadImages() {
		try {
			const response = await fetch('/api/admin/images');
			if (response.ok) {
				const data = await response.json();
				images = data.images || [];
			}
		} catch (error) {
			console.error('Error loading images:', error);
			notify.error('Failed to load images');
		}
	}


	onMount(async () => {
		await loadImages();
		// If no images exist, automatically populate from activities
		if (images.length === 0) {
			try {
				const response = await fetch('/api/admin/images/populate', {
					method: 'POST'
				});
				if (response.ok) {
					const data = await response.json();
					await loadImages(); // Reload to show the newly added images
					if (data.added > 0) {
						notify.success(data.message || 'Images imported from activities!');
					}
				}
			} catch (error) {
				console.error('Error auto-populating images:', error);
				// Don't show error - it's just an auto-populate attempt
			}
		}
	});

	function handleEdit(image) {
		editingId = image.id;
		formData = { ...image };
		showAddForm = true;
	}

	function handleAdd() {
		formData = {
			name: '',
			path: '',
			alt: '',
			category: ''
		};
		selectedFile = null;
		uploadPreview = null;
		editingId = null;
		showAddForm = true;
	}

	async function handleFileSelect(event) {
		const input = event.target;
		const file = input.files?.[0];
		
		if (!file) return;

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
		if (!allowedTypes.includes(file.type)) {
			notify.error('Invalid file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.');
			input.value = ''; // Clear the input
			return;
		}

		// Validate file size (10MB max)
		const maxSize = 10 * 1024 * 1024; // 10MB in bytes
		const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
		
		if (file.size > maxSize) {
			notify.error(`File is too large (${fileSizeMB}MB). Maximum size is 10MB. Please compress or resize the image before uploading.`);
			input.value = ''; // Clear the input
			selectedFile = null;
			uploadPreview = null;
			return;
		}
		
		// Warn if file is close to the limit (8MB+)
		if (file.size > 8 * 1024 * 1024) {
			notify.info(`Large file detected (${fileSizeMB}MB). Upload may take longer.`);
		}

		selectedFile = file;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			uploadPreview = e.target?.result;
		};
		reader.readAsDataURL(file);

		// Auto-fill name from filename
		if (!formData.name) {
			const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
			formData.name = nameWithoutExt
				.split(/[-_\s]/)
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
		}

		// Upload the file
		await uploadFile(file);
	}

	async function uploadFile(file) {
		uploading = true;
		try {
			const formDataUpload = new FormData();
			formDataUpload.append('file', file);

			const response = await fetch('/api/admin/images/upload', {
				method: 'POST',
				body: formDataUpload
			});

			if (!response.ok) {
				let errorMsg = 'Upload failed';
				let details = '';
				try {
					const text = await response.text();
					const parsed = text ? JSON.parse(text) : {};
					errorMsg = parsed?.error || errorMsg;
					details = parsed?.details ? ` - ${parsed.details}` : '';
				} catch {
					// Non-JSON response (e.g. HTML error page)
					errorMsg = `Server error (${response.status})`;
					details = ' - Check production logs';
				}
				throw new Error(`${errorMsg}${details}`);
			}

			const data = await response.json();
			formData.path = data.path;
			
			// Auto-fill alt text if not set
			if (!formData.alt && formData.name) {
				formData.alt = formData.name;
			}
			
			notify.success('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading file:', error);
			let errorMessage = 'Failed to upload image';
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'object' && error !== null && 'error' in error) {
				errorMessage = String((error).error);
			}
			notify.error(errorMessage);
			selectedFile = null;
			uploadPreview = null;
		} finally {
			uploading = false;
		}
	}

	async function handleSave() {
		try {
			if (editingId) {
				const response = await fetch('/api/admin/images', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: editingId, ...formData })
				});
				if (!response.ok) throw new Error('Failed to update');
				notify.success('Image updated successfully!');
			} else {
          const newImage = {
					id: Date.now().toString(),
					name: formData.name || '',
					path: formData.path || '',
					alt: formData.alt || '',
					category: formData.category || ''
				};
				const response = await fetch('/api/admin/images', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newImage)
				});
				if (!response.ok) throw new Error('Failed to add');
				notify.success('Image added successfully!');
			}
			await loadImages();
			showAddForm = false;
			editingId = null;
		} catch (error) {
			console.error('Error saving image:', error);
			notify.error('Failed to save image. Please try again.');
		}
	}

	function handleCancel() {
		showAddForm = false;
		editingId = null;
		selectedFile = null;
		uploadPreview = null;
		formData = {
			name: '',
			path: '',
			alt: '',
			category: ''
		};
	}

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}
</script>

<svelte:head>
	<title>Manage Images - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage site images" />
</svelte:head>

<!-- Images Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Site Images</h1>
			<button 
				onclick={handleAdd}
				class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
			>
				+ Add New Image
			</button>
		</div>

		{#if showAddForm}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingId ? 'Edit Image' : 'Add New Image'}
				</h2>
				
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-4">
					<div>
						<label for="file" class="block text-gray-700 font-medium mb-2">
							{editingId ? 'Change Image (Optional)' : 'Upload Image *'}
						</label>
						<input 
							id="file"
							type="file" 
							accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
							onchange={handleFileSelect}
							disabled={uploading}
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<p class="text-sm text-gray-600 mt-1">
							{editingId 
								? 'Upload a new image to replace the current one. Leave empty to keep current image.'
								: 'Upload an image file (JPEG, PNG, GIF, WebP, or SVG). Maximum size: 10MB. Large images will be automatically optimized.'}
						</p>
						{#if selectedFile}
							<p class="text-sm text-[#39918c] mt-1 font-medium">
								Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
							</p>
						{/if}
						{#if uploading}
							<p class="text-sm text-[#39918c] mt-1">Uploading...</p>
						{/if}
						{#if uploadPreview}
							<div class="mt-2">
								<img 
									src={uploadPreview} 
									alt="Upload preview"
									class="max-w-full max-h-48 object-contain border border-gray-300 rounded"
								/>
							</div>
						{/if}
					</div>

					<div>
						<label for="name" class="block text-gray-700 font-medium mb-2">Image Name *</label>
						<input 
							id="name"
							type="text" 
							bind:value={formData.name}
							required
							placeholder="e.g., Coffee Beans Background"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
						<p class="text-sm text-gray-600 mt-1">This is the display name for selecting the image</p>
					</div>

					<div>
						<label for="path" class="block text-gray-700 font-medium mb-2">Image Path *</label>
						<input 
							id="path"
							type="text" 
							bind:value={formData.path}
							required
							placeholder="/images/pastries.jpg"
							readonly={!!uploadPreview}
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c] {uploadPreview ? 'bg-gray-100' : ''}"
						/>
						<p class="text-sm text-gray-600 mt-1">
							{uploadPreview 
								? 'Path set automatically after upload' 
								: editingId 
									? 'Current image path (or upload a new image above to replace)'
									: 'Path to the image file (must start with /images/) or upload a file above'}
						</p>
					</div>

					<div>
						<label for="alt" class="block text-gray-700 font-medium mb-2">Alt Text</label>
						<input 
							id="alt"
							type="text" 
							bind:value={formData.alt}
							placeholder="Descriptive text for accessibility"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="category" class="block text-gray-700 font-medium mb-2">Category</label>
						<input 
							id="category"
							type="text" 
							bind:value={formData.category}
							placeholder="e.g., coffee, food, activities"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
						<p class="text-sm text-gray-600 mt-1">Optional category for organizing images</p>
					</div>

					{#if formData.path}
						<div class="mt-4">
							<p class="text-sm text-gray-700 font-medium mb-2">Preview:</p>
							<div class="border-2 border-gray-300 rounded p-4 bg-gray-50">
								<img 
									src={formData.path} 
									alt={formData.alt || formData.name || 'Preview'}
									class="max-w-full max-h-64 object-contain mx-auto"
									onerror={handleImageError}
								/>
							</div>
						</div>
					{/if}

					<div class="flex gap-4">
						<button 
							type="submit"
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Image
						</button>
						<button 
							type="button"
							onclick={handleCancel}
							class="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each images as image (image.id)}
				<div class="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-[#39918c]">
					<div class="relative h-48 overflow-hidden bg-gray-100">
						<img 
							src={image.path} 
							alt={image.alt || image.name}
							class="w-full h-full object-cover"
							onerror={handleImageError}
						/>
					</div>
					
					<div class="p-6">
						<h3 class="text-xl font-bold text-[#39918c] mb-2">{image.name}</h3>
						<p class="text-sm text-gray-600 mb-2"><strong>Path:</strong> {image.path}</p>
						{#if image.alt}
							<p class="text-sm text-gray-600 mb-2"><strong>Alt:</strong> {image.alt}</p>
						{/if}
						{#if image.category}
							<p class="text-sm text-gray-600 mb-4"><strong>Category:</strong> {image.category}</p>
						{/if}
						
						<div class="flex gap-2">
							<button 
								onclick={() => handleEdit(image)}
								class="flex-1 bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium text-sm"
							>
								Edit
							</button>
							<button 
								onclick={async () => {
									if (confirm('Are you sure you want to delete this image?')) {
										try {
											const response = await fetch('/api/admin/images', {
												method: 'DELETE',
												headers: { 'Content-Type': 'application/json' },
												body: JSON.stringify({ id: image.id })
											});
											if (response.ok) {
												await loadImages();
												notify.success('Image deleted successfully!');
											} else {
												notify.error('Failed to delete image');
											}
										} catch (error) {
											console.error('Error deleting image:', error);
											notify.error('Failed to delete image');
										}
									}
								}}
								class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium text-sm"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if images.length === 0}
			<div class="text-center py-12 bg-white rounded-lg">
				<p class="text-xl text-gray-700">No images yet. Add your first image above!</p>
			</div>
		{/if}
	</div>
</section>


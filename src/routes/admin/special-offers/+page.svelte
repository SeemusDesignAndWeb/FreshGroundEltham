<script lang="js">
	import { onMount } from 'svelte';
	// SpecialOffer and SiteImage types not needed in JavaScript
	import { notify } from '$lib/stores/notifications';
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let { data } = $props();
	let offers = $state(data?.offers || []);
	let editingId = $state(null);
	let showAddForm = $state(false);
	let images = $state([]);
	let formData = $state({
		name: '',
		description: '',
		image: '',
		price: 0,
		enabled: true,
		emailInformation: ''
	});

	async function loadOffers() {
		try {
			const response = await fetch('/api/admin/special-offers');
			if (response.ok) {
				const data = await response.json();
				offers = data.offers || [];
			}
		} catch (error) {
			console.error('Error loading special offers:', error);
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

	onMount(() => {
		loadOffers();
		loadImages();
	});

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}

	function handleEdit(offer) {
		editingId = offer.id;
		formData = { ...offer };
		showAddForm = true;
	}

	function handleAdd() {
		formData = {
			name: '',
			description: '',
			image: '',
			price: 0,
			enabled: true,
			emailInformation: ''
		};
		editingId = null;
		showAddForm = true;
	}

	async function handleSave() {
		try {
			if (editingId) {
				const response = await fetch('/api/admin/special-offers', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						action: 'update', 
						offer: { id: editingId, ...formData }
					})
				});
				if (!response.ok) throw new Error('Failed to update');
				notify.success('Special offer updated successfully!');
			} else {
          const newOffer = {
					id: Date.now().toString(),
					name: formData.name || '',
					description: formData.description || '',
					image: formData.image || '/images/pastries.jpg',
					price: formData.price || 0,
					enabled: formData.enabled ?? true,
					emailInformation: formData.emailInformation || ''
				};
				const response = await fetch('/api/admin/special-offers', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'create', offer: newOffer })
				});
				if (!response.ok) throw new Error('Failed to add');
				notify.success('Special offer created successfully!');
			}
			await loadOffers();
			showAddForm = false;
			editingId = null;
		} catch (error) {
			console.error('Error saving offer:', error);
			notify.error('Failed to save special offer. Please try again.');
		}
	}

	function handleCancel() {
		showAddForm = false;
		editingId = null;
		formData = {
			name: '',
			description: '',
			image: '',
			price: 0,
			enabled: true,
			emailInformation: ''
		};
	}

	async function handleDelete(id) {
		if (!confirm('Are you sure you want to delete this special offer?')) return;
		
		try {
			const response = await fetch('/api/admin/special-offers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', offer: { id } })
			});
			if (!response.ok) throw new Error('Failed to delete');
			await loadOffers();
			notify.success('Special offer deleted successfully!');
		} catch (error) {
			console.error('Error deleting offer:', error);
			notify.error('Failed to delete special offer. Please try again.');
		}
	}

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}
</script>

<svelte:head>
	<title>Manage Special Offers - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage special offers" />
</svelte:head>

<!-- Special Offers Management Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Manage Special Offers</h1>
			<div class="space-x-4">
				<a href="/admin" class="inline-block bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors">
					← Back to Dashboard
				</a>
				{#if !showAddForm}
					<button 
						onclick={handleAdd}
						class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors"
					>
						+ Add Special Offer
					</button>
				{/if}
			</div>
		</div>

		<!-- Add/Edit Form -->
		{#if showAddForm}
			<div class="bg-gray-50 rounded-lg p-8 mb-8 border-2 border-[#39918c]">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingId ? 'Edit Special Offer' : 'Add New Special Offer'}
				</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label for="offer-name" class="block text-gray-700 font-medium mb-2">Offer Name *</label>
						<input 
							id="offer-name"
							type="text" 
							bind:value={formData.name}
							placeholder="e.g., Coffee & Cake Deal"
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="offer-price" class="block text-gray-700 font-medium mb-2">Price (£) *</label>
						<input 
							id="offer-price"
							type="number" 
							bind:value={formData.price}
							step="0.01"
							min="0"
							placeholder="10.00"
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>
				</div>

				<div class="mt-4">
					<label for="offer-description" class="block text-gray-700 font-medium mb-2">Description *</label>
					<textarea 
						id="offer-description"
						bind:value={formData.description}
						rows="3"
						placeholder="Describe what's included in this offer..."
						class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
					></textarea>
				</div>

				<div class="mt-4">
					<ImageSelector
						images={images}
						bind:value={formData.image}
						label="Image (Optional - not displayed)"
						placeholder="No image"
						allowCustomUrl={true}
						showPreview={true}
					/>
					<p class="text-sm text-gray-500 mt-1">Images are stored but not displayed in the banner style.</p>
				</div>

				<div class="mt-4">
					<label class="flex items-center">
						<input 
							type="checkbox" 
							bind:checked={formData.enabled}
							class="mr-2 h-5 w-5 text-[#39918c] focus:ring-[#39918c] border-gray-300 rounded"
						/>
						<span class="text-gray-700 font-medium">Display this offer on homepage</span>
					</label>
				</div>

				<div class="mt-4">
					<label for="offer-email-info" class="block text-gray-700 font-medium mb-2">Email Information (Optional)</label>
					<textarea 
						id="offer-email-info"
						bind:value={formData.emailInformation}
						rows="3"
						placeholder="Additional information to include in customer confirmation emails (not shown on website)..."
						class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
					></textarea>
					<p class="text-sm text-gray-500 mt-1">This information will only be sent to customers via email, it won't appear on the website.</p>
				</div>

				<div class="flex gap-4 mt-6">
					<button 
						onclick={handleSave}
						class="bg-[#39918c] text-white px-6 py-2 rounded hover:bg-[#2f435a] transition-colors"
					>
						{editingId ? 'Update Offer' : 'Create Offer'}
					</button>
					<button 
						onclick={handleCancel}
						class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<!-- Special Offers List -->
		<div class="space-y-4">
			{#if offers.length === 0}
				<div class="text-center py-12 bg-gray-50 rounded-lg">
					<p class="text-xl text-gray-600">No special offers yet.</p>
					<p class="text-gray-500 mt-2">Click "Add Special Offer" to create your first promotional offer!</p>
				</div>
			{:else}
				{#each offers as offer (offer.id)}
					<div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
						<div class="flex items-start justify-between">
							<div>
								<div class="flex items-center gap-3 mb-2">
									<h3 class="text-2xl font-bold text-[#39918c]">{offer.name}</h3>
									{#if offer.enabled}
										<span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
									{:else}
										<span class="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Hidden</span>
									{/if}
								</div>
								<p class="text-gray-700 mb-2">{offer.description}</p>
								<p class="text-2xl font-bold text-[#ab6b51]">{formatPrice(offer.price)}</p>
								{#if offer.emailInformation}
									<details class="mt-3">
										<summary class="text-sm text-gray-600 cursor-pointer hover:text-[#39918c]">
											📧 Email Information
										</summary>
										<p class="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-300">{offer.emailInformation}</p>
									</details>
								{/if}
							</div>
							
							<div class="flex gap-2">
								<button 
									onclick={() => handleEdit(offer)}
									class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
								>
									Edit
								</button>
								<button 
									onclick={() => handleDelete(offer.id)}
									class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>


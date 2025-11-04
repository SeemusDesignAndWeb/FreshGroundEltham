<script lang="ts">
	import { onMount } from 'svelte';
	import type { MenuItem } from '$lib/server/database';

	let menuItems = $state<MenuItem[]>([]);
	let editingMenuItemId = $state<string | null>(null);
	let showMenuItemForm = $state(false);
	let menuItemFormData = $state<Partial<MenuItem>>({
		category: '',
		name: '',
		description: '',
		price: 0
	});

	async function loadMenuItems() {
		try {
			const response = await fetch('/api/admin/menu');
			if (response.ok) {
				const data = await response.json();
				menuItems = data.menuItems || [];
			}
		} catch (error) {
			console.error('Error loading menu items:', error);
		}
	}

	onMount(() => {
		loadMenuItems();
	});

	function handleEditMenuItem(menuItem: MenuItem) {
		editingMenuItemId = menuItem.id;
		menuItemFormData = { ...menuItem };
		showMenuItemForm = true;
	}

	function handleAddMenuItem() {
		menuItemFormData = {
			category: '',
			name: '',
			description: '',
			price: 0
		};
		editingMenuItemId = null;
		showMenuItemForm = true;
	}

	async function handleSaveMenuItem() {
		try {
			if (editingMenuItemId) {
				const response = await fetch('/api/admin/menu', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: editingMenuItemId, ...menuItemFormData })
				});
				if (!response.ok) throw new Error('Failed to update');
			} else {
				const newMenuItem: MenuItem = {
					id: Date.now().toString(),
					category: menuItemFormData.category || '',
					name: menuItemFormData.name || '',
					description: menuItemFormData.description || '',
					price: menuItemFormData.price || 0
				};
				const response = await fetch('/api/admin/menu', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newMenuItem)
				});
				if (!response.ok) throw new Error('Failed to add');
			}
			await loadMenuItems();
			showMenuItemForm = false;
			editingMenuItemId = null;
		} catch (error) {
			console.error('Error saving menu item:', error);
			alert('Failed to save menu item. Please try again.');
		}
	}

	function handleCancelMenuItem() {
		showMenuItemForm = false;
		editingMenuItemId = null;
		menuItemFormData = {
			category: '',
			name: '',
			description: '',
			price: 0
		};
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}
</script>

<svelte:head>
	<title>Manage Menu - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage menu items" />
</svelte:head>

<!-- Menu Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Menu Items</h1>
			<button 
				onclick={handleAddMenuItem}
				class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
			>
				+ Add New Menu Item
			</button>
		</div>

		{#if showMenuItemForm}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingMenuItemId ? 'Edit Menu Item' : 'Add New Menu Item'}
				</h2>
				
				<form onsubmit={(e) => { e.preventDefault(); handleSaveMenuItem(); }} class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="category" class="block text-gray-700 font-medium mb-2">Category *</label>
							<select
								id="category"
								bind:value={menuItemFormData.category}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							>
								<option value="">Select category...</option>
								<option value="Hot Drinks">Hot Drinks</option>
								<option value="Cold Drinks">Cold Drinks</option>
								<option value="Food">Food</option>
								<option value="Cakes">Cakes</option>
								<option value="Snacks">Snacks</option>
							</select>
						</div>
						<div>
							<label for="price" class="block text-gray-700 font-medium mb-2">Price (£) *</label>
							<input 
								id="price"
								type="number" 
								step="0.01"
								min="0"
								bind:value={menuItemFormData.price}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
					</div>

					<div>
						<label for="name" class="block text-gray-700 font-medium mb-2">Item Name *</label>
						<input 
							id="name"
							type="text" 
							bind:value={menuItemFormData.name}
							required
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="description" class="block text-gray-700 font-medium mb-2">Description</label>
						<textarea 
							id="description"
							bind:value={menuItemFormData.description}
							rows="3"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						></textarea>
					</div>

					<div class="flex gap-4">
						<button 
							type="submit"
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Menu Item
						</button>
						<button 
							type="button"
							onclick={handleCancelMenuItem}
							class="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each menuItems as menuItem (menuItem.id)}
				<div class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c]">
					<div class="mb-3">
						<span class="inline-block bg-[#39918c] text-white px-3 py-1 rounded text-sm font-medium mb-2">{menuItem.category}</span>
					</div>
					<div class="flex justify-between items-start mb-2">
						<h3 class="text-xl font-bold text-[#39918c] flex-1">{menuItem.name}</h3>
						<span class="text-lg font-bold text-[#39918c] ml-2">{formatPrice(menuItem.price)}</span>
					</div>
					{#if menuItem.description}
						<p class="text-gray-600 mb-4 text-sm">{menuItem.description}</p>
					{/if}
					
					<div class="flex gap-2">
						<button 
							onclick={() => handleEditMenuItem(menuItem)}
							class="flex-1 bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium text-sm"
						>
							Edit
						</button>
						<button 
							onclick={async () => {
								if (confirm('Are you sure you want to delete this menu item?')) {
									try {
										const response = await fetch('/api/admin/menu', {
											method: 'DELETE',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ id: menuItem.id })
										});
										if (response.ok) {
											await loadMenuItems();
										} else {
											alert('Failed to delete menu item');
										}
									} catch (error) {
										console.error('Error deleting menu item:', error);
										alert('Failed to delete menu item');
									}
								}
							}}
							class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium text-sm"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>

		{#if menuItems.length === 0}
			<div class="text-center py-12 bg-white rounded-lg">
				<p class="text-xl text-gray-700">No menu items yet. Add your first menu item above!</p>
			</div>
		{/if}
	</div>
</section>


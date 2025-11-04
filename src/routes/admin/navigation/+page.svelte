<script lang="ts">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	import type { NavigationItem } from '$lib/server/database';

	let navigationItems = $state<NavigationItem[]>([]);
	let isSaving = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/admin/navigation');
			if (response.ok) {
				const data = await response.json();
				navigationItems = data.items || [];
			} else {
				throw new Error('Failed to load navigation settings');
			}
		} catch (error) {
			console.error('Error loading navigation:', error);
			notify.error('Failed to load navigation settings');
		} finally {
			isLoading = false;
		}
	});

	async function handleSave() {
		isSaving = true;
		try {
			const response = await fetch('/api/admin/navigation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: navigationItems
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save navigation settings');
			}

			notify.success('Navigation settings saved successfully!');
		} catch (error) {
			console.error('Error saving navigation:', error);
			notify.error('Failed to save navigation settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	function toggleHidden(index: number) {
		navigationItems[index].hidden = !navigationItems[index].hidden;
	}
</script>

<svelte:head>
	<title>Navigation Settings - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage navigation visibility" />
</svelte:head>

<!-- Navigation Settings Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Navigation Settings</h1>
		
		{#if isLoading}
			<div class="text-center py-8">
				<p class="text-gray-600">Loading navigation settings...</p>
			</div>
		{:else}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
					<!-- Navigation Items List -->
					<div class="space-y-4">
						<h2 class="text-2xl font-bold text-[#39918c] mb-4">Navigation Items</h2>
						<p class="text-gray-600 mb-6">Toggle visibility for each page in the navigation menu.</p>
						
						{#each navigationItems as item, index}
							<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#39918c] transition-colors">
								<div class="flex-1">
									<div class="flex items-center gap-3">
										<span class="text-lg font-medium text-gray-700">{item.label}</span>
										<span class="text-sm text-gray-500">({item.path})</span>
									</div>
								</div>
								<div class="flex items-center gap-4">
									<span class="text-sm {item.hidden ? 'text-red-600' : 'text-green-600'} font-medium">
										{item.hidden ? 'Hidden' : 'Visible'}
									</span>
									<label class="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={!item.hidden}
											onchange={() => toggleHidden(index)}
											class="sr-only peer"
										/>
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39918c]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39918c]"></div>
									</label>
								</div>
							</div>
						{/each}
					</div>

					<!-- Save Button -->
					<div class="flex gap-4 pt-4 border-t border-gray-200">
						<button
							type="submit"
							disabled={isSaving}
							class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save Navigation Settings'}
						</button>
					</div>
				</form>
			</div>

			<!-- Info Box -->
			<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
				<h3 class="text-xl font-bold text-[#39918c] mb-3">About Navigation Visibility</h3>
				<ul class="space-y-2 text-gray-600">
					<li>• Hidden pages will not appear in the main navigation menu</li>
					<li>• Pages are still accessible via direct URL</li>
					<li>• Use this to temporarily hide pages without deleting them</li>
					<li>• Changes take effect immediately after saving</li>
				</ul>
			</div>
		{/if}
	</div>
</section>


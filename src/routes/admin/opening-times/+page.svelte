<script lang="ts">
	import { onMount } from 'svelte';
	import type { OpeningTimes } from '$lib/server/database';
	import type { SiteImage } from '$lib/server/database';
	import { notify } from '$lib/stores/notifications';

	let openingTimes = $state<OpeningTimes | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let successMessage = $state('');
	let images = $state<SiteImage[]>([]);

	onMount(async () => {
		await loadOpeningTimes();
		await loadImages();
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
		}
	}

	async function loadOpeningTimes() {
		try {
			const response = await fetch('/api/admin/opening-times');
			if (response.ok) {
				const data = await response.json();
				openingTimes = data.openingTimes || {
					days: 'Wednesday to Saturday',
					hours: '9:30 am to 2:00 pm',
					closedDays: 'Sunday, Monday, and Tuesday',
					backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
					specialHours: ''
				};
			} else {
				// Set defaults if not found
				openingTimes = {
					days: 'Wednesday to Saturday',
					hours: '9:30 am to 2:00 pm',
					closedDays: 'Sunday, Monday, and Tuesday',
					backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
					specialHours: ''
				};
			}
		} catch (error) {
			console.error('Error loading opening times:', error);
			openingTimes = {
				days: 'Wednesday to Saturday',
				hours: '9:30 am to 2:00 pm',
				closedDays: 'Sunday, Monday, and Tuesday',
				backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
				specialHours: ''
			};
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		if (!openingTimes) return;
		
		// Validate that background image is provided
		if (!openingTimes.backgroundImage || openingTimes.backgroundImage.trim() === '') {
			notify.error('Please select an image from the library or enter a custom URL for the background image.');
			return;
		}
		
		saving = true;
		successMessage = '';

		try {
			const response = await fetch('/api/admin/opening-times', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(openingTimes)
			});

			if (response.ok) {
				notify.success('Opening times saved successfully!');
			} else {
				notify.error('Failed to save opening times. Please try again.');
			}
		} catch (error) {
			console.error('Error saving opening times:', error);
			notify.error('Failed to save opening times. Please try again.');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Manage Opening Times - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage opening times" />
</svelte:head>

<!-- Opening Times Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Opening Times</h1>

		{#if loading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading...</p>
			</div>
		{:else if openingTimes}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
					<div>
						<label for="days" class="block text-gray-700 font-medium mb-2">Days *</label>
						<input 
							id="days"
							type="text" 
							bind:value={openingTimes.days}
							required
							placeholder="e.g., Wednesday to Saturday"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="hours" class="block text-gray-700 font-medium mb-2">Hours *</label>
						<input 
							id="hours"
							type="text" 
							bind:value={openingTimes.hours}
							required
							placeholder="e.g., 9:30 am to 2:00 pm"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="closedDays" class="block text-gray-700 font-medium mb-2">Closed Days</label>
						<input 
							id="closedDays"
							type="text" 
							bind:value={openingTimes.closedDays}
							placeholder="e.g., Sunday, Monday, and Tuesday"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="backgroundImage" class="block text-gray-700 font-medium mb-2">Background Image *</label>
						<select 
							id="backgroundImage"
							bind:value={openingTimes.backgroundImage}
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						>
							<option value="">Select an image from library...</option>
							{#each images as img}
								<option value={img.path}>{img.name} ({img.path})</option>
							{/each}
						</select>
						<p class="text-sm text-gray-600 mt-1">
							Select an image from the library, or <a href="/admin/images" class="text-[#39918c] hover:underline" target="_blank">add a new image</a>
						</p>
						<div class="mt-2">
							<label for="backgroundImageUrl" class="block text-gray-700 font-medium mb-2 text-sm">Or enter a custom URL:</label>
							<input 
								id="backgroundImageUrl"
								type="text" 
								bind:value={openingTimes.backgroundImage}
								placeholder="https://images.unsplash.com/photo-..."
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
							<p class="text-sm text-gray-600 mt-1">Enter a full URL for the background image (required if not selecting from library)</p>
						</div>
						{#if openingTimes.backgroundImage}
							<div class="mt-2">
								<img 
									src={openingTimes.backgroundImage} 
									alt="Preview"
									class="max-w-full max-h-32 object-contain border border-gray-300 rounded"
									onerror={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
								/>
							</div>
						{/if}
					</div>

					<div>
						<label for="specialHours" class="block text-gray-700 font-medium mb-2">Special Opening Hours (Optional)</label>
						<input 
							id="specialHours"
							type="text" 
							bind:value={openingTimes.specialHours}
							placeholder="e.g., Extended hours during Christmas: 10am-4pm"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
						<p class="text-sm text-gray-600 mt-1">Optional message about special opening hours or events</p>
					</div>

					<!-- Preview Section -->
					<div class="mt-8 pt-6 border-t border-gray-300">
						<h3 class="text-xl font-bold text-[#39918c] mb-4">Preview</h3>
						<div class="relative h-64 rounded-lg overflow-hidden border-2 border-gray-300">
							<div 
								class="absolute inset-0 bg-cover bg-center"
								style="background-image: url('{openingTimes.backgroundImage}');"
							></div>
							<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20"></div>
							<div class="absolute inset-0 flex items-center justify-center text-center text-white px-4">
								<div>
									<div class="text-2xl font-bold mb-2 drop-shadow-lg">{openingTimes.days}</div>
									<div class="text-xl font-bold drop-shadow-lg">{openingTimes.hours}</div>
									{#if openingTimes.closedDays}
										<p class="text-sm text-gray-100 mt-2 drop-shadow-md">Closed: {openingTimes.closedDays}</p>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<div class="flex gap-4 pt-4">
						<button 
							type="submit"
							disabled={saving}
							class="bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? 'Saving...' : 'Save Opening Times'}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</section>


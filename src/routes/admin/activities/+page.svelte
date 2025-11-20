<script lang="js">
	import { onMount } from 'svelte';
	// Activity and SiteImage types not needed in JavaScript
	import { notify } from '$lib/stores/notifications';
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let { data } = $props();
	let activities = $state(data?.activities || []);
	let editingId = $state(null);
	let showAddForm = $state(false);
	let settings = $state(data?.settings || { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' });
	let showSettingsForm = $state(false);
	let images = $state([]);
	let formData = $state({
		title: '',
		description: '',
		image: '',
		date: '',
		time: '',
		price: 0,
		capacity: 0,
		emailInformation: ''
	});

	async function loadActivities() {
		try {
			const response = await fetch('/api/admin/activities');
			if (response.ok) {
				const data = await response.json();
				activities = data.activities || [];
				settings = data.settings || { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' };
			}
		} catch (error) {
			console.error('Error loading activities:', error);
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

	async function handleSaveSettings() {
		try {
			const response = await fetch('/api/admin/activities', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings)
			});
			if (!response.ok) throw new Error('Failed to save settings');
			showSettingsForm = false;
			notify.success('Settings saved successfully!');
		} catch (error) {
			console.error('Error saving settings:', error);
			notify.error('Failed to save settings. Please try again.');
		}
	}

	onMount(() => {
		loadActivities();
		loadImages();
	});

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}

	function handleEdit(activity) {
		editingId = activity.id;
		formData = { ...activity };
		showAddForm = true;
	}

	function handleAdd() {
		formData = {
			title: '',
			description: '',
			image: '',
			date: '',
			time: '',
			price: 0,
			capacity: 0,
			emailInformation: ''
		};
		editingId = null;
		showAddForm = true;
	}

	async function handleSave() {
		try {
			if (editingId) {
				const response = await fetch('/api/admin/activities', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: editingId, ...formData })
				});
				if (!response.ok) throw new Error('Failed to update');
			} else {
          const newActivity = {
            id: Date.now().toString(),
					title: formData.title || '',
					description: formData.description || '',
					image: formData.image || '/images/pastries.jpg',
					date: formData.date || '',
					time: formData.time || '',
					price: formData.price || 0,
					capacity: formData.capacity || 0,
					emailInformation: formData.emailInformation || ''
				};
				const response = await fetch('/api/admin/activities', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newActivity)
				});
				if (!response.ok) throw new Error('Failed to add');
			}
			await loadActivities();
			showAddForm = false;
			editingId = null;
		} catch (error) {
			console.error('Error saving activity:', error);
			notify.error('Failed to save activity. Please try again.');
		}
	}

	function handleCancel() {
		showAddForm = false;
		editingId = null;
		formData = {
			title: '',
			description: '',
			image: '',
			date: '',
			time: '',
			price: 0,
			capacity: 0,
			emailInformation: ''
		};
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}
</script>

<svelte:head>
	<title>Manage Activities - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage kids activities" />
</svelte:head>

<!-- Activities Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Kids Activities</h1>
			<div class="flex gap-4">
				<button 
					onclick={() => showSettingsForm = !showSettingsForm}
					class="bg-[#2f435a] text-white px-6 py-3 rounded hover:bg-[#1e2d3f] transition-colors font-medium"
				>
					⚙️ Settings
				</button>
				<button 
					onclick={handleAdd}
					class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
				>
					+ Add New Activity
				</button>
			</div>
		</div>

		{#if showSettingsForm}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">Activities Settings</h2>
				
				<div class="space-y-6">
					<div>
						<label class="flex items-center gap-3 cursor-pointer">
							<input 
								type="checkbox" 
								bind:checked={settings.hidden}
								class="w-5 h-5 text-[#39918c] rounded focus:ring-2 focus:ring-[#39918c]"
							/>
							<span class="text-lg font-medium text-gray-700">Hide activities and show message instead</span>
						</label>
						<p class="text-sm text-gray-600 mt-2 ml-8">
							When enabled, visitors will see your custom message instead of the activities list.
						</p>
					</div>

					<div>
						<label for="message" class="block text-gray-700 font-medium mb-2">Message to Display</label>
						<textarea 
							id="message"
							bind:value={settings.message}
							rows="4"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							placeholder="Enter your message here..."
						></textarea>
						<p class="text-sm text-gray-600 mt-2">
							This message will be shown when activities are hidden.
						</p>
					</div>

					<div class="flex gap-4">
						<button 
							onclick={handleSaveSettings}
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Settings
						</button>
						<button 
							onclick={() => showSettingsForm = false}
							class="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if showAddForm}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingId ? 'Edit Activity' : 'Add New Activity'}
				</h2>
				
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="title" class="block text-gray-700 font-medium mb-2">Activity Title *</label>
							<input 
								id="title"
								type="text" 
								bind:value={formData.title}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
						<div>
							<ImageSelector
								images={images}
								bind:value={formData.image}
								label="Image *"
								placeholder="Select an image..."
								allowCustomUrl={true}
								showPreview={true}
							/>
							<p class="text-sm text-gray-600 mt-1">
								Can't find the image you need? <a href="/admin/images" class="text-[#39918c] hover:underline" target="_blank">Add it to the image library</a>
							</p>
						</div>
					</div>

					<div>
						<label for="description" class="block text-gray-700 font-medium mb-2">Description *</label>
						<textarea 
							id="description"
							bind:value={formData.description}
							required
							rows="3"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						></textarea>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label for="date" class="block text-gray-700 font-medium mb-2">Date *</label>
							<input 
								id="date"
								type="date" 
								bind:value={formData.date}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
						<div>
							<label for="time" class="block text-gray-700 font-medium mb-2">Time *</label>
							<input 
								id="time"
								type="time" 
								bind:value={formData.time}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
						<div>
							<label for="price" class="block text-gray-700 font-medium mb-2">Price (£) *</label>
							<input 
								id="price"
								type="number" 
								step="0.01"
								min="0"
								bind:value={formData.price}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
					</div>

					<div>
						<label for="capacity" class="block text-gray-700 font-medium mb-2">Capacity (number of children) *</label>
						<input 
							id="capacity"
							type="number" 
							min="1"
							bind:value={formData.capacity}
							required
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="emailInformation" class="block text-gray-700 font-medium mb-2">Email Information (for customers)</label>
						<textarea 
							id="emailInformation"
							bind:value={formData.emailInformation}
							rows="4"
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							placeholder="This information will be included in booking confirmation emails but will not be displayed on the website..."
						></textarea>
						<p class="text-sm text-gray-600 mt-2">
							This information will be emailed to customers when they book this activity. It will not be displayed on the public website.
						</p>
					</div>

					<div class="flex gap-4">
						<button 
							type="submit"
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Activity
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
			{#each activities as activity (activity.id)}
				<div class="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-[#39918c]">
					<div class="relative h-40 overflow-hidden">
						<img 
							src={activity.image} 
							alt={activity.title}
							class="w-full h-full object-cover"
							onerror={handleImageError}
						/>
					</div>
					
					<div class="p-6">
						<h3 class="text-xl font-bold text-[#39918c] mb-2">{activity.title}</h3>
						<p class="text-sm text-gray-700 mb-3 line-clamp-2">{activity.description}</p>
						
						<div class="space-y-1 text-sm text-gray-600 mb-4">
							<p><strong>Date:</strong> {formatDate(activity.date)}</p>
							<p><strong>Time:</strong> {activity.time}</p>
							<p><strong>Price:</strong> {formatPrice(activity.price)}</p>
							<p><strong>Capacity:</strong> {activity.capacity} children</p>
						</div>
						
						<div class="flex gap-2">
							<button 
								onclick={() => handleEdit(activity)}
								class="flex-1 bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium text-sm"
							>
								Edit
							</button>
							<button 
								onclick={async () => {
									if (confirm('Are you sure you want to delete this activity?')) {
										try {
											const response = await fetch('/api/admin/activities', {
												method: 'DELETE',
												headers: { 'Content-Type': 'application/json' },
												body: JSON.stringify({ id: activity.id })
											});
											if (response.ok) {
												await loadActivities();
												notify.success('Activity deleted successfully!');
											} else {
												notify.error('Failed to delete activity');
											}
										} catch (error) {
											console.error('Error deleting activity:', error);
											notify.error('Failed to delete activity');
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

		{#if activities.length === 0}
			<div class="text-center py-12 bg-white rounded-lg">
				<p class="text-xl text-gray-700">No activities yet. Add your first activity above!</p>
			</div>
		{/if}
	</div>
</section>


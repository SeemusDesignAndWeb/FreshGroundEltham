<script lang="js">
	import { onMount } from 'svelte';
	// Event and SiteImage types not needed in JavaScript
	import { notify } from '$lib/stores/notifications';
	import ImageSelector from '$lib/components/ImageSelector.svelte';

	let { data } = $props();
	let events = $state(data?.events || []);
	let editingId = $state(null);
	let showAddForm = $state(false);
	let images = $state([]);
	let formData = $state({
		title: '',
		description: '',
		image: '',
		date: '',
		time: '',
		endTime: '',
		recurring: []
	});
	let eventsSettings = $state({ hideFromHomePage: false });
	let showSettingsForm = $state(false);
	let selectedDays = $state([]);
	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	async function loadEvents() {
		try {
			const response = await fetch('/api/admin/events');
			if (response.ok) {
				const data = await response.json();
				events = data.events || [];
			}
		} catch (error) {
			console.error('Error loading events:', error);
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

	async function loadEventsSettings() {
		try {
			const response = await fetch('/api/admin/events/settings');
			if (response.ok) {
				const data = await response.json();
				eventsSettings = data.settings || { hideFromHomePage: false };
			}
		} catch (error) {
			console.error('Error loading events settings:', error);
		}
	}

	async function saveEventsSettings() {
		try {
			const response = await fetch('/api/admin/events/settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(eventsSettings)
			});
			if (!response.ok) throw new Error('Failed to save');
			showSettingsForm = false;
			notify.success('Events settings saved successfully!');
		} catch (error) {
			console.error('Error saving events settings:', error);
			notify.error('Failed to save events settings. Please try again.');
		}
	}

	onMount(() => {
		loadEvents();
		loadImages();
		loadEventsSettings();
	});

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}

	function handleEdit(event) {
		editingId = event.id;
		formData = { ...event };
		selectedDays = event.recurring || [];
		showAddForm = true;
	}

	function handleAdd() {
		formData = {
			title: '',
			description: '',
			image: '',
			date: '',
			time: '',
			endTime: '',
			recurring: []
		};
		selectedDays = [];
		editingId = null;
		showAddForm = true;
	}

	async function handleSave() {
		try {
			if (editingId) {
				const updateData = { 
					id: editingId, 
					...formData,
					recurring: selectedDays.length > 0 ? selectedDays : undefined
				};
				const response = await fetch('/api/admin/events', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updateData)
				});
				if (!response.ok) throw new Error('Failed to update');
				notify.success('Event updated successfully!');
			} else {
				const newEvent = {
					id: Date.now().toString(),
					title: formData.title || '',
					description: formData.description || '',
					image: formData.image || '/images/pastries.jpg',
					date: formData.date || '',
					time: formData.time || '',
					endTime: formData.endTime || undefined,
					recurring: selectedDays.length > 0 ? selectedDays : undefined
				};
				const response = await fetch('/api/admin/events', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newEvent)
				});
				if (!response.ok) throw new Error('Failed to add');
				notify.success('Event added successfully!');
			}
			await loadEvents();
			showAddForm = false;
			editingId = null;
		} catch (error) {
			console.error('Error saving event:', error);
			notify.error('Failed to save event. Please try again.');
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
			endTime: '',
			recurring: []
		};
		selectedDays = [];
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

	function formatTime(time24) {
		if (!time24) return '';
		const [hours, minutes] = time24.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'pm' : 'am';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	}
</script>

<svelte:head>
	<title>Manage Events - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage events" />
</svelte:head>

<!-- Events Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Events</h1>
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
					+ Add New Event
				</button>
			</div>
		</div>

		{#if showSettingsForm}
			<!-- Events Settings -->
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">Events Settings</h2>
				<div class="space-y-4">
					<div>
						<label class="flex items-center gap-3 cursor-pointer">
							<input 
								type="checkbox" 
								bind:checked={eventsSettings.hideFromHomePage}
								class="w-5 h-5 text-[#39918c] rounded focus:ring-2 focus:ring-[#39918c]"
							/>
							<span class="text-lg font-medium text-gray-700">Hide events from home page</span>
						</label>
						<p class="text-sm text-gray-600 mt-2 ml-8">
							When enabled, events will not appear in the hero slider on the home page. Events will still be visible on the events page.
						</p>
					</div>
					<div class="flex gap-4 pt-4">
						<button 
							onclick={saveEventsSettings}
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
					{editingId ? 'Edit Event' : 'Add New Event'}
				</h2>
				
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="title" class="block text-gray-700 font-medium mb-2">Event Title *</label>
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
							rows="4"
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
							<label for="time" class="block text-gray-700 font-medium mb-2">Start Time *</label>
							<input 
								id="time"
								type="time" 
								bind:value={formData.time}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
						<div>
							<label for="endTime" class="block text-gray-700 font-medium mb-2">End Time</label>
							<input 
								id="endTime"
								type="time" 
								bind:value={formData.endTime}
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
					</div>

					<div>
						<label class="block text-gray-700 font-medium mb-2">Recurring Days (optional)</label>
						<p class="text-sm text-gray-600 mb-3">Select days if this event repeats weekly. Leave empty for a one-time event.</p>
						<div class="flex flex-wrap gap-2">
							{#each daysOfWeek as day}
								<label class="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors {selectedDays.includes(day) ? 'bg-[#39918c] text-white border-[#39918c]' : ''}">
									<input 
										type="checkbox" 
										checked={selectedDays.includes(day)}
										onchange={(e) => {
											if (e.target.checked) {
												selectedDays = [...selectedDays, day];
											} else {
												selectedDays = selectedDays.filter(d => d !== day);
											}
										}}
										class="sr-only"
									/>
									<span class="text-sm font-medium">{day}</span>
								</label>
							{/each}
						</div>
						{#if selectedDays.length > 0}
							<p class="text-sm text-gray-600 mt-2">
								Event will repeat every: {selectedDays.join(', ')}
							</p>
						{/if}
					</div>

					<div class="flex gap-4">
						<button 
							type="submit"
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Event
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
			{#each events as event (event.id)}
				<div class="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-[#39918c]">
					<div class="relative h-40 overflow-hidden">
						<img 
							src={event.image} 
							alt={event.title}
							class="w-full h-full object-cover"
							onerror={handleImageError}
						/>
					</div>
					
					<div class="p-6">
						<h3 class="text-xl font-bold text-[#39918c] mb-2">{event.title}</h3>
						<p class="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
						
						<div class="space-y-1 text-sm text-gray-600 mb-4">
							{#if event.recurring && event.recurring.length > 0}
								<p><strong>Recurring:</strong> Every {event.recurring.join(', ')}</p>
							{:else}
								<p><strong>Date:</strong> {formatDate(event.date)}</p>
							{/if}
							<p><strong>Time:</strong> {formatTime(event.time)}{event.endTime ? ` - ${formatTime(event.endTime)}` : ''}</p>
						</div>
						
						<div class="flex gap-2">
							<button 
								onclick={() => handleEdit(event)}
								class="flex-1 bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium text-sm"
							>
								Edit
							</button>
							<button 
								onclick={async () => {
									if (confirm('Are you sure you want to delete this event?')) {
										try {
											const response = await fetch('/api/admin/events', {
												method: 'DELETE',
												headers: { 'Content-Type': 'application/json' },
												body: JSON.stringify({ id: event.id })
											});
											if (response.ok) {
												await loadEvents();
												notify.success('Event deleted successfully!');
											} else {
												notify.error('Failed to delete event');
											}
										} catch (error) {
											console.error('Error deleting event:', error);
											notify.error('Failed to delete event');
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

		{#if events.length === 0}
			<div class="text-center py-12 bg-white rounded-lg">
				<p class="text-xl text-gray-700">No events yet. Add your first event above!</p>
			</div>
		{/if}
	</div>
</section>


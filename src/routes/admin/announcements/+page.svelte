<script lang="js">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';

	let { data } = $props();
	let announcements = $state(data?.announcements || []);
	let editingId = $state(null);
	let showAddForm = $state(false);
	let formData = $state({
		title: '',
		description: '',
		visibleDate: '',
		visibleTime: '',
		endDate: '',
		endTime: ''
	});

	async function loadAnnouncements() {
		try {
			const response = await fetch('/api/admin/announcements');
			if (response.ok) {
				const data = await response.json();
				announcements = data.announcements || [];
			}
		} catch (error) {
			console.error('Error loading announcements:', error);
		}
	}

	onMount(() => {
		loadAnnouncements();
	});

	function handleEdit(announcement) {
		editingId = announcement.id;
		formData = { ...announcement };
		showAddForm = true;
	}

	function handleAdd() {
		formData = {
			title: '',
			description: '',
			visibleDate: '',
			visibleTime: '',
			endDate: '',
			endTime: ''
		};
		editingId = null;
		showAddForm = true;
	}

	function isAnnouncementActive(announcement) {
		const now = new Date();
		const visibleDateTime = new Date(`${announcement.visibleDate}T${announcement.visibleTime}`);
		
		if (now < visibleDateTime) return false;
		
		if (announcement.endDate && announcement.endTime) {
			const endDateTime = new Date(`${announcement.endDate}T${announcement.endTime}`);
			if (now > endDateTime) return false;
		} else if (announcement.endDate) {
			const endDate = new Date(announcement.endDate);
			endDate.setHours(23, 59, 59, 999);
			if (now > endDate) return false;
		}
		
		return true;
	}

	async function handleSave() {
		try {
			if (!formData.title || !formData.description || !formData.visibleDate || !formData.visibleTime) {
				notify.error('Please fill in all required fields.');
				return;
			}

			if (editingId) {
				const response = await fetch('/api/admin/announcements', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						action: 'update', 
						announcement: { id: editingId, ...formData }
					})
				});
				if (!response.ok) throw new Error('Failed to update');
				notify.success('Announcement updated successfully!');
			} else {
          const newAnnouncement = {
            id: Date.now().toString(),
					title: formData.title || '',
					description: formData.description || '',
					visibleDate: formData.visibleDate || '',
					visibleTime: formData.visibleTime || '',
					endDate: formData.endDate || undefined,
					endTime: formData.endTime || undefined
				};
				const response = await fetch('/api/admin/announcements', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'create', announcement: newAnnouncement })
				});
				if (!response.ok) throw new Error('Failed to add');
				notify.success('Announcement created successfully!');
			}
			await loadAnnouncements();
			showAddForm = false;
			editingId = null;
		} catch (error) {
			console.error('Error saving announcement:', error);
			notify.error('Failed to save announcement. Please try again.');
		}
	}

	function handleCancel() {
		showAddForm = false;
		editingId = null;
		formData = {
			title: '',
			description: '',
			visibleDate: '',
			visibleTime: '',
			endDate: '',
			endTime: ''
		};
	}

	async function handleDelete(id) {
		if (!confirm('Are you sure you want to delete this announcement?')) return;
		
		try {
			const response = await fetch('/api/admin/announcements', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', announcement: { id } })
			});
			if (!response.ok) throw new Error('Failed to delete');
			await loadAnnouncements();
			notify.success('Announcement deleted successfully!');
		} catch (error) {
			console.error('Error deleting announcement:', error);
			notify.error('Failed to delete announcement. Please try again.');
		}
	}

	function formatDateTime(date, time) {
		if (!date || !time) return '';
		const dateTime = new Date(`${date}T${time}`);
		return dateTime.toLocaleString('en-GB', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Manage Announcements - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage announcements" />
</svelte:head>

<!-- Announcements Management Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Manage Announcements</h1>
			<div class="space-x-4">
				<a href="/admin" class="inline-block bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors">
					← Back to Dashboard
				</a>
				{#if !showAddForm}
					<button 
						onclick={handleAdd}
						class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors"
					>
						+ Add Announcement
					</button>
				{/if}
			</div>
		</div>

		<!-- Add/Edit Form -->
		{#if showAddForm}
			<div class="bg-gray-50 rounded-lg p-8 mb-8 border-2 border-[#39918c]">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingId ? 'Edit Announcement' : 'Add New Announcement'}
				</h2>
				
				<div class="space-y-4">
					<div>
						<label for="announcement-title" class="block text-gray-700 font-medium mb-2">Title *</label>
						<input 
							id="announcement-title"
							type="text" 
							bind:value={formData.title}
							placeholder="e.g., Important Notice"
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							required
						/>
					</div>

					<div>
						<label for="announcement-description" class="block text-gray-700 font-medium mb-2">Description *</label>
						<textarea 
							id="announcement-description"
							bind:value={formData.description}
							rows="4"
							placeholder="Enter the announcement description..."
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							required
						></textarea>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="announcement-visible-date" class="block text-gray-700 font-medium mb-2">Visible Date *</label>
							<input 
								id="announcement-visible-date"
								type="date" 
								bind:value={formData.visibleDate}
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								required
							/>
							<p class="text-sm text-gray-500 mt-1">Date when announcement becomes visible (not shown on frontend)</p>
						</div>

						<div>
							<label for="announcement-visible-time" class="block text-gray-700 font-medium mb-2">Visible Time *</label>
							<input 
								id="announcement-visible-time"
								type="time" 
								bind:value={formData.visibleTime}
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								required
							/>
							<p class="text-sm text-gray-500 mt-1">Time when announcement becomes visible (not shown on frontend)</p>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="announcement-end-date" class="block text-gray-700 font-medium mb-2">End Date (Optional)</label>
							<input 
								id="announcement-end-date"
								type="date" 
								bind:value={formData.endDate}
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
							<p class="text-sm text-gray-500 mt-1">Date when announcement stops being visible (leave empty for indefinite)</p>
						</div>

						<div>
							<label for="announcement-end-time" class="block text-gray-700 font-medium mb-2">End Time (Optional)</label>
							<input 
								id="announcement-end-time"
								type="time" 
								bind:value={formData.endTime}
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
							<p class="text-sm text-gray-500 mt-1">Time when announcement stops being visible</p>
						</div>
					</div>

					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
						<p class="text-sm text-blue-800">
							<strong>Note:</strong> Announcements override both special offers and events when active. Only one announcement will be displayed at a time.
						</p>
					</div>

					<div class="flex gap-4 mt-6">
						<button 
							onclick={handleSave}
							class="bg-[#39918c] text-white px-6 py-2 rounded hover:bg-[#2f435a] transition-colors"
						>
							{editingId ? 'Update Announcement' : 'Create Announcement'}
						</button>
						<button 
							onclick={handleCancel}
							class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Announcements List -->
		<div class="space-y-4">
			{#if announcements.length === 0}
				<div class="text-center py-12 bg-gray-50 rounded-lg">
					<p class="text-xl text-gray-600">No announcements yet.</p>
					<p class="text-gray-500 mt-2">Click "Add Announcement" to create your first announcement!</p>
				</div>
			{:else}
				{#each announcements as announcement (announcement.id)}
					<div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<h3 class="text-2xl font-bold text-[#39918c]">{announcement.title}</h3>
									{#if isAnnouncementActive(announcement)}
										<span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
									{:else}
										<span class="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
											{(() => {
												const now = new Date();
												const visibleDateTime = new Date(`${announcement.visibleDate}T${announcement.visibleTime}`);
												return now < visibleDateTime ? 'Scheduled' : 'Expired';
											})()}
										</span>
									{/if}
								</div>
								<p class="text-gray-700 mb-3">{announcement.description}</p>
								<div class="text-sm text-gray-600 space-y-1">
									<p><strong>Visible from:</strong> {formatDateTime(announcement.visibleDate, announcement.visibleTime)}</p>
									{#if announcement.endDate}
										<p><strong>Visible until:</strong> {announcement.endTime ? formatDateTime(announcement.endDate, announcement.endTime) : new Date(announcement.endDate).toLocaleDateString('en-GB')}</p>
									{:else}
										<p class="text-gray-500 italic">No end date set (visible indefinitely until manually removed)</p>
									{/if}
								</div>
							</div>
							
							<div class="flex gap-2 ml-4">
								<button 
									onclick={() => handleEdit(announcement)}
									class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
								>
									Edit
								</button>
								<button 
									onclick={() => handleDelete(announcement.id)}
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


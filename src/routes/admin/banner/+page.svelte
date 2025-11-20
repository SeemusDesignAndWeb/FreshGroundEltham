<script lang="js">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';
	import BannerIcon from '$lib/components/BannerIcon.svelte';

	const availableIcons = [
		{ value: 'none', label: 'No Icon' },
		{ value: 'star', label: 'Star' },
		{ value: 'explosion', label: 'Explosion' },
		{ value: 'sparkle', label: 'Sparkle' },
		{ value: 'fire', label: 'Fire' },
		{ value: 'lightning', label: 'Lightning' },
		{ value: 'gift', label: 'Gift' },
		{ value: 'rocket', label: 'Rocket' },
		{ value: 'heart', label: 'Heart' },
		{ value: 'bell', label: 'Bell' },
		{ value: 'badge', label: 'Badge' }
	];

	let bannerMessage = $state('');
	let bannerEnabled = $state(false);
	let bannerIcon = $state('none');
	let bannerEndIcon = $state('none');
	let isSaving = $state(false);

	onMount(async () => {
		try {
			const response = await fetch('/api/banner');
			if (response.ok) {
				const data = await response.json();
				bannerMessage = data.message || '';
				bannerEnabled = data.enabled || false;
				bannerIcon = data.icon || 'none';
				bannerEndIcon = data.endIcon || data.icon || 'none';
			}
		} catch (error) {
			console.error('Error loading banner:', error);
			notify.error('Failed to load banner settings');
		}
	});

	async function handleSave() {
		isSaving = true;
		try {
			const response = await fetch('/api/banner', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: bannerMessage,
					enabled: bannerEnabled,
					icon: bannerIcon,
					endIcon: bannerEndIcon
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save banner settings');
			}

			notify.success('Banner settings saved successfully!');
		} catch (error) {
			console.error('Error saving banner:', error);
			notify.error('Failed to save banner settings. Please try again.');
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Banner Settings - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage banner message" />
</svelte:head>

<!-- Banner Settings Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Banner Message Settings</h1>
		
		<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-6">
				<!-- Enable/Disable Banner -->
				<div class="flex items-center gap-3">
					<input
						type="checkbox"
						id="enabled"
						bind:checked={bannerEnabled}
						class="w-5 h-5 text-[#39918c] border-gray-300 rounded focus:ring-[#39918c]"
					/>
					<label for="enabled" class="text-lg font-medium text-gray-700 cursor-pointer">
						Enable banner message
					</label>
				</div>

				<!-- Icon Selection -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label for="icon" class="block text-gray-700 font-medium mb-2">
							Start Icon
						</label>
						<div class="flex items-center gap-4">
							<select
								id="icon"
								bind:value={bannerIcon}
								class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] text-lg"
							>
								{#each availableIcons as iconOption}
									<option value={iconOption.value}>{iconOption.label}</option>
								{/each}
							</select>
							{#if bannerIcon && bannerIcon !== 'none'}
								<div class="bg-[#2f435a] p-3 rounded-lg">
									<BannerIcon icon={bannerIcon} size={24} />
								</div>
							{/if}
						</div>
					</div>
					<div>
						<label for="endIcon" class="block text-gray-700 font-medium mb-2">
							End Icon
						</label>
						<div class="flex items-center gap-4">
							<select
								id="endIcon"
								bind:value={bannerEndIcon}
								class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] text-lg"
							>
								{#each availableIcons as iconOption}
									<option value={iconOption.value}>{iconOption.label}</option>
								{/each}
							</select>
							{#if bannerEndIcon && bannerEndIcon !== 'none'}
								<div class="bg-[#2f435a] p-3 rounded-lg">
									<BannerIcon icon={bannerEndIcon} size={24} />
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Banner Message -->
				<div>
					<label for="message" class="block text-gray-700 font-medium mb-2">
						Banner Message
					</label>
					<input
						type="text"
						id="message"
						bind:value={bannerMessage}
						placeholder="e.g., Latest Deal: 20% off all coffee this week!"
						maxlength="100"
						class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] text-lg"
					/>
					<p class="text-sm text-gray-500 mt-2">
						{100 - bannerMessage.length} characters remaining
					</p>
				</div>

				<!-- Preview -->
				{#if bannerEnabled && bannerMessage}
					<div class="bg-[#2f435a] rounded-lg p-4">
						<p class="text-sm text-gray-400 mb-2">Preview:</p>
						<div class="bg-[#2f435a] py-2 px-4 border-b border-[#39918c]/30">
							<div class="max-w-7xl mx-auto flex justify-between items-center gap-4">
								<div class="flex-1 text-right">
									<p class="text-white text-sm font-medium inline-flex items-center gap-1.5">
										{#if bannerIcon && bannerIcon !== 'none'}
											<BannerIcon icon={bannerIcon} size={16} />
										{/if}
										{bannerMessage}
										{#if bannerEndIcon && bannerEndIcon !== 'none'}
											<BannerIcon icon={bannerEndIcon} size={16} />
										{/if}
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Save Button -->
				<div class="flex gap-4">
					<button
						type="submit"
						disabled={isSaving}
						class="bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? 'Saving...' : 'Save Banner Settings'}
					</button>
				</div>
			</form>
		</div>

		<!-- Info Box -->
		<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
			<h3 class="text-xl font-bold text-[#39918c] mb-3">About Banner Messages</h3>
			<ul class="space-y-2 text-gray-600">
				<li>• Banner messages appear in the top bar of the website</li>
				<li>• They're perfect for promotions, special offers, or announcements</li>
				<li>• The message will be displayed on the right side of the top bar</li>
				<li>• Maximum 100 characters recommended for best display</li>
			</ul>
		</div>
	</div>
</section>


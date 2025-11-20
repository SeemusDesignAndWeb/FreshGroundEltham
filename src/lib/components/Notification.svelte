<script lang="js">
	import { notifications, removeNotification } from '$lib/stores/notifications';
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<div class="fixed top-20 right-4 z-[200] flex flex-col gap-3 max-w-md w-full pointer-events-none">
		{#each $notifications as notification (notification.id)}
			<div
				class="pointer-events-auto bg-white rounded-lg shadow-xl border-2 p-4 animate-slide-in-right flex items-start gap-3 {notification.type === 'success' ? 'border-green-500' : notification.type === 'error' ? 'border-red-500' : notification.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}"
				role="alert"
			>
				<!-- Icon -->
				<div class="flex-shrink-0 mt-0.5">
					{#if notification.type === 'success'}
						<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					{:else if notification.type === 'error'}
						<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					{:else if notification.type === 'warning'}
						<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
						</svg>
					{:else}
						<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					{/if}
				</div>

				<!-- Message -->
				<div class="flex-1 min-w-0">
					<p class="text-gray-800 text-sm font-medium leading-relaxed whitespace-pre-line">
						{notification.message}
					</p>
				</div>

				<!-- Close Button -->
				<button
					onclick={() => removeNotification(notification.id)}
					class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close notification"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes slide-in-right {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in-right {
		animation: slide-in-right 0.3s ease-out;
	}
</style>


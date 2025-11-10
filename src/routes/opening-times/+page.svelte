<script lang="ts">
	import type { OpeningTimes } from '$lib/server/database';
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data }: { data: PageData } = $props();
	let openingTimes = $state<OpeningTimes | null>(data?.openingTimes || null);
	let backgroundImage = $state<string | null>(data?.backgroundImage || null);
</script>

<SEOHead />

<!-- Full Screen Opening Times Section -->
<div class="opening-times-container relative w-full h-screen flex items-center justify-center">
	{#if backgroundImage}
		<div 
			class="absolute inset-0 bg-cover bg-center"
			style="background-image: url('{backgroundImage}');"
		></div>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
	{:else}
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c] to-[#2f435a] z-10"></div>
	{/if}
	
	<div class="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
		{#if openingTimes}
			<h1 class="text-6xl md:text-7xl font-bold mb-8 drop-shadow-lg">Opening Times</h1>
			<div class="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">{openingTimes.days}</div>
			<div class="text-4xl md:text-5xl font-bold mb-8 drop-shadow-lg">{openingTimes.hours}</div>
			{#if openingTimes.closedDays}
				<p class="text-2xl md:text-3xl text-gray-100 drop-shadow-md mb-6">Closed: {openingTimes.closedDays}</p>
			{/if}
			{#if openingTimes.specialHours}
				<p class="text-xl md:text-2xl text-gray-100 drop-shadow-md italic mt-6">{openingTimes.specialHours}</p>
			{/if}
		{:else}
			<h1 class="text-6xl md:text-7xl font-bold mb-8 drop-shadow-lg">Opening Times</h1>
			<div class="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Wednesday to Saturday</div>
			<div class="text-4xl md:text-5xl font-bold mb-8 drop-shadow-lg">9:30 am to 2:00 pm</div>
			<p class="text-2xl md:text-3xl text-gray-100 drop-shadow-md">Closed: Sunday, Monday, and Tuesday</p>
		{/if}
	</div>
</div>

<style>
	.opening-times-container {
		min-height: 100vh;
		margin-top: -120px;
		padding-top: 120px;
	}
</style>

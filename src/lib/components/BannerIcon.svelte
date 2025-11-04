<script lang="ts">
	export let icon: string;
	export let size: number = 16;
	
	const icons: Record<string, string> = {
		star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
		explosion: 'M12 2L8 8l-6 1 4 4-1 6 6-4 6 4-1-6 4-4-6-1-4-6zM12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z',
		sparkle: 'M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM8 16l2 6 6-2-2-6-6 2z',
		fire: 'M12 2C8 6 6 10 6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-8-6-12zm0 18c-2.2 0-4-1.8-4-4 0-2.8 1.4-5.6 4-9 2.6 3.4 4 6.2 4 9 0 2.2-1.8 4-4 4z',
		lightning: 'M12 2l-2 8H4l6 4-2 8 10-8H12l2-12z',
		gift: 'M12 2v4H8c-1.1 0-2 .9-2 2v2H4v10h16V10h-2V8c0-1.1-.9-2-2-2h-4V2h-2zm0 6h4v2h-4V8zM8 8h4v2H8V8zm8 4H8v8h8v-8z',
		rocket: 'M12 2L8 6l-2 8 2 2 2 2 2-2 2-2 2-8-4-4zm0 4l2 2-2 2-2-2 2-2z',
		heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
		bell: 'M12 2c1.1 0 2 .9 2 2v1.29c3.89 1.15 6.75 4.57 6.75 8.71v4H3.25v-4c0-4.14 2.86-7.56 6.75-8.71V4c0-1.1.9-2 2-2zm0 18c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z',
		badge: 'M12 2L8 6l-4 2 2 4-2 4 4 2 4 4 4-4 4-2-2-4 2-4-4-2L12 2zm0 4l2 2-2 2-2-2 2-2z',
		none: ''
	};
</script>

{#if icon && icon !== 'none' && icons[icon]}
	<svg 
		class="inline-block align-middle" 
		width={size} 
		height={size} 
		viewBox="0 0 24 24" 
		fill="currentColor"
		style="color: white;"
	>
		<path d={icons[icon]} />
	</svg>
{/if}


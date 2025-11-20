<script lang="js">
	import { onMount } from 'svelte';
	// Testimonial type not needed in JavaScript

	let testimonials = $state([]);
	let currentIndex = $state(0);
	let interval;

	onMount(async () => {
		try {
			const response = await fetch('/api/testimonials');
			if (response.ok) {
				const data = await response.json();
				testimonials = data.testimonials || [];
			}
		} catch (error) {
			console.error('Error loading testimonials:', error);
		}

		// Auto-rotate testimonials every 5 seconds
		if (testimonials.length > 1) {
			interval = setInterval(() => {
				currentIndex = (currentIndex + 1) % testimonials.length;
			}, 5000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	});

	function goToTestimonial(index) {
		currentIndex = index;
		if (interval) {
			clearInterval(interval);
		}
		// Restart auto-rotation
		if (testimonials.length > 1) {
			interval = setInterval(() => {
				currentIndex = (currentIndex + 1) % testimonials.length;
			}, 5000);
		}
	}

	function renderStars(rating) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

{#if testimonials.length > 0}
	<div class="testimonial-carousel text-center max-w-4xl mx-auto py-12 relative overflow-hidden">
		<div class="testimonial-wrapper">
			{#each testimonials as testimonial, index}
				<div
					class="testimonial-slide {index === currentIndex ? 'active' : 'inactive'}"
				>
					<div class="mb-6">
						<div class="flex justify-center gap-2 mb-6">
							{#each renderStars(testimonial.rating) as filled}
								{#if filled}
									<svg class="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
									</svg>
								{:else}
									<svg class="w-8 h-8 text-yellow-400/30" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
									</svg>
								{/if}
							{/each}
						</div>
						<p class="text-2xl md:text-3xl lg:text-4xl italic mb-6 min-h-[120px] text-gray-800 leading-relaxed">"{testimonial.text}"</p>
						<p class="text-lg md:text-xl font-semibold text-[#39918c]">— {testimonial.name}</p>
					</div>
				</div>
			{/each}
		</div>

		{#if testimonials.length > 1}
			<div class="flex justify-center gap-2 mt-8">
				{#each testimonials as _, index}
					<button
						class="carousel-dot {index === currentIndex ? 'active' : ''}"
						onclick={() => goToTestimonial(index)}
						aria-label="Go to testimonial {index + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-center max-w-4xl mx-auto py-12">
		<p class="text-2xl text-gray-700">What our customers say</p>
		<p class="text-xl text-gray-500 mt-4">Check back soon for customer testimonials!</p>
	</div>
{/if}

<style>
	.testimonial-carousel {
		min-height: 300px;
	}

	.testimonial-wrapper {
		position: relative;
		min-height: 280px;
	}

	.testimonial-slide {
		position: absolute;
		width: 100%;
		transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
	}

	.testimonial-slide.active {
		opacity: 1;
		transform: translateX(0);
		z-index: 10;
	}

	.testimonial-slide.inactive {
		opacity: 0;
		transform: translateX(20px);
		z-index: 0;
		pointer-events: none;
	}

	.carousel-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid #39918c;
		background: transparent;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.carousel-dot.active {
		background: #39918c;
		width: 32px;
		border-radius: 6px;
	}

	.carousel-dot:hover {
		background: rgba(57, 145, 140, 0.5);
	}
</style>


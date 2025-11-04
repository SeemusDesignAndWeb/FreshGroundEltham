<script lang="ts">
	import { onMount } from 'svelte';
	import type { Testimonial } from '$lib/server/database';

	let testimonials = $state<Testimonial[]>([]);
	let editingTestimonialId = $state<string | null>(null);
	let showTestimonialForm = $state(false);
	let testimonialFormData = $state<Partial<Testimonial>>({
		name: '',
		text: '',
		rating: 5
	});

	async function loadTestimonials() {
		try {
			const response = await fetch('/api/admin/testimonials');
			if (response.ok) {
				const data = await response.json();
				testimonials = data.testimonials || [];
			}
		} catch (error) {
			console.error('Error loading testimonials:', error);
		}
	}

	onMount(() => {
		loadTestimonials();
	});

	function handleEditTestimonial(testimonial: Testimonial) {
		editingTestimonialId = testimonial.id;
		testimonialFormData = { ...testimonial };
		showTestimonialForm = true;
	}

	function handleAddTestimonial() {
		testimonialFormData = {
			name: '',
			text: '',
			rating: 5
		};
		editingTestimonialId = null;
		showTestimonialForm = true;
	}

	async function handleSaveTestimonial() {
		try {
			if (editingTestimonialId) {
				const response = await fetch('/api/admin/testimonials', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: editingTestimonialId, ...testimonialFormData })
				});
				if (!response.ok) throw new Error('Failed to update');
			} else {
				const newTestimonial: Testimonial = {
					id: Date.now().toString(),
					name: testimonialFormData.name || '',
					text: testimonialFormData.text || '',
					rating: testimonialFormData.rating || 5
				};
				const response = await fetch('/api/admin/testimonials', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newTestimonial)
				});
				if (!response.ok) throw new Error('Failed to add');
			}
			await loadTestimonials();
			showTestimonialForm = false;
			editingTestimonialId = null;
		} catch (error) {
			console.error('Error saving testimonial:', error);
			alert('Failed to save testimonial. Please try again.');
		}
	}

	function handleCancelTestimonial() {
		showTestimonialForm = false;
		editingTestimonialId = null;
		testimonialFormData = {
			name: '',
			text: '',
			rating: 5
		};
	}
</script>

<svelte:head>
	<title>Manage Testimonials - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="Manage customer testimonials" />
</svelte:head>

<!-- Testimonials Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Customer Testimonials</h1>
			<button 
				onclick={handleAddTestimonial}
				class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
			>
				+ Add New Testimonial
			</button>
		</div>

		{#if showTestimonialForm}
			<div class="bg-white rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<h2 class="text-2xl font-bold text-[#39918c] mb-6">
					{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
				</h2>
				
				<form onsubmit={(e) => { e.preventDefault(); handleSaveTestimonial(); }} class="space-y-4">
					<div>
						<label for="name" class="block text-gray-700 font-medium mb-2">Customer Name *</label>
						<input 
							id="name"
							type="text" 
							bind:value={testimonialFormData.name}
							required
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="text" class="block text-gray-700 font-medium mb-2">Testimonial Text *</label>
						<textarea 
							id="text"
							bind:value={testimonialFormData.text}
							required
							rows="4"
							placeholder="Enter the customer's testimonial here..."
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						></textarea>
					</div>

					<div>
						<label for="rating" class="block text-gray-700 font-medium mb-2">Rating (1-5 stars) *</label>
						<select
							id="rating"
							bind:value={testimonialFormData.rating}
							required
							class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						>
							<option value={5}>5 stars</option>
							<option value={4}>4 stars</option>
							<option value={3}>3 stars</option>
							<option value={2}>2 stars</option>
							<option value={1}>1 star</option>
						</select>
					</div>

					<div class="flex gap-4">
						<button 
							type="submit"
							class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
						>
							Save Testimonial
						</button>
						<button 
							type="button"
							onclick={handleCancelTestimonial}
							class="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each testimonials as testimonial (testimonial.id)}
				<div class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c]">
					<div class="flex justify-center gap-1 mb-3">
						{#each Array(testimonial.rating) as _}
							<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						{/each}
					</div>
					<p class="text-gray-700 italic mb-4 min-h-[80px]">"{testimonial.text}"</p>
					<p class="font-semibold text-[#39918c] mb-4">— {testimonial.name}</p>
					
					<div class="flex gap-2">
						<button 
							onclick={() => handleEditTestimonial(testimonial)}
							class="flex-1 bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium text-sm"
						>
							Edit
						</button>
						<button 
							onclick={async () => {
								if (confirm('Are you sure you want to delete this testimonial?')) {
									try {
										const response = await fetch('/api/admin/testimonials', {
											method: 'DELETE',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ id: testimonial.id })
										});
										if (response.ok) {
											await loadTestimonials();
										} else {
											alert('Failed to delete testimonial');
										}
									} catch (error) {
										console.error('Error deleting testimonial:', error);
										alert('Failed to delete testimonial');
									}
								}
							}}
							class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium text-sm"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>

		{#if testimonials.length === 0}
			<div class="text-center py-12 bg-white rounded-lg">
				<p class="text-xl text-gray-700">No testimonials yet. Add your first testimonial above!</p>
			</div>
		{/if}
	</div>
</section>


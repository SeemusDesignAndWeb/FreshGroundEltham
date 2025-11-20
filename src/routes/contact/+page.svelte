<script lang="js">
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data } = $props();
	let backgroundImage = $state(data?.backgroundImage || null);
	let formSubmitted = $state(false);
	let formError = $state(null);
	let isSubmitting = $state(false);
	let formStartTime = $state(Date.now());
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
		website: '' // Honeypot field - should remain empty
	});

	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		formError = null;
		isSubmitting = true;

		// Calculate form fill time
		const formFillTime = Date.now() - formStartTime;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					formFillTime // Include form fill time for spam detection
				})
			});

			const result = await response.json();

			if (result.success) {
				formSubmitted = true;
				// Reset form
				formData = {
					name: '',
					email: '',
					phone: '',
					subject: '',
					message: '',
					website: ''
				};
				formStartTime = Date.now(); // Reset timer for next submission
			} else {
				formError = result.message || 'Failed to send message. Please try again.';
			}
		} catch (error) {
			console.error('Error submitting contact form:', error);
			formError = 'Failed to send message. Please try again or contact us directly at coffeehouse@freshgroundeltham.co.uk';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
			<p class="text-xl text-gray-100">Get in touch with Fresh Ground</p>
		</div>
	</section>
</div>

<!-- Contact Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Contact Information -->
			<div class="space-y-6">
				<div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
					<h2 class="text-3xl font-bold text-[#39918c] mb-6">Visit Us</h2>
					<div class="space-y-4 text-gray-700">
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Address</h3>
							<p>542 Westhorne Avenue</p>
							<p>Eltham, London</p>
							<p>SE9 6DH</p>
						</div>
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Email</h3>
							<p>
								<a href="mailto:coffeehouse@freshgroundeltham.co.uk" class="text-[#39918c] hover:underline font-semibold">coffeehouse@freshgroundeltham.co.uk</a>
							</p>
						</div>
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Opening Hours</h3>
							<p>Wednesday to Saturday</p>
							<p class="font-semibold">9:30 am to 2:00 pm</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
					<h3 class="text-xl font-bold text-[#39918c] mb-3">Get Directions</h3>
					<p class="text-gray-700 mb-4">Find us easily using Google Maps or your preferred navigation app.</p>
					<a 
						href="https://www.google.com/maps/search/?api=1&query=542+Westhorne+Avenue+Eltham+London+SE9+6DH" 
						target="_blank"
						class="inline-block bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium shadow-lg"
					>
						Open in Google Maps →
					</a>
				</div>
			</div>

			<!-- Contact Form -->
			<div>
				{#if formSubmitted}
					<div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
						<div class="text-center">
							<svg class="w-16 h-16 text-[#39918c] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<h2 class="text-2xl font-bold text-[#39918c] mb-2">Message Sent!</h2>
							<p class="text-gray-700 mb-2">Thank you for your message. We'll get back to you as soon as possible.</p>
							<p class="text-sm text-gray-600">A confirmation email has been sent to your email address.</p>
						</div>
					</div>
				{:else}
					<div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
						<h2 class="text-3xl font-bold text-[#39918c] mb-6">Send us a Message</h2>
						
						{#if formError}
							<div class="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
								<p class="text-red-700 text-sm">{formError}</p>
							</div>
						{/if}

						<form onsubmit={handleSubmit} class="space-y-6 relative">
								<div>
									<label for="name" class="block text-gray-700 font-medium mb-2">Your Name *</label>
									<input 
										type="text" 
										id="name"
										bind:value={formData.name}
										required
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
									/>
								</div>

								<div>
									<label for="email" class="block text-gray-700 font-medium mb-2">Email Address *</label>
									<input 
										type="email" 
										id="email"
										bind:value={formData.email}
										required
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
									/>
								</div>

								<div>
									<label for="phone" class="block text-gray-700 font-medium mb-2">Phone Number</label>
									<input 
										type="tel" 
										id="phone"
										bind:value={formData.phone}
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
									/>
								</div>

								<div>
									<label for="subject" class="block text-gray-700 font-medium mb-2">Subject *</label>
									<input 
										type="text" 
										id="subject"
										bind:value={formData.subject}
										required
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
									/>
								</div>

								<div>
									<label for="message" class="block text-gray-700 font-medium mb-2">Message *</label>
									<textarea 
										id="message"
										bind:value={formData.message}
										rows="5"
										required
										maxlength="2000"
										class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
										placeholder="Your message..."
									></textarea>
									<p class="text-xs text-gray-500 mt-1">{formData.message.length}/2000 characters</p>
								</div>

								<!-- Honeypot field - hidden from users but visible to bots -->
								<div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
									<label for="website">Website (leave blank)</label>
									<input 
										type="text" 
										id="website"
										name="website"
										bind:value={formData.website}
										tabindex="-1"
										autocomplete="off"
									/>
								</div>

								<button 
									type="submit"
									disabled={isSubmitting}
									class="w-full bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{#if isSubmitting}
										Sending...
									{:else}
										Send Message
									{/if}
								</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>


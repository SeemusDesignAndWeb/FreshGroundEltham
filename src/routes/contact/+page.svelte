<script lang="ts">
	let formSubmitted = $state(false);
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	});

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		// In a real app, you would submit this to a server
		console.log('Contact form submitted:', formData);
		formSubmitted = true;
		// Reset form after 3 seconds
		setTimeout(() => {
			formSubmitted = false;
			formData = {
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: ''
			};
		}, 3000);
	}
</script>

<svelte:head>
	<title>Contact Us - Fresh Ground Eltham</title>
	<meta name="description" content="Contact Fresh Ground Eltham - 542 Westhorne Avenue, Eltham, London SE9 6DH. Phone: 07927 674097" />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/80 to-[#2f435a]/80 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
			<p class="text-xl text-gray-100">Get in touch with Fresh Ground</p>
		</div>
	</section>
</div>

<!-- Contact Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Contact Information -->
			<div class="space-y-6">
				<div class="bg-[#d0b49f] rounded-lg p-8 shadow-lg">
					<h2 class="text-3xl font-bold text-[#39918c] mb-6">Visit Us</h2>
					<div class="space-y-4 text-gray-700">
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Address</h3>
							<p>542 Westhorne Avenue</p>
							<p>Eltham, London</p>
							<p>SE9 6DH</p>
						</div>
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Phone</h3>
							<p>
								<a href="tel:07927674097" class="text-[#39918c] hover:underline font-semibold text-lg">07927 674097</a>
							</p>
						</div>
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Email</h3>
							<p>
								<a href="mailto:info@freshgroundeltham.co.uk" class="text-[#39918c] hover:underline font-semibold">info@freshgroundeltham.co.uk</a>
							</p>
						</div>
						<div>
							<h3 class="font-bold text-[#39918c] mb-2">Opening Hours</h3>
							<p>Wednesday to Saturday</p>
							<p class="font-semibold">9:30 am to 2:00 pm</p>
						</div>
					</div>
				</div>

				<div class="bg-gray-100 rounded-lg p-6">
					<h3 class="text-xl font-bold text-[#39918c] mb-3">Get Directions</h3>
					<p class="text-gray-700 mb-4">Find us easily using Google Maps or your preferred navigation app.</p>
					<a 
						href="https://www.google.com/maps/search/?api=1&query=542+Westhorne+Avenue+Eltham+London+SE9+6DH" 
						target="_blank"
						class="inline-block bg-[#39918c] text-white px-6 py-2 rounded hover:bg-[#ab6b51] transition-colors font-medium"
					>
						Open in Google Maps →
					</a>
				</div>
			</div>

			<!-- Contact Form -->
			<div>
				{#if formSubmitted}
					<div class="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
						<svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<h2 class="text-2xl font-bold text-green-700 mb-2">Message Sent!</h2>
						<p class="text-gray-700">Thank you for your message. We'll get back to you as soon as possible.</p>
					</div>
				{:else}
					<div class="bg-white border-2 border-[#39918c] rounded-lg p-8 shadow-lg">
						<h2 class="text-3xl font-bold text-[#39918c] mb-6">Send us a Message</h2>
						<form onsubmit={handleSubmit} class="space-y-6">
							<div>
								<label for="name" class="block text-gray-700 font-medium mb-2">Your Name *</label>
								<input 
									type="text" 
									id="name"
									bind:value={formData.name}
									required
									class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								/>
							</div>

							<div>
								<label for="email" class="block text-gray-700 font-medium mb-2">Email Address *</label>
								<input 
									type="email" 
									id="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								/>
							</div>

							<div>
								<label for="phone" class="block text-gray-700 font-medium mb-2">Phone Number</label>
								<input 
									type="tel" 
									id="phone"
									bind:value={formData.phone}
									class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								/>
							</div>

							<div>
								<label for="subject" class="block text-gray-700 font-medium mb-2">Subject *</label>
								<input 
									type="text" 
									id="subject"
									bind:value={formData.subject}
									required
									class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								/>
							</div>

							<div>
								<label for="message" class="block text-gray-700 font-medium mb-2">Message *</label>
								<textarea 
									id="message"
									bind:value={formData.message}
									rows="5"
									required
									class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
									placeholder="Your message..."
								></textarea>
							</div>

							<button 
								type="submit"
								class="w-full bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium text-lg shadow-lg"
							>
								Send Message
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>


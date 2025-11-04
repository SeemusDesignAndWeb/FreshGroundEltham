<script lang="ts">
	let formSubmitted = $state(false);
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		activity: '',
		date: '',
		time: '',
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
		console.log('Booking submitted:', formData);
		formSubmitted = true;
		// Reset form after 3 seconds
		setTimeout(() => {
			formSubmitted = false;
			formData = {
				name: '',
				email: '',
				phone: '',
				activity: '',
				date: '',
				time: '',
				message: ''
			};
		}, 3000);
	}
</script>

<svelte:head>
	<title>Kids Activities - Fresh Ground Eltham</title>
	<meta name="description" content="Book kids activities at Fresh Ground Eltham during half term and school holidays" />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Kids Activities</h1>
			<p class="text-xl text-gray-100">Book activities for children during half term and school holidays</p>
		</div>
	</section>
</div>

<!-- Booking Form Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-3xl mx-auto">
		{#if formSubmitted}
			<div class="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center mb-8">
				<svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<h2 class="text-2xl font-bold text-green-700 mb-2">Thank You!</h2>
				<p class="text-gray-700">Your booking request has been submitted. We'll be in touch soon.</p>
			</div>
		{:else}
			<div class="bg-[#d0b49f] rounded-lg p-8 shadow-lg mb-8">
				<h2 class="text-3xl font-bold text-[#39918c] mb-6 text-center">Kids Activities Booking Form</h2>
				<p class="text-gray-700 mb-8 text-center">
					We offer a variety of kids activities during half term and school holidays. Please fill out the form below to book a space for your child.
				</p>
				
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
						<label for="phone" class="block text-gray-700 font-medium mb-2">Phone Number *</label>
						<input 
							type="tel" 
							id="phone"
							bind:value={formData.phone}
							required
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						/>
					</div>

					<div>
						<label for="activity" class="block text-gray-700 font-medium mb-2">Activity Type *</label>
						<select 
							id="activity"
							bind:value={formData.activity}
							required
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
						>
							<option value="">Please select...</option>
							<option value="half-term">Half Term Activity</option>
							<option value="school-holiday">School Holiday Activity</option>
							<option value="workshop">Kids Workshop</option>
							<option value="craft">Craft Activity</option>
							<option value="story-time">Story Time</option>
							<option value="other">Other Activity</option>
						</select>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="date" class="block text-gray-700 font-medium mb-2">Preferred Date *</label>
							<input 
								type="date" 
								id="date"
								bind:value={formData.date}
								required
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>

						<div>
							<label for="time" class="block text-gray-700 font-medium mb-2">Preferred Time *</label>
							<input 
								type="time" 
								id="time"
								bind:value={formData.time}
								required
								class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							/>
						</div>
					</div>

					<div>
						<label for="message" class="block text-gray-700 font-medium mb-2">Additional Details</label>
						<textarea 
							id="message"
							bind:value={formData.message}
							rows="4"
							class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
							placeholder="Tell us more about the activity you're interested in, number of children, ages, etc..."
						></textarea>
					</div>

					<button 
						type="submit"
						class="w-full bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium text-lg shadow-lg"
					>
						Submit Booking Request
					</button>
				</form>
			</div>
		{/if}

		<!-- Contact Info -->
		<div class="bg-gray-100 rounded-lg p-6 text-center">
			<h3 class="text-xl font-bold text-[#39918c] mb-4">Need Immediate Assistance?</h3>
			<p class="text-gray-700 mb-2">Please contact us via email:</p>
			<a href="mailto:coffeehouse@freshgroundeltham.co.uk" class="text-[#39918c] hover:underline font-semibold">
				coffeehouse@freshgroundeltham.co.uk
			</a>
		</div>
	</div>
</section>


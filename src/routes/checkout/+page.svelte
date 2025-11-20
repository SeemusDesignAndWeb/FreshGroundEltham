<script lang="js">
	import { cart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	// CartItem type not needed in JavaScript
	import SEOHead from '$lib/components/SEOHead.svelte';

	let formData = $state({
		name: '',
		email: '',
		phone: ''
	});

	let errors = $state({});

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function getTotal() {
		return $cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	}

	function validateForm() {
		errors = {};
		if (!formData.name.trim()) errors.name = 'Required';
		if (!formData.email.trim()) errors.email = 'Required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
		if (!formData.phone.trim()) errors.phone = 'Required';
		return Object.keys(errors).length === 0;
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (validateForm()) {
			// Store booking data in sessionStorage for payment page
			sessionStorage.setItem('bookingData', JSON.stringify({
				...formData,
				cart: $cart,
				total: getTotal()
			}));
			goto('/payment');
		}
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Checkout</h1>
			<p class="text-xl text-gray-100">Complete your booking information</p>
		</div>
	</section>
</div>

<!-- Checkout Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Booking Form -->
			<div class="lg:col-span-2">
				<div class="bg-white rounded-lg p-8 shadow-lg border-2 border-[#39918c]">
					<h2 class="text-3xl font-bold text-[#39918c] mb-6">Booking Information</h2>
					
					<form onsubmit={handleSubmit} class="space-y-6">
						<div>
							<label for="name" class="block text-gray-700 font-medium mb-2">
								Full Name *
							</label>
							<input 
								type="text" 
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								class:border-red-500={errors.name}
							/>
							{#if errors.name}
								<p class="text-red-600 text-sm mt-1">{errors.name}</p>
							{/if}
						</div>

						<div>
							<label for="email" class="block text-gray-700 font-medium mb-2">
								Email Address *
							</label>
							<input 
								type="email" 
								id="email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								class:border-red-500={errors.email}
							/>
							{#if errors.email}
								<p class="text-red-600 text-sm mt-1">{errors.email}</p>
							{/if}
						</div>

						<div>
							<label for="phone" class="block text-gray-700 font-medium mb-2">
								Phone Number *
							</label>
							<input 
								type="tel" 
								id="phone"
								bind:value={formData.phone}
								required
								class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#39918c]"
								class:border-red-500={errors.phone}
							/>
							{#if errors.phone}
								<p class="text-red-600 text-sm mt-1">{errors.phone}</p>
							{/if}
						</div>

						<button 
							type="submit"
							class="w-full bg-[#39918c] text-white px-8 py-4 rounded hover:bg-[#ab6b51] transition-colors font-medium text-lg shadow-lg"
						>
							Continue to Payment
						</button>
					</form>
				</div>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-6 text-white sticky top-24">
					<h2 class="text-2xl font-bold mb-4">Order Summary</h2>
					<div class="space-y-3 mb-6">
						{#each $cart as item}
							<div class="border-b border-white/20 pb-3">
								<p class="font-semibold">{item.title}</p>
								<p class="text-sm text-gray-200">Qty: {item.quantity} × {formatPrice(item.price)}</p>
							</div>
						{/each}
					</div>
					<div class="border-t border-white/20 pt-4">
						<div class="flex justify-between items-center text-xl font-bold">
							<span>Total:</span>
							<span>{formatPrice(getTotal())}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

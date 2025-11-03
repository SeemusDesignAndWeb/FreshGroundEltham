<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, clearCart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';

	let bookingData = $state<any>(null);
	let processing = $state(false);
	let stripe: any = null;
	let elements: any = null;
	let paymentElement: any = null;
	let clientSecret = $state<string | null>(null);
	let stripeLoaded = $state(false);

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function getTotal() {
		if (!bookingData) return 0;
		return bookingData.total || 0;
	}

	onMount(async () => {
		const stored = sessionStorage.getItem('bookingData');
		if (!stored) {
			goto('/cart');
			return;
		}
		bookingData = JSON.parse(stored);

		// Load Stripe.js
		const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
		if (!stripePublishableKey) {
			console.error('Stripe publishable key not found');
			return;
		}

		// Load Stripe.js script
		const script = document.createElement('script');
		script.src = 'https://js.stripe.com/v3/';
		script.onload = async () => {
			const Stripe = (window as any).Stripe;
			stripe = Stripe(stripePublishableKey);

			// Create payment intent
			try {
				const response = await fetch('/api/create-payment-intent', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						amount: getTotal(),
						bookingData: bookingData
					})
				});

				const { clientSecret: secret, error } = await response.json();

				if (error) {
					console.error('Error creating payment intent:', error);
					alert('Failed to initialize payment. Please try again.');
					return;
				}

				clientSecret = secret;

				// Initialize Stripe Elements
				elements = stripe.elements({ clientSecret });
				paymentElement = elements.create('payment');
				paymentElement.mount('#payment-element');
				stripeLoaded = true;
			} catch (error) {
				console.error('Error setting up Stripe:', error);
				alert('Failed to load payment system. Please try again.');
			}
		};
		document.head.appendChild(script);
	});

	async function handlePayment() {
		if (!stripe || !elements || !clientSecret) {
			alert('Payment system not ready. Please wait.');
			return;
		}

		processing = true;

		try {
			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/booking-confirmation`
				},
				redirect: 'if_required'
			});

			if (error) {
				console.error('Payment error:', error);
				alert(error.message || 'Payment failed. Please try again.');
				processing = false;
				return;
			}

			if (paymentIntent && paymentIntent.status === 'succeeded') {
				// Payment successful
				const bookingId = `BK-${Date.now()}`;
				
				// Store booking confirmation
				sessionStorage.setItem('bookingConfirmation', JSON.stringify({
					bookingId,
					...bookingData,
					paymentMethod: 'card',
					paymentIntentId: paymentIntent.id,
					paidAt: new Date().toISOString()
				}));

				// Clear cart
				clearCart();

				// Redirect to confirmation
				goto('/booking-confirmation');
			}
		} catch (error: any) {
			console.error('Payment error:', error);
			alert('Payment failed. Please try again.');
			processing = false;
		}
	}
</script>

<svelte:head>
	<title>Payment - Fresh Ground Eltham</title>
	<meta name="description" content="Complete your payment" />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/80 to-[#2f435a]/80 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Payment</h1>
			<p class="text-xl text-gray-100">Complete your booking payment</p>
		</div>
	</section>
</div>

<!-- Payment Section -->
{#if bookingData}
	<section class="py-16 px-4 bg-white">
		<div class="max-w-4xl mx-auto">
			<div class="bg-[#d0b49f] rounded-lg p-8 shadow-lg border-2 border-[#39918c] mb-8">
				<h2 class="text-3xl font-bold text-[#39918c] mb-6">Payment Details</h2>
				
				{#if stripeLoaded && clientSecret}
					<div id="payment-element" class="mb-6">
						<!-- Stripe Elements will mount here -->
					</div>
				{:else}
					<div class="bg-white rounded-lg p-6 mb-6">
						<p class="text-gray-600 text-center">Loading payment form...</p>
					</div>
				{/if}

				<div class="bg-white rounded-lg p-6 mb-6">
					<div class="flex justify-between items-center">
						<span class="text-xl font-semibold text-gray-700">Total Amount:</span>
						<span class="text-2xl font-bold text-[#39918c]">{formatPrice(getTotal())}</span>
					</div>
				</div>
			</div>

			<div class="bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-8 text-white">
				<button 
					onclick={handlePayment}
					disabled={processing || !stripeLoaded}
					class="w-full bg-white text-[#39918c] px-8 py-4 rounded hover:bg-gray-100 transition-colors font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if processing}
						Processing Payment...
					{:else if !stripeLoaded}
						Loading Payment Form...
					{:else}
						Pay {formatPrice(getTotal())}
					{/if}
				</button>
				
				<p class="text-sm text-gray-200 text-center mt-4">
					Secured by Stripe. Your payment information is encrypted.
				</p>
			</div>
		</div>
	</section>
{/if}

<style>
	#payment-element {
		min-height: 200px;
	}
</style>

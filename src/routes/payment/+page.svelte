<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, clearCart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import SEOHead from '$lib/components/SEOHead.svelte';

	let bookingData = $state<any>(null);
	let paypalButtons: any = null;
	let paypalLoaded = $state(false);
	let orderId = $state<string | null>(null);
	let paypalClientId = $state<string | null>(null);
	let paypal: any = null;

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

		// Create PayPal order first
		try {
			const response = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: getTotal(),
					bookingData: bookingData
				})
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				const errorMessage = data.error || 'Failed to initialize payment';
				console.error('Error creating payment order:', errorMessage);
				alert(`Payment Error: ${errorMessage}\n\nPlease check your PayPal configuration or contact support.`);
				return;
			}

			const { orderId: id, clientId } = data;

			orderId = id;
			paypalClientId = clientId;

			if (!paypalClientId) {
				console.error('PayPal client ID not found');
				return;
			}

			// Load PayPal SDK (client-side only)
			if (!browser) {
				console.error('PayPal SDK can only be loaded in the browser');
				return;
			}

			// Dynamic import to avoid SSR issues
			const { loadScript } = await import('@paypal/paypal-js');
			
			paypal = await loadScript({
				clientId: paypalClientId,
				currency: 'GBP',
				locale: 'en_GB'
			});

			if (!paypal) {
				console.error('Failed to load PayPal SDK');
				return;
			}

			// Wait for the DOM element to be available
			const container = document.getElementById('paypal-button-container');
			if (!container) {
				console.error('PayPal button container not found in DOM');
				// Retry after a short delay
				setTimeout(() => {
					const retryContainer = document.getElementById('paypal-button-container');
					if (!retryContainer) {
						alert('Payment form failed to load. Please refresh the page.');
						return;
					}
					renderPayPalButtons(retryContainer);
				}, 100);
				return;
			}

			renderPayPalButtons(container);
		} catch (error) {
			console.error('Error setting up PayPal:', error);
			alert('Failed to load payment system. Please try again.');
		}
	});

	function renderPayPalButtons(container: HTMLElement) {
		if (!paypal || !paypal.Buttons || !orderId) {
			console.error('PayPal SDK or order ID not available');
			return;
		}

		paypalButtons = paypal.Buttons({
			createOrder: async () => {
				return orderId;
			},
			onApprove: async (data: any) => {
				try {
					// Capture the payment
					const response = await fetch('/api/capture-payment', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ orderId: data.orderID })
					});

					const result = await response.json();

					if (result.success) {
						// Payment successful
						const bookingId = `BK-${Date.now()}`;
						
						// Store booking confirmation
						sessionStorage.setItem('bookingConfirmation', JSON.stringify({
							bookingId,
							...bookingData,
							paymentMethod: 'PayPal',
							transactionId: data.orderID,
							paidAt: new Date().toISOString()
						}));

						// Clear cart
						clearCart();

						// Redirect to confirmation
						goto('/booking-confirmation');
					} else {
						alert('Payment failed. Please try again.');
					}
				} catch (error) {
					console.error('Error capturing payment:', error);
					alert('Payment failed. Please try again.');
				}
			},
			onError: (err: any) => {
				console.error('PayPal error:', err);
				alert('An error occurred with PayPal. Please try again.');
			},
			style: {
				layout: 'vertical',
				color: 'gold',
				shape: 'rect',
				label: 'pay'
			}
		});

		paypalButtons.render(container).then(() => {
			paypalLoaded = true;
		}).catch((err: any) => {
			console.error('Error rendering PayPal buttons:', err);
			alert('Failed to load payment buttons. Please refresh the page.');
		});
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Payment</h1>
			<p class="text-xl text-gray-100">Complete your booking payment</p>
		</div>
	</section>
</div>

<!-- Payment Section -->
{#if bookingData}
	<section class="py-16 px-4 bg-white relative z-0">
		<div class="max-w-6xl mx-auto">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Payment Form -->
				<div class="lg:col-span-2">
					<div class="bg-white rounded-lg p-8 shadow-lg border-2 border-[#39918c]">
						<h2 class="text-3xl font-bold text-[#39918c] mb-6">Payment Details</h2>
						
						<div class="bg-white rounded-lg p-6 mb-6">
							<!-- Always render container so PayPal can attach to it -->
							<div id="paypal-button-container" class="min-h-[150px]">
								{#if !paypalLoaded || !orderId}
									<div class="text-center py-8">
										<p class="text-gray-600">Loading payment options...</p>
									</div>
								{/if}
							</div>
						</div>

						<div class="bg-white rounded-lg p-4 border border-gray-200">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-[#39918c] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
								</svg>
								<div>
									<p class="text-sm font-semibold text-gray-700 mb-1">
										Secured by PayPal
									</p>
									<p class="text-xs text-gray-600">
										Your payment information is encrypted and secure. You can pay with your PayPal account or use a credit/debit card.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Booking Summary -->
				<div class="lg:col-span-1">
					<div class="bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-6 text-white sticky top-24">
						<h2 class="text-2xl font-bold mb-4">Booking Summary</h2>
						
						<!-- Contact Details -->
						<div class="mb-6 pb-4 border-b border-white/20">
							<h3 class="text-lg font-semibold mb-3">Contact Information</h3>
							<div class="space-y-2 text-sm">
								<p><span class="font-medium">Name:</span> {bookingData.name}</p>
								<p><span class="font-medium">Email:</span> {bookingData.email}</p>
								<p><span class="font-medium">Phone:</span> {bookingData.phone}</p>
							</div>
						</div>

						<!-- Activities -->
						<div class="mb-6 pb-4 border-b border-white/20">
							<h3 class="text-lg font-semibold mb-3">Activities</h3>
							<div class="space-y-3">
								{#each bookingData.cart as item}
									<div class="border-b border-white/10 pb-3 last:border-0">
										<p class="font-semibold text-sm">{item.title}</p>
										<p class="text-xs text-gray-200">Qty: {item.quantity} × {formatPrice(item.price)}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Total -->
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
{/if}

<style>
	#paypal-button-container {
		min-height: 150px;
		position: relative;
		z-index: 0;
	}
	
	/* Ensure PayPal iframes and elements don't go above navbar */
	#paypal-button-container iframe,
	#paypal-button-container > div {
		position: relative !important;
		z-index: 0 !important;
	}
</style>

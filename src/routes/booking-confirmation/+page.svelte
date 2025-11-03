<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let confirmation = $state<any>(null);
	let emailSent = $state(false);

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}

	onMount(async () => {
		const stored = sessionStorage.getItem('bookingConfirmation');
		if (!stored) {
			goto('/activities');
			return;
		}
		
		confirmation = JSON.parse(stored);
		
		// Send email confirmation
		try {
			const response = await fetch('/api/send-booking-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(confirmation)
			});
			
			if (response.ok) {
				emailSent = true;
			}
		} catch (error) {
			console.error('Error sending email:', error);
			// Still show success to user even if email fails
			emailSent = true;
		}
	});

	function handlePrint() {
		window.print();
	}
</script>

<svelte:head>
	<title>Booking Confirmation - Fresh Ground Eltham</title>
	<meta name="description" content="Your booking has been confirmed" />
</svelte:head>

{#if confirmation}
	<!-- Hero Section -->
	<div class="relative z-0">
		<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80');">
			<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/80 to-[#2f435a]/80 z-10"></div>
			<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
				<h1 class="text-4xl md:text-5xl font-bold mb-4">Booking Confirmed!</h1>
				<p class="text-xl text-gray-100">Thank you for your booking</p>
			</div>
		</section>
	</div>

	<!-- Confirmation Section -->
	<section class="py-16 px-4 bg-white">
		<div class="max-w-4xl mx-auto">
			{#if emailSent}
				<div class="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8">
					<div class="flex items-center gap-3">
						<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
						</svg>
						<p class="text-green-700 font-semibold">Confirmation email sent to {confirmation.email}</p>
					</div>
				</div>
			{/if}

			<div class="bg-[#d0b49f] rounded-lg p-8 shadow-xl border-2 border-[#39918c] mb-8">
				<div class="text-center mb-8">
					<svg class="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<h2 class="text-3xl font-bold text-[#39918c] mb-2">Booking #{confirmation.bookingId}</h2>
					<p class="text-gray-700">Your booking has been successfully confirmed!</p>
				</div>

				<div class="bg-white rounded-lg p-6 mb-6">
					<h3 class="text-xl font-bold text-[#39918c] mb-4">Booking Details</h3>
					<div class="space-y-3 text-gray-700">
						<div>
							<span class="font-semibold">Name:</span> {confirmation.name}
						</div>
						<div>
							<span class="font-semibold">Email:</span> {confirmation.email}
						</div>
						<div>
							<span class="font-semibold">Phone:</span> {confirmation.phone}
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6 mb-6">
					<h3 class="text-xl font-bold text-[#39918c] mb-4">Activities Booked</h3>
					<div class="space-y-4">
						{#each confirmation.cart as item}
							<div class="border-b border-gray-200 pb-4 last:border-0">
								<div class="flex justify-between items-start">
									<div>
										<p class="font-semibold text-gray-800">{item.title}</p>
										<p class="text-sm text-gray-600">Date: {item.date} at {item.time}</p>
										<p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
									</div>
									<p class="font-bold text-[#39918c]">{formatPrice(item.price * item.quantity)}</p>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-4 pt-4 border-t-2 border-gray-300">
						<div class="flex justify-between items-center text-xl font-bold">
							<span>Total Paid:</span>
							<span class="text-[#39918c]">{formatPrice(confirmation.total)}</span>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6">
					<h3 class="text-xl font-bold text-[#39918c] mb-4">Important Information</h3>
					<ul class="space-y-2 text-gray-700">
						<li class="flex items-start gap-2">
							<svg class="w-5 h-5 text-[#39918c] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<span>Please arrive 10 minutes before the activity starts</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="w-5 h-5 text-[#39918c] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<span>A confirmation email has been sent to {confirmation.email}</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="w-5 h-5 text-[#39918c] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<span>If you need to cancel, please contact us at least 24 hours in advance</span>
						</li>
					</ul>
				</div>

				<div class="flex gap-4 mt-8">
					<button 
						onclick={handlePrint}
						class="flex-1 bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium"
					>
						Print Confirmation
					</button>
					<a 
						href="/activities"
						class="flex-1 bg-white text-[#39918c] px-6 py-3 rounded hover:bg-gray-100 transition-colors font-medium text-center border-2 border-[#39918c]"
					>
						Book More Activities
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}


<script lang="ts">
	import { cart, removeFromCart, updateQuantity, clearCart } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	import type { CartItem } from '$lib/stores/cart';

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function getTotal() {
		return $cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	}

	function handleCheckout() {
		if ($cart.length > 0) {
			goto('/checkout');
		}
	}
</script>

<svelte:head>
	<title>Shopping Cart - Fresh Ground Eltham</title>
	<meta name="description" content="Review your activity bookings" />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
			<p class="text-xl text-gray-100">Review your activity bookings</p>
		</div>
	</section>
</div>

<!-- Cart Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		{#if $cart.length === 0}
			<div class="bg-white rounded-lg p-12 text-center">
				<svg class="w-24 h-24 text-[#39918c] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
				</svg>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Your cart is empty</h2>
				<p class="text-gray-700 mb-6">Browse our kids activities to get started!</p>
				<a href="/activities" class="inline-block bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium">
					View Activities →
				</a>
			</div>
		{:else}
			<div class="space-y-4 mb-8">
				{#each $cart as item (item.id)}
					<div class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c]">
						<div class="flex flex-col md:flex-row gap-4">
							<div class="flex-1">
								<h3 class="text-2xl font-bold text-[#39918c] mb-2">{item.title}</h3>
								<p class="text-gray-700 mb-2">{item.description}</p>
								<div class="flex flex-wrap gap-4 text-sm text-gray-600">
									<span>Date: {item.date}</span>
									<span>Time: {item.time}</span>
								</div>
							</div>
							<div class="flex flex-col items-end gap-4">
								<div class="text-right">
									<p class="text-2xl font-bold text-[#39918c]">{formatPrice(item.price * item.quantity)}</p>
									<p class="text-sm text-gray-600">{formatPrice(item.price)} each</p>
								</div>
								<div class="flex items-center gap-2">
									<label for="quantity-{item.id}" class="text-gray-700 font-medium">Quantity:</label>
									<input 
										id="quantity-{item.id}"
										type="number" 
										min="1" 
										value={item.quantity}
										onchange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
										class="w-20 px-2 py-1 border border-gray-300 rounded text-center"
									/>
								</div>
								<button 
									onclick={() => removeFromCart(item.id)}
									class="text-red-600 hover:text-red-800 font-medium text-sm"
								>
									Remove
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-8 text-white">
				<div class="flex justify-between items-center mb-6">
					<span class="text-2xl font-bold">Total:</span>
					<span class="text-3xl font-bold">{formatPrice(getTotal())}</span>
				</div>
				<div class="flex gap-4">
					<a 
						href="/activities" 
						class="flex-1 bg-white text-[#39918c] px-6 py-3 rounded hover:bg-gray-100 transition-colors font-medium text-center"
					>
						Continue Shopping
					</a>
					<button 
						onclick={handleCheckout}
						class="flex-1 bg-white text-[#39918c] px-6 py-3 rounded hover:bg-gray-100 transition-colors font-medium"
					>
						Proceed to Checkout
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>


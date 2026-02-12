<script lang="js">
	import { onMount } from 'svelte';
	import { notify } from '$lib/stores/notifications';

	let bookings = $state([]);
	let loading = $state(true);
	let searchTerm = $state('');
	let selectedBooking = $state(null);

	async function loadBookings() {
		loading = true;
		try {
			const response = await fetch('/api/admin/bookings');
			if (response.ok) {
				const data = await response.json();
				bookings = data.bookings || [];
			} else {
				notify.error('Failed to load bookings');
			}
		} catch (error) {
			console.error('Error loading bookings:', error);
			notify.error('Failed to load bookings');
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadBookings();
	});

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	function formatDateTime(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleString('en-GB', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatTime(time24) {
		if (!time24) return '';
		const [hours, minutes] = time24.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'pm' : 'am';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes}${ampm}`;
	}

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getFilteredBookings() {
		if (!searchTerm.trim()) return bookings;
		const term = searchTerm.toLowerCase();
		return bookings.filter(booking => 
			booking.name?.toLowerCase().includes(term) ||
			booking.email?.toLowerCase().includes(term) ||
			booking.phone?.toLowerCase().includes(term) ||
			booking.id?.toLowerCase().includes(term) ||
			booking.transactionId?.toLowerCase().includes(term)
		);
	}

	function getTotalRevenue() {
		return bookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
	}

	function viewBookingDetails(booking) {
		selectedBooking = booking;
	}

	function closeDetails() {
		selectedBooking = null;
	}
</script>

<svelte:head>
	<title>Bookings - Admin - Fresh Ground Eltham</title>
	<meta name="description" content="View all bookings" />
</svelte:head>

<!-- Bookings Management Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-4xl font-bold text-[#39918c]">Bookings</h1>
			<div class="flex gap-4 items-center">
				<a href="/admin" class="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors">
					← Back to Dashboard
				</a>
				<button 
					onclick={loadBookings}
					class="bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors"
				>
					↻ Refresh
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-6 text-white">
				<h3 class="text-lg font-medium opacity-90">Total Bookings</h3>
				<p class="text-4xl font-bold mt-2">{bookings.length}</p>
			</div>
			<div class="bg-gradient-to-r from-[#ff8c42] to-[#ab6b51] rounded-lg p-6 text-white">
				<h3 class="text-lg font-medium opacity-90">Total Revenue</h3>
				<p class="text-4xl font-bold mt-2">{formatPrice(getTotalRevenue())}</p>
			</div>
			<div class="bg-gradient-to-r from-[#2f435a] to-[#39918c] rounded-lg p-6 text-white">
				<h3 class="text-lg font-medium opacity-90">Avg. Booking Value</h3>
				<p class="text-4xl font-bold mt-2">{bookings.length > 0 ? formatPrice(getTotalRevenue() / bookings.length) : '£0.00'}</p>
			</div>
		</div>

		<!-- Search -->
		<div class="mb-6">
			<input 
				type="text" 
				placeholder="Search by name, email, phone, booking ID, or transaction ID..."
				bind:value={searchTerm}
				class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-transparent"
			/>
		</div>

		<!-- Bookings Table -->
		{#if loading}
			<div class="text-center py-12">
				<p class="text-xl text-gray-600">Loading bookings...</p>
			</div>
		{:else if getFilteredBookings().length === 0}
			<div class="text-center py-12 bg-gray-50 rounded-lg">
				{#if searchTerm}
					<p class="text-xl text-gray-600">No bookings found matching "{searchTerm}"</p>
					<button 
						onclick={() => searchTerm = ''}
						class="mt-4 text-[#39918c] hover:underline"
					>
						Clear search
					</button>
				{:else}
					<p class="text-xl text-gray-600">No bookings yet.</p>
					<p class="text-gray-500 mt-2">Bookings will appear here when customers complete payments.</p>
				{/if}
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-[#39918c] text-white">
							<tr>
								<th class="px-4 py-3 text-left font-semibold">Booking ID</th>
								<th class="px-4 py-3 text-left font-semibold">Customer</th>
								<th class="px-4 py-3 text-left font-semibold">Activities</th>
								<th class="px-4 py-3 text-right font-semibold">Total</th>
								<th class="px-4 py-3 text-left font-semibold">Date</th>
								<th class="px-4 py-3 text-center font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each getFilteredBookings() as booking (booking.id)}
								<tr class="border-b border-gray-200 hover:bg-gray-50">
									<td class="px-4 py-4">
										<span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{booking.id}</span>
									</td>
									<td class="px-4 py-4">
										<div>
											<p class="font-semibold text-gray-800">{booking.name}</p>
											<p class="text-sm text-gray-600">{booking.email}</p>
											{#if booking.phone}
												<p class="text-sm text-gray-500">{booking.phone}</p>
											{/if}
										</div>
									</td>
									<td class="px-4 py-4">
										<div class="space-y-1">
											{#each (booking.cart || []).slice(0, 2) as item}
												<p class="text-sm text-gray-700">{item.title} x{item.quantity}</p>
											{/each}
											{#if (booking.cart || []).length > 2}
												<p class="text-xs text-gray-500">+{booking.cart.length - 2} more...</p>
											{/if}
										</div>
									</td>
									<td class="px-4 py-4 text-right">
										<span class="font-bold text-[#39918c]">{formatPrice(booking.total || 0)}</span>
									</td>
									<td class="px-4 py-4">
										<p class="text-sm text-gray-700">{formatDateTime(booking.paidAt)}</p>
									</td>
									<td class="px-4 py-4 text-center">
										<button 
											onclick={() => viewBookingDetails(booking)}
											class="bg-[#39918c] text-white px-4 py-2 rounded hover:bg-[#2f435a] transition-colors text-sm"
										>
											View Details
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Booking Details Modal -->
{#if selectedBooking}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick={closeDetails}>
		<div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick={(e) => e.stopPropagation()}>
			<div class="bg-[#39918c] text-white p-6 rounded-t-lg">
				<div class="flex justify-between items-center">
					<h2 class="text-2xl font-bold">Booking Details</h2>
					<button onclick={closeDetails} class="text-white hover:text-gray-200 text-2xl">&times;</button>
				</div>
				<p class="text-white/80 mt-1 font-mono">{selectedBooking.id}</p>
			</div>
			
			<div class="p-6 space-y-6">
				<!-- Customer Info -->
				<div>
					<h3 class="text-lg font-bold text-[#39918c] mb-3">Customer Information</h3>
					<div class="bg-gray-50 rounded-lg p-4 space-y-2">
						<p><span class="font-semibold">Name:</span> {selectedBooking.name}</p>
						<p><span class="font-semibold">Email:</span> <a href="mailto:{selectedBooking.email}" class="text-[#39918c] hover:underline">{selectedBooking.email}</a></p>
						{#if selectedBooking.phone}
							<p><span class="font-semibold">Phone:</span> <a href="tel:{selectedBooking.phone}" class="text-[#39918c] hover:underline">{selectedBooking.phone}</a></p>
						{/if}
					</div>
				</div>

				<!-- Activities Booked -->
				<div>
					<h3 class="text-lg font-bold text-[#39918c] mb-3">Activities Booked</h3>
					<div class="space-y-3">
						{#each (selectedBooking.cart || []) as item}
							<div class="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
								<div>
									<p class="font-semibold text-gray-800">{item.title}</p>
									{#if item.date}
										<p class="text-sm text-gray-600">{formatDate(item.date)}</p>
									{/if}
									{#if item.time}
										<p class="text-sm text-gray-600">{formatTime(item.time)}{item.endTime ? ` - ${formatTime(item.endTime)}` : ''}</p>
									{/if}
									<p class="text-sm text-gray-500">Quantity: {item.quantity}</p>
								</div>
								<div class="text-right">
									<p class="text-sm text-gray-500">{formatPrice(item.price)} each</p>
									<p class="font-bold text-[#39918c]">{formatPrice(item.price * item.quantity)}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Payment Info -->
				<div>
					<h3 class="text-lg font-bold text-[#39918c] mb-3">Payment Information</h3>
					<div class="bg-gray-50 rounded-lg p-4 space-y-2">
						<div class="flex justify-between">
							<span class="font-semibold">Total Paid:</span>
							<span class="text-xl font-bold text-[#39918c]">{formatPrice(selectedBooking.total || 0)}</span>
						</div>
						<p><span class="font-semibold">Payment Method:</span> {selectedBooking.paymentMethod || 'PayPal'}</p>
						<p><span class="font-semibold">Transaction ID:</span> <span class="font-mono text-sm">{selectedBooking.transactionId}</span></p>
						<p><span class="font-semibold">Paid At:</span> {formatDateTime(selectedBooking.paidAt)}</p>
						{#if selectedBooking.status}
							<p><span class="font-semibold">Status:</span> 
								<span class="inline-block px-2 py-1 rounded text-xs font-semibold {selectedBooking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
									{selectedBooking.status}
								</span>
							</p>
						{/if}
					</div>
				</div>

				<!-- PayPal Payer Info -->
				{#if selectedBooking.payer}
					<div>
						<h3 class="text-lg font-bold text-[#39918c] mb-3">PayPal Payer Info</h3>
						<div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
							{#if selectedBooking.payer.email_address}
								<p><span class="font-semibold">PayPal Email:</span> {selectedBooking.payer.email_address}</p>
							{/if}
							{#if selectedBooking.payer.payer_id}
								<p><span class="font-semibold">Payer ID:</span> <span class="font-mono">{selectedBooking.payer.payer_id}</span></p>
							{/if}
							{#if selectedBooking.payer.name}
								<p><span class="font-semibold">PayPal Name:</span> {selectedBooking.payer.name.given_name} {selectedBooking.payer.name.surname}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<div class="p-6 bg-gray-50 rounded-b-lg">
				<button 
					onclick={closeDetails}
					class="w-full bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#2f435a] transition-colors font-medium"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

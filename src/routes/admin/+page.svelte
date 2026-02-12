<script lang="js">
	import { onMount } from 'svelte';

	let activitiesCount = $state(0);
	let eventsCount = $state(0);
	let testimonialsCount = $state(0);
	let menuItemsCount = $state(0);
	let imagesCount = $state(0);
	let specialOffersCount = $state(0);
	let announcementsCount = $state(0);
	let bookingsCount = $state(0);
	let bookingsTotal = $state(0);

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(price);
	}

	onMount(async () => {
		try {
			const [activitiesRes, eventsRes, testimonialsRes, menuRes, imagesRes, offersRes, announcementsRes, bookingsRes] = await Promise.all([
				fetch('/api/admin/activities'),
				fetch('/api/admin/events'),
				fetch('/api/admin/testimonials'),
				fetch('/api/admin/menu'),
				fetch('/api/admin/images'),
				fetch('/api/admin/special-offers'),
				fetch('/api/admin/announcements'),
				fetch('/api/admin/bookings')
			]);

			if (activitiesRes.ok) {
				const data = await activitiesRes.json();
				activitiesCount = data.activities?.length || 0;
			}
			if (eventsRes.ok) {
				const data = await eventsRes.json();
				eventsCount = data.events?.length || 0;
			}
			if (testimonialsRes.ok) {
				const data = await testimonialsRes.json();
				testimonialsCount = data.testimonials?.length || 0;
			}
			if (menuRes.ok) {
				const data = await menuRes.json();
				menuItemsCount = data.menuItems?.length || 0;
			}
			if (imagesRes.ok) {
				const data = await imagesRes.json();
				imagesCount = data.images?.length || 0;
			}
			if (offersRes.ok) {
				const data = await offersRes.json();
				specialOffersCount = data.offers?.length || 0;
			}
			if (announcementsRes.ok) {
				const data = await announcementsRes.json();
				announcementsCount = data.announcements?.length || 0;
			}
			if (bookingsRes.ok) {
				const data = await bookingsRes.json();
				bookingsCount = data.bookings?.length || 0;
				bookingsTotal = data.bookings?.reduce((sum, b) => sum + (b.total || 0), 0) || 0;
			}
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		}
	});
</script>

<svelte:head>
	<title>Admin Dashboard - Fresh Ground Eltham</title>
	<meta name="description" content="Admin dashboard" />
</svelte:head>

<!-- Dashboard Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-7xl mx-auto">
		<h1 class="text-4xl font-bold text-[#39918c] mb-8">Admin Dashboard</h1>
		
		<!-- Bookings Highlight -->
		<a href="/admin/bookings" class="block bg-gradient-to-r from-[#39918c] to-[#2f435a] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow mb-8">
			<div class="flex items-center justify-between text-white">
				<div>
					<h2 class="text-2xl font-bold mb-2">Bookings & Payments</h2>
					<p class="text-white/80">View all customer bookings and payment history</p>
				</div>
				<div class="text-right">
					<p class="text-4xl font-bold">{bookingsCount}</p>
					<p class="text-white/80">Total: {formatPrice(bookingsTotal)}</p>
				</div>
			</div>
		</a>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
			<a href="/admin/announcements" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#ff8c42] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#ff8c42]">Announcements</h2>
					<svg class="w-8 h-8 text-[#ff8c42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{announcementsCount}</p>
				<p class="text-gray-600">Homepage announcements</p>
			</a>
			
			<a href="/admin/special-offers" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#ab6b51] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#ab6b51]">Special Offers</h2>
					<svg class="w-8 h-8 text-[#ab6b51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{specialOffersCount}</p>
				<p class="text-gray-600">Promotional offers</p>
			</a>
			
			<a href="/admin/activities" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Activities</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{activitiesCount}</p>
				<p class="text-gray-600">Kids activities</p>
			</a>

			<a href="/admin/events" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Events</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{eventsCount}</p>
				<p class="text-gray-600">Upcoming events</p>
			</a>

			<a href="/admin/testimonials" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Testimonials</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{testimonialsCount}</p>
				<p class="text-gray-600">Customer reviews</p>
			</a>

			<a href="/admin/menu" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Menu</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{menuItemsCount}</p>
				<p class="text-gray-600">Menu items</p>
			</a>

			<a href="/admin/opening-times" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Opening Times</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<p class="text-gray-600">Manage opening hours</p>
			</a>

			<a href="/admin/banner" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Banner Message</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
					</svg>
				</div>
				<p class="text-gray-600">Edit top banner message</p>
			</a>

			<a href="/admin/images" class="bg-white rounded-lg p-6 shadow-lg border-2 border-[#39918c] hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-[#39918c]">Images</h2>
					<svg class="w-8 h-8 text-[#39918c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
					</svg>
				</div>
				<p class="text-4xl font-bold text-gray-700 mb-2">{imagesCount}</p>
				<p class="text-gray-600">Site images library</p>
			</a>
		</div>
	</div>
</section>

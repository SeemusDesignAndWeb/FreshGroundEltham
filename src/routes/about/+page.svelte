<script lang="ts">
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img) {
			img.style.display = 'none';
		}
	}
</script>

<svelte:head>
	<title>About Us - Fresh Ground Eltham</title>
	<meta name="description" content="Learn about Fresh Ground Eltham - a community café run by Eltham Green Community Church, offering quality coffee, tea, and food at accessible prices." />
</svelte:head>

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center" style="background-image: url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80');">
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/80 to-[#2f435a]/80 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">About Fresh Ground</h1>
			<p class="text-xl text-gray-100">A welcoming community café for everyone</p>
		</div>
	</section>
</div>

<!-- Mission Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-[#39918c] mb-6 text-center">Our Mission</h2>
		<div class="space-y-4 text-gray-700 text-lg">
			<p>
				Fresh Ground is a welcoming community café offering quality food and beverages at accessible prices. We're run by <strong>Eltham Green Community Church</strong> and strive to create a safe and enjoyable environment for all ages.
			</p>
			<p>
				Our mission is to serve as a hub for the community, bringing people together over great coffee, delicious food, and friendly conversation. We believe everyone deserves access to quality food and drink, regardless of their circumstances.
			</p>
			<p>
				We're particularly welcoming to parents and caregivers with children, offering a family-friendly space where everyone feels at home. Our café is designed to be inclusive, accessible, and affordable for all members of our community.
			</p>
		</div>
	</div>
</section>

<!-- Eltham Green Community Church Section -->
<section class="py-16 px-4 bg-[#d0b49f]">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-[#39918c] mb-8 text-center">Eltham Green Community Church</h2>
		<div class="bg-white rounded-lg p-8 shadow-lg">
			<div class="space-y-6 text-gray-700">
				<p>
					Fresh Ground is run by <strong>Eltham Green Community Church (EGCC)</strong>, a welcoming and diverse Christian community located in Eltham, Royal Greenwich, London. Established in 1975 as Eltham Green Fellowship, the church began as a house church and has grown into a vibrant congregation.
				</p>
				<p>
					In 1981, EGCC acquired the Methodist Church building on the corner of Haimo Road, which has since been developed to include additional rooms, a larger main hall, residential flats, and the Fresh Ground Coffee House. The church is part of the MissionLifeGrace (MLG) network, a group of independent churches sharing a common heart for God.
				</p>
				<p>
					EGCC emphasizes a family atmosphere, with Life Groups meeting during the week to foster community and spiritual growth. The church is deeply committed to serving the local community through various activities and initiatives.
				</p>
				<div class="mt-8 pt-6 border-t border-gray-200">
					<h3 class="text-2xl font-bold text-[#39918c] mb-4">Community Activities</h3>
					<ul class="space-y-3">
						<li class="flex items-start">
							<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
							<span><strong>Fresh Ground Coffee House:</strong> Operating Wednesday to Saturday, offering a welcoming space for connection and quality refreshments</span>
						</li>
						<li class="flex items-start">
							<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
							<span><strong>Food On Our Doorstep (FOOD) Club:</strong> Providing families with good-quality food at a low cost</span>
						</li>
						<li class="flex items-start">
							<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
							<span><strong>Jumping Beans:</strong> A playgroup for children offering fun and engaging activities</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 text-center">
					<a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="inline-block bg-[#39918c] text-white px-6 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium">
						Visit EGCC Website →
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Community Focus Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-[#39918c] mb-6 text-center">Community Focus</h2>
		<div class="bg-[#d0b49f] rounded-lg p-8">
			<p class="text-gray-700 text-lg mb-4">
				At Fresh Ground, we're more than just a café - we're a community space where people can come together, connect, and feel welcome.
			</p>
			<ul class="space-y-3 text-gray-700">
				<li class="flex items-start">
					<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<span><strong>Family-Friendly:</strong> We welcome parents, caregivers, and children with open arms</span>
				</li>
				<li class="flex items-start">
					<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<span><strong>Accessible Prices:</strong> Quality food and drink at prices everyone can afford</span>
				</li>
				<li class="flex items-start">
					<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<span><strong>Safe Space:</strong> A welcoming environment where everyone feels comfortable</span>
				</li>
				<li class="flex items-start">
					<svg class="w-6 h-6 text-[#39918c] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					<span><strong>Social Impact:</strong> Supporting social enterprises that make a difference</span>
				</li>
			</ul>
		</div>
	</div>
</section>

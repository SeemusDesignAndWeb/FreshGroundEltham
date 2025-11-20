<script lang="js">
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data } = $props();
	let backgroundImage = $state(data?.backgroundImage || null);
	
	function handleImageError(event) {
		const img = event.target;
		if (img) {
			img.style.display = 'none';
		}
	}
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Support Fresh Ground</h1>
			<p class="text-xl text-gray-100">Help us continue serving our community</p>
		</div>
	</section>
</div>

<!-- Donate Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<div class="bg-white rounded-lg p-8 shadow-lg mb-8">
			<h2 class="text-3xl font-bold text-[#39918c] mb-6 text-center">Why Donate?</h2>
			<div class="space-y-4 text-gray-700 text-lg">
				<p>
					As a community café run by <a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="text-[#39918c] hover:underline font-semibold">Eltham Green Community Church</a>, Fresh Ground strives to provide quality food and beverages at accessible prices. We're committed to creating a welcoming space for everyone, regardless of their circumstances.
				</p>
				<p>
					Your donation helps us:
				</p>
				<ul class="list-disc list-inside space-y-2 ml-4">
					<li>Maintain affordable prices for all community members</li>
					<li>Keep our café well-stocked with quality products</li>
					<li>Support social enterprises like Old Spike Roastery</li>
					<li>Continue providing a safe, family-friendly environment</li>
					<li>Invest in improvements and updates to our space</li>
				</ul>
			</div>
		</div>

		<div class="bg-white border-2 border-[#39918c] rounded-lg p-8 shadow-lg">
			<h2 class="text-3xl font-bold text-[#39918c] mb-6 text-center">How to Donate</h2>
			<div class="space-y-6">
				<div class="bg-gradient-to-br from-[#39918c] to-[#2f435a] rounded-lg p-6 text-white">
					<h3 class="text-2xl font-bold mb-3">Online Donation</h3>
					<p class="text-gray-100 mb-4">
						Support Fresh Ground Eltham through our Buy Me a Coffee page. Each "coffee" is £5 and you can buy as many as you like. It's a quick and easy way to support our community café!
					</p>
					<a 
						href="https://buymeacoffee.com/freshground" 
						target="_blank" 
						rel="noopener noreferrer"
						class="inline-block bg-white text-[#39918c] px-8 py-3 rounded hover:bg-gray-100 transition-colors font-medium text-lg shadow-md"
					>
						☕ Donate via Buy Me a Coffee →
					</a>
				</div>

				<div class="bg-gray-50 rounded-lg p-6">
					<h3 class="text-xl font-bold text-[#39918c] mb-3">In Person</h3>
					<p class="text-gray-700 mb-4">
						Visit us during opening hours and make a donation at the counter. All contributions, large or small, are greatly appreciated.
					</p>
					<p class="text-sm text-gray-600">
						<strong>Opening Hours:</strong> Wednesday to Saturday, 9:30 am to 2:00 pm
					</p>
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-gray-600 mb-4">Thank you for your support!</p>
			<a href="/contact" class="inline-block bg-[#39918c] text-white px-8 py-3 rounded hover:bg-[#ab6b51] transition-colors font-medium">
				Contact Us →
			</a>
		</div>
	</div>
</section>


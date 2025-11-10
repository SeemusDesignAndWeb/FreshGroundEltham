<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let backgroundImage = $state<string | null>(data?.backgroundImage || null);
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
			<p class="text-xl text-gray-100">How we use cookies on our website</p>
		</div>
	</section>
</div>

<!-- Cookie Policy Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<div class="prose max-w-none space-y-8">
			<div class="bg-white rounded-lg p-8 mb-8">
				<p class="text-lg text-gray-700 mb-4">
					<strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
				</p>
				<p class="text-lg text-gray-700">
					This Cookie Policy explains what cookies are, how Fresh Ground Eltham uses them on our website, and how you can control the use of cookies.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">What Are Cookies?</h2>
				<p class="text-gray-700 mb-4">
					Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
				</p>
				<p class="text-gray-700">
					Cookies allow a website to remember your actions and preferences (such as shopping cart contents, language, font size, and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">How We Use Cookies</h2>
				<p class="text-gray-700 mb-4">We use cookies for the following purposes:</p>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Essential Cookies</h3>
						<p class="text-gray-700 mb-2">
							These cookies are necessary for the website to function properly. They enable core functionality such as:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700">
							<li>Maintaining your session while browsing the website</li>
							<li>Storing items in your shopping cart</li>
							<li>Remembering your preferences</li>
							<li>Ensuring security and preventing fraud</li>
						</ul>
						<p class="text-gray-700 mt-2">
							<strong>These cookies cannot be disabled</strong> as they are essential for the website to function.
						</p>
					</div>

					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Functionality Cookies</h3>
						<p class="text-gray-700 mb-2">
							These cookies allow the website to remember choices you make and provide enhanced features:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700">
							<li>Storing booking information during checkout</li>
							<li>Remembering your preferences for display settings</li>
							<li>Maintaining your shopping cart contents</li>
						</ul>
					</div>

					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Analytics Cookies</h3>
						<p class="text-gray-700 mb-2">
							These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700">
							<li>Which pages are visited most frequently</li>
							<li>How long visitors spend on each page</li>
							<li>How visitors navigate through the site</li>
							<li>Any error messages encountered</li>
						</ul>
						<p class="text-gray-700 mt-2">
							This information helps us improve our website and user experience.
						</p>
					</div>

					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Third-Party Cookies</h3>
						<p class="text-gray-700 mb-2">
							We may use third-party services that set cookies on your device. These include:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700">
							<li><strong>PayPal:</strong> For payment processing. PayPal uses cookies to provide secure payment functionality.</li>
							<li><strong>Payment Services:</strong> Cookies necessary for processing payments securely.</li>
						</ul>
						<p class="text-gray-700 mt-2">
							These third-party cookies are subject to the respective privacy policies of these third parties.
						</p>
					</div>
				</div>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Types of Cookies We Use</h2>
				<div class="bg-white border-2 border-[#39918c] rounded-lg p-6">
					<table class="w-full text-gray-700">
						<thead>
							<tr class="bg-white">
								<th class="p-3 text-left font-semibold">Cookie Name</th>
								<th class="p-3 text-left font-semibold">Purpose</th>
								<th class="p-3 text-left font-semibold">Duration</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							<tr>
								<td class="p-3">Session cookies</td>
								<td class="p-3">Maintain user session and shopping cart</td>
								<td class="p-3">Session (deleted when browser closes)</td>
							</tr>
							<tr>
								<td class="p-3">Booking data</td>
								<td class="p-3">Store booking information during checkout</td>
								<td class="p-3">Session</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Managing Cookies</h2>
				<p class="text-gray-700 mb-4">
					You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
				</p>
				
				<div class="space-y-4">
					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Browser Settings</h3>
						<p class="text-gray-700 mb-2">
							Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700">
							<li><strong>Chrome:</strong> Settings > Privacy and security > Cookies and other site data</li>
							<li><strong>Firefox:</strong> Options > Privacy & Security > Cookies and Site Data</li>
							<li><strong>Safari:</strong> Preferences > Privacy > Cookies and website data</li>
							<li><strong>Edge:</strong> Settings > Cookies and site permissions > Cookies and site data</li>
						</ul>
					</div>

					<div>
						<h3 class="text-xl font-semibold text-[#39918c] mb-2">Impact of Disabling Cookies</h3>
						<p class="text-gray-700">
							If you choose to disable cookies, some features of our website may not function properly:
						</p>
						<ul class="list-disc pl-6 space-y-2 text-gray-700 mt-2">
							<li>You may not be able to complete bookings</li>
							<li>Your shopping cart may not persist between pages</li>
							<li>You may need to re-enter information more frequently</li>
							<li>Some personalised features may not work</li>
						</ul>
					</div>
				</div>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Cookie Consent</h2>
				<p class="text-gray-700 mb-4">
					By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or not use our website.
				</p>
				<p class="text-gray-700">
					Essential cookies are necessary for the website to function and cannot be disabled. For other cookies, you can manage your preferences through your browser settings.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Updates to This Cookie Policy</h2>
				<p class="text-gray-700">
					We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our operations. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">Contact Us</h2>
				<p class="text-gray-700 mb-4">
					If you have any questions about our use of cookies, please contact us:
				</p>
				<div class="bg-white rounded-lg p-6">
					<p class="text-gray-700 mb-2"><strong>Fresh Ground Eltham</strong></p>
					<p class="text-gray-700 mb-2">Email: <a href="mailto:coffeehouse@freshgroundeltham.co.uk" class="text-[#39918c] hover:underline">coffeehouse@freshgroundeltham.co.uk</a></p>
				</div>
			</div>
		</div>
	</div>
</section>

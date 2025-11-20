<script lang="js">
	import SEOHead from '$lib/components/SEOHead.svelte';

	let { data } = $props();
	let backgroundImage = $state(data?.backgroundImage || null);
</script>

<SEOHead />

<!-- Hero Section -->
<div class="relative z-0">
	<section class="relative bg-cover bg-center py-8 px-4 -mt-[120px] pt-[calc(120px+2rem)] min-h-[200px] flex items-center {backgroundImage ? '' : 'bg-gradient-to-r from-[#39918c] to-[#2f435a]'}" style={backgroundImage ? `background-image: url('${backgroundImage}');` : ''}>
		<div class="absolute inset-0 bg-gradient-to-r from-[#39918c]/20 to-[#2f435a]/20 z-10"></div>
		<div class="max-w-4xl mx-auto text-center relative z-20 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Privacy Statement</h1>
			<p class="text-xl text-gray-100">How we protect your personal information</p>
		</div>
	</section>
</div>

<!-- Privacy Section -->
<section class="py-16 px-4 bg-white">
	<div class="max-w-4xl mx-auto">
		<div class="prose max-w-none space-y-8">
			<div class="bg-white rounded-lg p-8 mb-8">
				<p class="text-lg text-gray-700 mb-4">
					<strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
				</p>
				<p class="text-lg text-gray-700">
					Fresh Ground Eltham ("we", "our", or "us") is committed to protecting your privacy. This Privacy Statement explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">1. Information We Collect</h2>
				<div class="space-y-4 text-gray-700">
					<h3 class="text-xl font-semibold text-[#39918c]">Personal Information</h3>
					<p>We may collect personal information that you voluntarily provide to us when you:</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Book activities through our website</li>
						<li>Contact us via email or contact forms</li>
						<li>Sign up for newsletters or updates</li>
						<li>Make a donation</li>
					</ul>
					<p class="mt-4">This information may include:</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Name and contact information (email address, phone number)</li>
						<li>Payment information (processed securely through PayPal)</li>
						<li>Booking details and preferences</li>
						<li>Any other information you choose to provide</li>
					</ul>
				</div>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">2. How We Use Your Information</h2>
				<p class="text-gray-700 mb-4">We use the information we collect to:</p>
				<ul class="list-disc pl-6 space-y-2 text-gray-700">
					<li>Process and manage your activity bookings</li>
					<li>Send booking confirmations and updates</li>
					<li>Respond to your inquiries and requests</li>
					<li>Process donations and payments</li>
					<li>Improve our website and services</li>
					<li>Send you newsletters or updates (with your consent)</li>
					<li>Comply with legal obligations</li>
				</ul>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">3. Information Sharing and Disclosure</h2>
				<p class="text-gray-700 mb-4">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
				<ul class="list-disc pl-6 space-y-2 text-gray-700">
					<li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as payment processing (PayPal) and email services</li>
					<li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
					<li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
				</ul>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">4. Data Security</h2>
				<p class="text-gray-700 mb-4">
					We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
				</p>
				<p class="text-gray-700">
					Payment information is processed securely through PayPal, and we do not store your full payment card details on our servers.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">5. Your Rights</h2>
				<p class="text-gray-700 mb-4">Under UK data protection laws, you have the right to:</p>
				<ul class="list-disc pl-6 space-y-2 text-gray-700">
					<li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
					<li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
					<li><strong>Erasure:</strong> Request deletion of your personal information</li>
					<li><strong>Restriction:</strong> Request restriction of processing of your information</li>
					<li><strong>Data Portability:</strong> Request transfer of your information to another service</li>
					<li><strong>Objection:</strong> Object to processing of your information</li>
					<li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
				</ul>
				<p class="text-gray-700 mt-4">
					To exercise these rights, please contact us using the details provided below.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">6. Data Retention</h2>
				<p class="text-gray-700 mb-4">
					We retain your personal information only for as long as necessary to fulfil the purposes outlined in this Privacy Statement, unless a longer retention period is required or permitted by law.
				</p>
				<p class="text-gray-700">
					Booking information is retained for administrative purposes and may be kept for up to 1 year for accounting and legal compliance.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">7. Children's Privacy</h2>
				<p class="text-gray-700">
					Our services are directed to individuals of all ages, including children. When we collect information about children, we do so with appropriate safeguards. Parents or guardians should contact us if they have concerns about their child's information.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">8. Changes to This Privacy Statement</h2>
				<p class="text-gray-700">
					We may update this Privacy Statement from time to time. We will notify you of any changes by posting the new Privacy Statement on this page and updating the "Last Updated" date. You are advised to review this Privacy Statement periodically for any changes.
				</p>
			</div>

			<div>
				<h2 class="text-3xl font-bold text-[#39918c] mb-4">9. Contact Us</h2>
				<p class="text-gray-700 mb-4">
					If you have any questions about this Privacy Statement or our data practices, please contact us:
				</p>
				<div class="bg-white rounded-lg p-6">
					<p class="text-gray-700 mb-2"><strong>Fresh Ground Eltham</strong></p>
					<p class="text-gray-700 mb-2">Run by <a href="https://www.egcc.co.uk" target="_blank" rel="noopener noreferrer" class="text-[#39918c] hover:underline font-semibold">Eltham Green Community Church</a></p>
					<p class="text-gray-700 mb-2">Email: <a href="mailto:coffeehouse@freshgroundeltham.co.uk" class="text-[#39918c] hover:underline">coffeehouse@freshgroundeltham.co.uk</a></p>
					<p class="text-gray-700">
						For data protection inquiries, please include "Data Protection" in your subject line.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

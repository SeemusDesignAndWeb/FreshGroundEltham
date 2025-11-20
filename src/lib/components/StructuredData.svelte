<script lang="js">
	import { page } from '$app/stores';
	
	
    let { type = 'LocalBusiness' } = $props();
	
	// Get current site URL
	const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://freshgroundeltham.co.uk';
	const currentPath = $page.url.pathname;
	const fullUrl = `${siteUrl}${currentPath}`;
	
	// LocalBusiness schema for the café
	const localBusinessSchema = {
		'@context': 'https://schema.org',
		'@type': 'CafeOrCoffeeShop',
		'@id': `${siteUrl}/#organization`,
		name: 'Fresh Ground Eltham',
		alternateName: 'Fresh Ground',
		description: 'A welcoming community café offering quality coffee, tea, and food at accessible prices. Family-friendly space in Eltham, London.',
		url: siteUrl,
		logo: `${siteUrl}/images/freshgroundadmin_320.png`,
		image: `${siteUrl}/images/freshgroundadmin_320.png`,
		telephone: '', // Phone number removed per user request
		email: 'coffeehouse@freshgroundeltham.co.uk',
		address: {
			'@type': 'PostalAddress',
			streetAddress: '542 Westhorne Avenue',
			addressLocality: 'Eltham',
			addressRegion: 'London',
			postalCode: 'SE9 6DH',
			addressCountry: 'GB'
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 51.4498,
			longitude: -0.0522
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
				opens: '09:30',
				closes: '14:00'
			}
		],
		priceRange: '£',
		servesCuisine: 'Coffee, Tea, Light Meals',
		acceptsReservations: 'False',
		paymentAccepted: 'Cash, Credit Card, PayPal',
		currenciesAccepted: 'GBP',
		sameAs: [
			'https://www.facebook.com/freshgroundeltham',
			'https://www.instagram.com/freshgroundeltham/'
		],
		parentOrganization: {
			'@type': 'Organization',
			name: 'Eltham Green Community Church',
			url: 'https://www.egcc.co.uk'
		}
	};
	
	// Organization schema
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${siteUrl}/#organization`,
		name: 'Fresh Ground Eltham',
		alternateName: 'Fresh Ground',
		url: siteUrl,
		logo: `${siteUrl}/images/freshgroundadmin_320.png`,
		description: 'A welcoming community café offering quality coffee, tea, and food at accessible prices.',
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'coffeehouse@freshgroundeltham.co.uk',
			contactType: 'Customer Service',
			areaServed: 'GB',
			availableLanguage: 'English'
		},
		sameAs: [
			'https://www.facebook.com/freshgroundeltham',
			'https://www.instagram.com/freshgroundeltham/'
		]
	};
	
	// WebSite schema for better search engine understanding
	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Fresh Ground Eltham',
		url: siteUrl,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${siteUrl}/?search={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};
	
	let schema = $derived.by(() => {
		switch (type) {
			case 'LocalBusiness':
				return localBusinessSchema;
			case 'Organization':
				return organizationSchema;
			case 'WebSite':
				return websiteSchema;
			default:
				return localBusinessSchema;
		}
	});
</script>

{@html `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`}

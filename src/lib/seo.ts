// Central SEO configuration for all pages
export interface SEOData {
	title: string;
	description: string;
	keywords?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: string;
	twitterCard?: string;
	canonical?: string;
}

export const seoData: Record<string, SEOData> = {
	home: {
		title: 'Fresh Ground Eltham - Community Café | Quality Coffee & Food',
		description: 'Fresh Ground Eltham is a welcoming community café offering quality coffee, tea, and food at accessible prices. Run by Eltham Green Community Church. Family-friendly space in Eltham, London.',
		keywords: 'community café, coffee shop Eltham, Fresh Ground, Eltham Green Community Church, family café, affordable coffee, community space London',
		ogTitle: 'Fresh Ground Eltham - Community Café',
		ogDescription: 'A welcoming community café offering quality coffee, tea, and food at accessible prices. Family-friendly space in Eltham, London.',
		ogImage: '/images/freshgroundlogowhite.svg',
		ogType: 'website',
		twitterCard: 'summary_large_image'
	},
	about: {
		title: 'About Us - Fresh Ground Eltham | Community Café',
		description: 'Learn about Fresh Ground Eltham - a community café run by Eltham Green Community Church, offering quality coffee, tea, and food at accessible prices. Family-friendly space for all ages.',
		keywords: 'about Fresh Ground, Eltham Green Community Church, community café, EGCC, mission, values',
		ogTitle: 'About Fresh Ground Eltham',
		ogDescription: 'A welcoming community café offering quality food and beverages at accessible prices. Run by Eltham Green Community Church.',
		ogType: 'website'
	},
	menu: {
		title: 'Menu - Fresh Ground Eltham | Coffee, Tea & Food',
		description: 'View our menu at Fresh Ground Eltham - quality coffee, tea, and food at accessible prices. Freshly prepared meals and beverages in a welcoming community café.',
		keywords: 'menu, coffee menu, café menu, food menu, prices, Fresh Ground menu',
		ogTitle: 'Our Menu - Fresh Ground Eltham',
		ogDescription: 'Quality coffee, tea, and food at accessible prices. View our full menu online.',
		ogType: 'website'
	},
	activities: {
		title: 'Kids Activities - Fresh Ground Eltham | Book Activities',
		description: 'Book kids activities at Fresh Ground Eltham during half term and school holidays. Fun, engaging activities for children in a safe, welcoming environment.',
		keywords: 'kids activities, children activities, half term activities, school holidays, book activities, Eltham',
		ogTitle: 'Kids Activities - Fresh Ground Eltham',
		ogDescription: 'Book activities for children during half term and school holidays. Fun, engaging activities in a safe environment.',
		ogType: 'website'
	},
	'book-activities': {
		title: 'Book Kids Activities - Fresh Ground Eltham',
		description: 'Book activities for children at Fresh Ground Eltham. Select from available activities and secure your booking online.',
		keywords: 'book activities, book kids activities, activity booking, children activities booking',
		ogTitle: 'Book Kids Activities - Fresh Ground Eltham',
		ogDescription: 'Book activities for children during half term and school holidays.',
		ogType: 'website'
	},
	openingTimes: {
		title: 'Opening Times - Fresh Ground Eltham',
		description: 'Find our opening times at Fresh Ground Eltham. We\'re open Wednesday to Saturday. Check our current hours and special opening times.',
		keywords: 'opening times, hours, opening hours, when are we open, café hours',
		ogTitle: 'Opening Times - Fresh Ground Eltham',
		ogDescription: 'Find our opening times. We\'re open Wednesday to Saturday.',
		ogType: 'website'
	},
	gallery: {
		title: 'Gallery - Fresh Ground Eltham | Photo Gallery',
		description: 'Photo gallery showcasing Fresh Ground Eltham - our coffee, food, and welcoming atmosphere. Take a look around our community café.',
		keywords: 'gallery, photos, café photos, Fresh Ground photos, coffee photos',
		ogTitle: 'Gallery - Fresh Ground Eltham',
		ogDescription: 'Photo gallery showcasing our coffee, food, and welcoming atmosphere.',
		ogType: 'website'
	},
	contact: {
		title: 'Contact Us - Fresh Ground Eltham',
		description: 'Get in touch with Fresh Ground Eltham. Contact us for bookings, inquiries, or to learn more about our community café.',
		keywords: 'contact, contact us, get in touch, email, phone, address',
		ogTitle: 'Contact Us - Fresh Ground Eltham',
		ogDescription: 'Get in touch with Fresh Ground Eltham. Contact us for bookings and inquiries.',
		ogType: 'website'
	},
	donate: {
		title: 'Donate - Support Fresh Ground Eltham',
		description: 'Support Fresh Ground Eltham community café. Help us continue serving our community with quality food and beverages at accessible prices.',
		keywords: 'donate, support, donation, community support, charity',
		ogTitle: 'Support Fresh Ground Eltham',
		ogDescription: 'Help us continue serving our community with quality food and beverages.',
		ogType: 'website'
	},
	cart: {
		title: 'Shopping Cart - Fresh Ground Eltham',
		description: 'Review your activity bookings in your shopping cart. Manage your selections before checkout.',
		keywords: 'cart, shopping cart, basket, bookings',
		ogTitle: 'Shopping Cart - Fresh Ground Eltham',
		ogDescription: 'Review your activity bookings before checkout.',
		ogType: 'website'
	},
	checkout: {
		title: 'Checkout - Fresh Ground Eltham',
		description: 'Complete your booking information. Enter your details to proceed with your activity booking.',
		keywords: 'checkout, booking, complete booking',
		ogTitle: 'Checkout - Fresh Ground Eltham',
		ogDescription: 'Complete your booking information.',
		ogType: 'website'
	},
	payment: {
		title: 'Payment - Fresh Ground Eltham',
		description: 'Complete your payment securely with PayPal. Pay for your activity bookings with credit card or PayPal account.',
		keywords: 'payment, pay, checkout, PayPal, secure payment',
		ogTitle: 'Payment - Fresh Ground Eltham',
		ogDescription: 'Complete your payment securely with PayPal.',
		ogType: 'website'
	},
	'booking-confirmation': {
		title: 'Booking Confirmed - Fresh Ground Eltham',
		description: 'Your booking has been confirmed! Thank you for booking with Fresh Ground Eltham.',
		keywords: 'booking confirmed, confirmation, booking success',
		ogTitle: 'Booking Confirmed - Fresh Ground Eltham',
		ogDescription: 'Your booking has been successfully confirmed!',
		ogType: 'website'
	},
	privacy: {
		title: 'Privacy Statement - Fresh Ground Eltham',
		description: 'Privacy policy for Fresh Ground Eltham community café. Learn how we collect, use, and protect your personal information.',
		keywords: 'privacy, privacy policy, data protection, GDPR, personal information',
		ogTitle: 'Privacy Statement - Fresh Ground Eltham',
		ogDescription: 'Learn how we collect, use, and protect your personal information.',
		ogType: 'website'
	},
	cookies: {
		title: 'Cookie Policy - Fresh Ground Eltham',
		description: 'Cookie policy for Fresh Ground Eltham. Learn about how we use cookies and similar technologies on our website.',
		keywords: 'cookies, cookie policy, website cookies, tracking',
		ogTitle: 'Cookie Policy - Fresh Ground Eltham',
		ogDescription: 'Learn about how we use cookies and similar technologies on our website.',
		ogType: 'website'
	}
};

export function getSEOData(path: string): SEOData {
	// Extract page key from path
	const pathKey = path.replace(/^\//, '').replace(/\/$/, '') || 'home';
	
	// Handle nested paths
	const key = pathKey.split('/').pop() || 'home';
	
	// Return SEO data or default
	return seoData[key] || seoData.home;
}

export function generateSEOHead(seo: SEOData, url?: string) {
	const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
	const ogImage = seo.ogImage ? `${siteUrl}${seo.ogImage}` : `${siteUrl}/images/freshgroundlogowhite.svg`;
	
	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		ogTitle: seo.ogTitle || seo.title,
		ogDescription: seo.ogDescription || seo.description,
		ogImage: ogImage,
		ogType: seo.ogType || 'website',
		ogUrl: fullUrl,
		twitterCard: seo.twitterCard || 'summary',
		canonical: seo.canonical || fullUrl
	};
}


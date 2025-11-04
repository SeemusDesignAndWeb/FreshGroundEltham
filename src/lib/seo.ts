// Central SEO configuration for all pages
export interface SEOData {
	title: string;
	description: string;
	keywords?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string; // Should be JPG/PNG for Facebook (1200x630px recommended)
	ogType?: string;
	ogSiteName?: string;
	ogLocale?: string;
	twitterCard?: string;
	twitterSite?: string;
	twitterCreator?: string;
	canonical?: string;
	author?: string;
	robots?: string;
}

// Default site information
const SITE_NAME = 'Fresh Ground Eltham';
const DEFAULT_OG_IMAGE = '/images/freshgroundadmin_320.png'; // Use PNG for Facebook compatibility
const SITE_URL = 'https://www.freshgroundeltham.co.uk'; // Update with your actual domain

export const seoData: Record<string, SEOData> = {
	home: {
		title: 'Fresh Ground Eltham - Community Café | Quality Coffee & Food | Eltham, London',
		description: 'Fresh Ground Eltham is a welcoming community café offering quality coffee, tea, and food at accessible prices. Run by Eltham Green Community Church. Family-friendly space in Eltham, London SE9. Open Wednesday to Saturday.',
		keywords: 'community café Eltham, coffee shop Eltham, Fresh Ground Eltham, Eltham Green Community Church, family café London, affordable coffee SE9, community space Eltham, café near me, coffee shop SE9',
		ogTitle: 'Fresh Ground Eltham - Community Café | Eltham, London',
		ogDescription: 'A welcoming community café offering quality coffee, tea, and food at accessible prices. Family-friendly space in Eltham, London. Open Wednesday to Saturday.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow',
		author: SITE_NAME
	},
	about: {
		title: 'About Us - Fresh Ground Eltham | Community Café | Eltham, London',
		description: 'Learn about Fresh Ground Eltham - a community café run by Eltham Green Community Church, offering quality coffee, tea, and food at accessible prices. Family-friendly space for all ages in Eltham, London SE9.',
		keywords: 'about Fresh Ground Eltham, Eltham Green Community Church, community café Eltham, EGCC, mission, values, Fresh Ground story, community café London',
		ogTitle: 'About Fresh Ground Eltham - Community Café',
		ogDescription: 'A welcoming community café offering quality food and beverages at accessible prices. Run by Eltham Green Community Church. Family-friendly space in Eltham, London.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	menu: {
		title: 'Menu - Fresh Ground Eltham | Coffee, Tea & Food Menu | Prices',
		description: 'View our menu at Fresh Ground Eltham - quality coffee, tea, and food at accessible prices. Freshly prepared meals and beverages in a welcoming community café. Open Wednesday to Saturday.',
		keywords: 'Fresh Ground menu, coffee menu Eltham, café menu, food menu SE9, prices, menu prices, coffee prices, café prices Eltham',
		ogTitle: 'Our Menu - Fresh Ground Eltham | Coffee, Tea & Food',
		ogDescription: 'Quality coffee, tea, and food at accessible prices. View our full menu online. Freshly prepared in Eltham, London.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	activities: {
		title: 'Kids Activities - Fresh Ground Eltham | Book Half Term Activities | Eltham',
		description: 'Book kids activities at Fresh Ground Eltham during half term and school holidays. Fun, engaging activities for children aged 3-12 in a safe, welcoming environment. Activities include craft workshops, story time, baking, and games.',
		keywords: 'kids activities Eltham, children activities SE9, half term activities, school holidays activities, book activities Eltham, kids activities London, children workshops Eltham',
		ogTitle: 'Kids Activities - Fresh Ground Eltham | Book Half Term Activities',
		ogDescription: 'Book activities for children during half term and school holidays. Fun, engaging activities for ages 3-12 in a safe environment. Craft workshops, story time, baking, and games.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	'book-activities': {
		title: 'Book Kids Activities - Fresh Ground Eltham | Online Booking',
		description: 'Book activities for children at Fresh Ground Eltham. Select from available activities and secure your booking online. Easy, secure booking for half term and school holiday activities.',
		keywords: 'book activities Eltham, book kids activities, activity booking online, children activities booking, book half term activities',
		ogTitle: 'Book Kids Activities - Fresh Ground Eltham',
		ogDescription: 'Book activities for children during half term and school holidays. Secure your booking online.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	'opening-times': {
		title: 'Opening Times - Fresh Ground Eltham | Hours | Eltham, London',
		description: 'Find our opening times at Fresh Ground Eltham. We\'re open Wednesday to Saturday, 9:30 am to 2:00 pm. Check our current hours and special opening times.',
		keywords: 'opening times Eltham, Fresh Ground hours, café opening hours, when are we open, café hours SE9, opening times London',
		ogTitle: 'Opening Times - Fresh Ground Eltham',
		ogDescription: 'Find our opening times. We\'re open Wednesday to Saturday, 9:30 am to 2:00 pm.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	gallery: {
		title: 'Gallery - Fresh Ground Eltham | Photo Gallery | Coffee & Café Photos',
		description: 'Photo gallery showcasing Fresh Ground Eltham - our coffee, food, and welcoming atmosphere. Take a look around our community café in Eltham, London.',
		keywords: 'Fresh Ground gallery, café photos Eltham, coffee photos, café images, Fresh Ground photos, community café gallery',
		ogTitle: 'Gallery - Fresh Ground Eltham | Photo Gallery',
		ogDescription: 'Photo gallery showcasing our coffee, food, and welcoming atmosphere at Fresh Ground Eltham.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	contact: {
		title: 'Contact Us - Fresh Ground Eltham | Get in Touch | Eltham, London',
		description: 'Get in touch with Fresh Ground Eltham. Contact us for bookings, inquiries, or to learn more about our community café. Located at 542 Westhorne Avenue, Eltham, London SE9 6DH.',
		keywords: 'contact Fresh Ground, contact us Eltham, café contact, email coffeehouse@freshgroundeltham.co.uk, Fresh Ground address, café address SE9',
		ogTitle: 'Contact Us - Fresh Ground Eltham',
		ogDescription: 'Get in touch with Fresh Ground Eltham. Contact us for bookings and inquiries. Located at 542 Westhorne Avenue, Eltham, London SE9 6DH.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	donate: {
		title: 'Donate - Support Fresh Ground Eltham | Community Café Support',
		description: 'Support Fresh Ground Eltham community café. Help us continue serving our community with quality food and beverages at accessible prices. Your donation makes a difference.',
		keywords: 'donate Fresh Ground, support community café, donation Eltham, community support, charity donation, support local café',
		ogTitle: 'Support Fresh Ground Eltham - Community Café',
		ogDescription: 'Help us continue serving our community with quality food and beverages at accessible prices. Your support makes a difference.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary_large_image',
		robots: 'index, follow'
	},
	cart: {
		title: 'Shopping Cart - Fresh Ground Eltham | Review Bookings',
		description: 'Review your activity bookings in your shopping cart. Manage your selections before checkout. Secure online booking for kids activities.',
		keywords: 'cart, shopping cart, basket, bookings, activity cart',
		ogTitle: 'Shopping Cart - Fresh Ground Eltham',
		ogDescription: 'Review your activity bookings before checkout.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		robots: 'noindex, nofollow' // Don't index cart pages
	},
	checkout: {
		title: 'Checkout - Fresh Ground Eltham | Complete Booking',
		description: 'Complete your booking information. Enter your details to proceed with your activity booking. Secure checkout process.',
		keywords: 'checkout, booking, complete booking, activity checkout',
		ogTitle: 'Checkout - Fresh Ground Eltham',
		ogDescription: 'Complete your booking information.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		robots: 'noindex, nofollow' // Don't index checkout pages
	},
	payment: {
		title: 'Payment - Fresh Ground Eltham | Secure Payment',
		description: 'Complete your payment securely with PayPal. Pay for your activity bookings with credit card or PayPal account. Secure, encrypted payment processing.',
		keywords: 'payment, pay, checkout, PayPal, secure payment, credit card payment',
		ogTitle: 'Payment - Fresh Ground Eltham',
		ogDescription: 'Complete your payment securely with PayPal.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		robots: 'noindex, nofollow' // Don't index payment pages
	},
	'booking-confirmation': {
		title: 'Booking Confirmed - Fresh Ground Eltham | Thank You',
		description: 'Your booking has been confirmed! Thank you for booking with Fresh Ground Eltham. We look forward to seeing you.',
		keywords: 'booking confirmed, confirmation, booking success, activity booking confirmed',
		ogTitle: 'Booking Confirmed - Fresh Ground Eltham',
		ogDescription: 'Your booking has been successfully confirmed! Thank you for booking with us.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		robots: 'noindex, nofollow' // Don't index confirmation pages
	},
	privacy: {
		title: 'Privacy Statement - Fresh Ground Eltham | Privacy Policy',
		description: 'Privacy policy for Fresh Ground Eltham community café. Learn how we collect, use, and protect your personal information. GDPR compliant privacy statement.',
		keywords: 'privacy, privacy policy, data protection, GDPR, personal information, Fresh Ground privacy',
		ogTitle: 'Privacy Statement - Fresh Ground Eltham',
		ogDescription: 'Learn how we collect, use, and protect your personal information. GDPR compliant privacy policy.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary',
		robots: 'index, follow'
	},
	cookies: {
		title: 'Cookie Policy - Fresh Ground Eltham | Cookie Information',
		description: 'Cookie policy for Fresh Ground Eltham. Learn about how we use cookies and similar technologies on our website. Understand your cookie preferences.',
		keywords: 'cookies, cookie policy, website cookies, tracking, cookie preferences, Fresh Ground cookies',
		ogTitle: 'Cookie Policy - Fresh Ground Eltham',
		ogDescription: 'Learn about how we use cookies and similar technologies on our website.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		ogSiteName: SITE_NAME,
		ogLocale: 'en_GB',
		twitterCard: 'summary',
		robots: 'index, follow'
	}
};

export function getSEOData(path: string): SEOData {
	// Extract page key from path
	const pathKey = path.replace(/^\//, '').replace(/\/$/, '') || 'home';
	
	// Handle nested paths and special cases
	let key = pathKey.split('/').pop() || 'home';
	
	// Handle opening-times path (with hyphen)
	if (pathKey === 'opening-times' || key === 'opening-times') {
		key = 'opening-times';
	}
	
	// Return SEO data or default
	return seoData[key] || seoData.home;
}

export function generateSEOHead(seo: SEOData, url?: string) {
	const siteUrl = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
	const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
	const ogImage = seo.ogImage ? `${siteUrl}${seo.ogImage}` : `${siteUrl}${DEFAULT_OG_IMAGE}`;
	
	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		ogTitle: seo.ogTitle || seo.title,
		ogDescription: seo.ogDescription || seo.description,
		ogImage: ogImage,
		ogType: seo.ogType || 'website',
		ogUrl: fullUrl,
		ogSiteName: seo.ogSiteName || SITE_NAME,
		ogLocale: seo.ogLocale || 'en_GB',
		twitterCard: seo.twitterCard || 'summary_large_image',
		twitterSite: seo.twitterSite || '@freshgroundeltham',
		twitterCreator: seo.twitterCreator,
		canonical: seo.canonical || fullUrl,
		author: seo.author || SITE_NAME,
		robots: seo.robots || 'index, follow'
	};
}


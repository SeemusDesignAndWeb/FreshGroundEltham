import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type { Activity, Event } from '../stores/cart';
import type { SiteImage } from '../types';

console.log('[DB] database.ts module loaded');
console.log('[DB] DATABASE_PATH env:', process.env.DATABASE_PATH);
console.log('[DB] SPECIAL_OFFERS_DB_PATH env:', process.env.SPECIAL_OFFERS_DB_PATH);
console.log('[DB] process.cwd():', process.cwd());

const DB_PATH = process.env.DATABASE_PATH || './data/database.json';
const SPECIAL_OFFERS_DB_PATH = process.env.SPECIAL_OFFERS_DB_PATH || './data/specialOffers.json';

console.log('[DB] DB_PATH resolved to:', DB_PATH);
console.log('[DB] SPECIAL_OFFERS_DB_PATH resolved to:', SPECIAL_OFFERS_DB_PATH);

export interface Testimonial {
	id: string;
	name: string;
	text: string;
	rating: number; // 1-5 stars
}

export interface MenuItem {
	id: string;
	category: string; // e.g., "Hot Drinks", "Cold Drinks", "Food", "Cakes"
	name: string;
	description: string;
	price: number;
	order?: number; // Order for sorting (lower numbers appear first)
}

export interface MenuCategory {
	name: string;
	order: number; // Order for sorting (lower numbers appear first)
}

export interface MenuCategorySettings {
	categories: MenuCategory[];
}

export interface OpeningTimes {
	days: string; // e.g., "Wednesday to Saturday"
	hours: string; // e.g., "9:30 am to 2:00 pm"
	closedDays: string; // e.g., "Sunday, Monday, and Tuesday"
	backgroundImage: string; // URL for background image
	specialHours?: string; // Optional special opening hours message
}

export interface ActivitiesSettings {
	hidden: boolean;
	message: string; // Message to show when activities are hidden
}

export interface BannerSettings {
	message: string; // Banner message to display in top bar
	enabled: boolean; // Whether to show the banner
	icon?: string; // Icon to display before the message (e.g., 'star', 'explosion', 'sparkle')
	endIcon?: string; // Icon to display after the message (e.g., 'star', 'explosion', 'sparkle')
}

// SiteImage is imported from shared types to keep types in sync
// Re-export for convenience
export type { SiteImage } from '../types';

export interface NavigationItem {
	path: string; // URL path (e.g., '/about')
	label: string; // Display label (e.g., 'About Us')
	hidden: boolean; // Whether to hide from navbar
}

export interface NavigationSettings {
	items: NavigationItem[];
}

export interface PageBackgroundImages {
	[path: string]: string; // path -> image URL
}

export interface HeroSliderSettings {
	images: string[]; // Array of image paths/URLs
}

export interface GalleryImage {
	src: string; // Image path/URL
	alt: string; // Alt text for accessibility
	category: string; // Category for filtering (e.g., 'coffee', 'food')
}

export interface GallerySettings {
	images: GalleryImage[];
}

export interface TvScreenSettings {
	images: string[]; // Array of image paths/URLs
	transitionDuration?: number; // Transition duration in milliseconds (default: 5000)
}

export interface EventsSettings {
	hideFromHomePage: boolean; // If true, events won't appear in the hero slider on the home page
}

// Event interface is imported from '../stores/cart' to keep types in sync
// Re-export for convenience
export type { Event } from '../stores/cart';

export interface SpecialOffer {
	id: string;
	name: string; // Offer name
	description: string; // Description of the offer
	price: number; // Price in GBP
	image: string; // Image path/URL
	enabled: boolean; // Whether to display this offer
	emailInformation?: string; // Information to be emailed to customers
}

export interface Database {
	activities: Activity[];
	events?: Event[];
	bookings: any[];
	testimonials: Testimonial[];
	menuItems: MenuItem[];
	openingTimes: OpeningTimes | null;
	activitiesSettings?: ActivitiesSettings;
	bannerSettings?: BannerSettings;
	images?: SiteImage[];
	navigationSettings?: NavigationSettings;
	pageBackgrounds?: PageBackgroundImages;
	heroSliderSettings?: HeroSliderSettings;
	gallerySettings?: GallerySettings;
	tvScreenSettings?: TvScreenSettings;
	eventsSettings?: EventsSettings;
	menuCategorySettings?: MenuCategorySettings;
}

export interface SpecialOffersDatabase {
	offers: SpecialOffer[];
}

function getDbPath(): string {
	console.log('[DB] getDbPath() called');
	console.log('[DB] DB_PATH from env:', DB_PATH);
	console.log('[DB] process.cwd():', process.cwd());
	
	let finalPath: string;
	if (DB_PATH.startsWith('./') || DB_PATH.startsWith('../')) {
		// Relative path - resolve from project root
		finalPath = join(process.cwd(), DB_PATH);
		console.log('[DB] Using relative path, resolved to:', finalPath);
	} else {
		// Absolute path (e.g., /data/database.json for Railway volumes)
		finalPath = DB_PATH;
		console.log('[DB] Using absolute path:', finalPath);
	}
	
	// Ensure the directory exists for both relative and absolute paths
	const dir = dirname(finalPath);
	console.log('[DB] Ensuring directory exists:', dir);
	try {
		mkdirSync(dir, { recursive: true });
		console.log('[DB] Directory created/exists:', dir);
	} catch (error) {
		// Directory might already exist, or volume might not be mounted yet (during build)
		// This is okay - we'll handle errors when reading/writing
		console.warn('[DB] Could not create directory (may already exist or volume not mounted):', error);
	}
	console.log('[DB] Returning final path:', finalPath);
	return finalPath;
}

function getSpecialOffersDbPath(): string {
	console.log('[DB] getSpecialOffersDbPath() called');
	console.log('[DB] SPECIAL_OFFERS_DB_PATH from env:', SPECIAL_OFFERS_DB_PATH);
	
	let finalPath: string;
	if (SPECIAL_OFFERS_DB_PATH.startsWith('./') || SPECIAL_OFFERS_DB_PATH.startsWith('../')) {
		// Relative path - resolve from project root
		finalPath = join(process.cwd(), SPECIAL_OFFERS_DB_PATH);
		console.log('[DB] Using relative path for special offers, resolved to:', finalPath);
	} else {
		// Absolute path (e.g., /data/specialOffers.json for Railway volumes)
		finalPath = SPECIAL_OFFERS_DB_PATH;
		console.log('[DB] Using absolute path for special offers:', finalPath);
	}
	
	// Ensure the directory exists for both relative and absolute paths
	const dir = dirname(finalPath);
	console.log('[DB] Ensuring special offers directory exists:', dir);
	try {
		mkdirSync(dir, { recursive: true });
		console.log('[DB] Special offers directory created/exists:', dir);
	} catch (error) {
		// Directory might already exist, or volume might not be mounted yet (during build)
		// This is okay - we'll handle errors when reading/writing
		console.warn('[DB] Could not create special offers directory (may already exist or volume not mounted):', error);
	}
	console.log('[DB] Returning special offers final path:', finalPath);
	return finalPath;
}

export function readDatabase(): Database {
	console.log('[DB] readDatabase() called');
	try {
		const dbPath = getDbPath();
		console.log('[DB] Attempting to read database from:', dbPath);
		const data = readFileSync(dbPath, 'utf-8');
		console.log('[DB] Successfully read database, size:', data.length, 'bytes');
		const parsed = JSON.parse(data);
		console.log('[DB] Successfully parsed database');
		return parsed;
	} catch (error) {
		console.warn('[DB] Failed to read database from persistent location:', error);
		console.log('[DB] Error details:', error instanceof Error ? error.message : String(error));
		
		// If file doesn't exist, try to initialize from git version
		// This helps on Railway when using persistent storage
		try {
			const gitDbPath = join(process.cwd(), './data/database.json');
			console.log('[DB] Attempting to initialize from git version at:', gitDbPath);
			console.log('[DB] Git path exists?', existsSync(gitDbPath));
			
			if (gitDbPath !== DB_PATH && existsSync(gitDbPath)) {
				console.log('[DB] Git database found, reading...');
				const gitData = readFileSync(gitDbPath, 'utf-8');
				const db = JSON.parse(gitData);
				console.log('[DB] Git database parsed successfully');
				
				// Copy to persistent location
				try {
					console.log('[DB] Attempting to copy git database to persistent location...');
					writeDatabase(db);
					console.log('[DB] Successfully copied database to persistent location');
				} catch (writeError) {
					// If write fails, just return the db without saving
					console.warn('[DB] Could not write database to persistent location:', writeError);
				}
				return db;
			} else {
				console.log('[DB] Git database not found or same as persistent path');
			}
		} catch (initError) {
			// Ignore initialization errors
			console.warn('[DB] Could not initialize from git database:', initError);
			console.log('[DB] Init error details:', initError instanceof Error ? initError.message : String(initError));
		}
		
		// If file doesn't exist, return default structure
		console.log('[DB] Returning default empty database structure');
		return {
			activities: [],
			bookings: [],
			testimonials: [],
			menuItems: [],
			openingTimes: null
		};
	}
}

export function writeDatabase(data: Database): void {
	console.log('[DB] writeDatabase() called');
	const dbPath = getDbPath();
	console.log('[DB] Writing to path:', dbPath);
	
	// Ensure directory exists before writing (in case it wasn't created earlier)
	const dir = dirname(dbPath);
	console.log('[DB] Ensuring directory exists:', dir);
	try {
		mkdirSync(dir, { recursive: true });
		console.log('[DB] Directory ready:', dir);
	} catch (error) {
		// Directory might already exist, ignore
		console.warn('[DB] Directory creation warning (may already exist):', error);
	}
	
	try {
		const jsonData = JSON.stringify(data, null, 2);
		console.log('[DB] Writing', jsonData.length, 'bytes to', dbPath);
		writeFileSync(dbPath, jsonData, 'utf-8');
		console.log('[DB] Successfully wrote database to', dbPath);
	} catch (error) {
		// If write fails (e.g., volume not mounted during build), log but don't crash
		console.error('[DB] Could not write database to', dbPath, ':', error);
		console.error('[DB] Write error details:', error instanceof Error ? error.message : String(error));
		if (error instanceof Error && 'code' in error) {
			console.error('[DB] Error code:', (error as any).code);
		}
		throw error; // Re-throw so caller can handle it
	}
}

export function getActivities(): Activity[] {
	const db = readDatabase();
	return db.activities;
}

export function addActivity(activity: Activity): void {
	const db = readDatabase();
	db.activities.push(activity);
	writeDatabase(db);
}

export function updateActivity(activityId: string, updatedActivity: Partial<Activity>): void {
	const db = readDatabase();
	const index = db.activities.findIndex(a => a.id === activityId);
	if (index !== -1) {
		db.activities[index] = { ...db.activities[index], ...updatedActivity };
		writeDatabase(db);
	}
}

export function removeActivity(activityId: string): void {
	const db = readDatabase();
	db.activities = db.activities.filter(a => a.id !== activityId);
	writeDatabase(db);
}

export function getEvents(): Event[] {
	const db = readDatabase();
	return db.events || [];
}

export function addEvent(event: Event): void {
	const db = readDatabase();
	if (!db.events) {
		db.events = [];
	}
	db.events.push(event);
	writeDatabase(db);
}

export function updateEvent(eventId: string, updatedEvent: Partial<Event>): void {
	const db = readDatabase();
	if (!db.events) {
		db.events = [];
	}
	const index = db.events.findIndex(e => e.id === eventId);
	if (index !== -1) {
		db.events[index] = { ...db.events[index], ...updatedEvent };
		writeDatabase(db);
	}
}

export function removeEvent(eventId: string): void {
	const db = readDatabase();
	if (!db.events) {
		db.events = [];
	}
	db.events = db.events.filter(e => e.id !== eventId);
	writeDatabase(db);
}

export function addBooking(booking: any): void {
	const db = readDatabase();
	db.bookings.push(booking);
	writeDatabase(db);
}

export function getBookings(): any[] {
	const db = readDatabase();
	return db.bookings;
}

export function getTestimonials(): Testimonial[] {
	const db = readDatabase();
	return db.testimonials || [];
}

export function addTestimonial(testimonial: Testimonial): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	db.testimonials.push(testimonial);
	writeDatabase(db);
}

export function updateTestimonial(testimonialId: string, updatedTestimonial: Partial<Testimonial>): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	const index = db.testimonials.findIndex(t => t.id === testimonialId);
	if (index !== -1) {
		db.testimonials[index] = { ...db.testimonials[index], ...updatedTestimonial };
		writeDatabase(db);
	}
}

export function removeTestimonial(testimonialId: string): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	db.testimonials = db.testimonials.filter(t => t.id !== testimonialId);
	writeDatabase(db);
}

export function getMenuItems(): MenuItem[] {
	const db = readDatabase();
	const items = db.menuItems || [];
	const categorySettings = getMenuCategorySettings();
	
	// Create a map of category to order
	const categoryOrderMap = new Map<string, number>();
	categorySettings.categories.forEach(cat => {
		categoryOrderMap.set(cat.name, cat.order);
	});
	
	// Sort by category order first, then by order within category
	return items.sort((a, b) => {
		const categoryOrderA = categoryOrderMap.get(a.category) ?? 999;
		const categoryOrderB = categoryOrderMap.get(b.category) ?? 999;
		if (categoryOrderA !== categoryOrderB) {
			return categoryOrderA - categoryOrderB;
		}
		const orderA = a.order ?? 999;
		const orderB = b.order ?? 999;
		return orderA - orderB;
	});
}

export function addMenuItem(menuItem: MenuItem): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	db.menuItems.push(menuItem);
	writeDatabase(db);
}

export function updateMenuItem(menuItemId: string, updatedMenuItem: Partial<MenuItem>): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	const index = db.menuItems.findIndex(m => m.id === menuItemId);
	if (index !== -1) {
		db.menuItems[index] = { ...db.menuItems[index], ...updatedMenuItem };
		writeDatabase(db);
	}
}

export function removeMenuItem(menuItemId: string): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	db.menuItems = db.menuItems.filter(m => m.id !== menuItemId);
	writeDatabase(db);
}

export function getMenuCategorySettings(): MenuCategorySettings {
	const db = readDatabase();
	if (!db.menuCategorySettings || !db.menuCategorySettings.categories) {
		// Initialize from existing menu items
		const categorySet = new Set<string>();
		const items = db.menuItems || [];
		items.forEach(item => {
			if (item.category && item.category.trim()) {
				categorySet.add(item.category.trim());
			}
		});
		
		const categories: MenuCategory[] = Array.from(categorySet).map((name, index) => ({
			name,
			order: index
		}));
		
		const settings: MenuCategorySettings = { categories };
		db.menuCategorySettings = settings;
		writeDatabase(db);
		return settings;
	}
	return db.menuCategorySettings;
}

export function updateMenuCategorySettings(settings: MenuCategorySettings): void {
	const db = readDatabase();
	db.menuCategorySettings = settings;
	writeDatabase(db);
}

export function renameMenuCategory(oldName: string, newName: string): void {
	const db = readDatabase();
	if (!db.menuItems) {
		return;
	}
	
	// Update all menu items with the old category name
	db.menuItems.forEach(item => {
		if (item.category === oldName) {
			item.category = newName;
		}
	});
	
	// Update category settings
	if (db.menuCategorySettings) {
		const category = db.menuCategorySettings.categories.find(c => c.name === oldName);
		if (category) {
			category.name = newName;
		}
	}
	
	writeDatabase(db);
}

export function getOpeningTimes(): OpeningTimes | null {
	const db = readDatabase();
	return db.openingTimes || null;
}

export function updateOpeningTimes(openingTimes: OpeningTimes): void {
	const db = readDatabase();
	db.openingTimes = openingTimes;
	writeDatabase(db);
}

export function getActivitiesSettings(): ActivitiesSettings {
	const db = readDatabase();
	return db.activitiesSettings || {
		hidden: false,
		message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!'
	};
}

export function updateActivitiesSettings(settings: ActivitiesSettings): void {
	const db = readDatabase();
	db.activitiesSettings = settings;
	writeDatabase(db);
}

export function getBannerSettings(): BannerSettings {
	const db = readDatabase();
	return db.bannerSettings || {
		message: '',
		enabled: false,
		icon: 'none',
		endIcon: 'none'
	};
}

export function updateBannerSettings(settings: BannerSettings): void {
	const db = readDatabase();
	db.bannerSettings = settings;
	writeDatabase(db);
}

export function getImages(): SiteImage[] {
	const db = readDatabase();
	return db.images || [];
}

export function addImage(image: SiteImage): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	db.images.push(image);
	writeDatabase(db);
}

export function updateImage(imageId: string, updatedImage: Partial<SiteImage>): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	const index = db.images.findIndex(img => img.id === imageId);
	if (index !== -1) {
		db.images[index] = { ...db.images[index], ...updatedImage };
		writeDatabase(db);
	}
}

export function removeImage(imageId: string): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	db.images = db.images.filter(img => img.id !== imageId);
	writeDatabase(db);
}

/**
 * Populates the image library with images currently used by activities
 * Only adds images that don't already exist in the library
 */
export function populateImagesFromActivities(): { added: number; skipped: number } {
	const db = readDatabase();
	const activities = db.activities || [];
	
	// Initialize images array if it doesn't exist
	if (!db.images) {
		db.images = [];
	}
	
	// Get all unique image paths from activities
	const activityImagePaths = new Set<string>();
	activities.forEach(activity => {
		if (activity.image && activity.image.trim()) {
			activityImagePaths.add(activity.image.trim());
		}
	});
	
	// Get existing image paths to avoid duplicates
	const existingPaths = new Set(db.images.map(img => img.path));
	
	let added = 0;
	let skipped = 0;
	
	// Create image entries for each unique activity image
	activityImagePaths.forEach(path => {
		if (existingPaths.has(path)) {
			skipped++;
			return;
		}
		
		// Generate a friendly name from the path
		const filename = path.split('/').pop() || 'image';
		const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
		const name = nameWithoutExt
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		
		// Determine category based on filename
		let category = 'activities';
		const lowerPath = path.toLowerCase();
		if (lowerPath.includes('coffee')) {
			category = 'coffee';
		} else if (lowerPath.includes('pastries') || lowerPath.includes('food')) {
			category = 'food';
		}
		
		// Generate alt text
		const alt = name || filename;
		
		const newImage: SiteImage = {
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
			name: name || filename,
			path: path,
			alt: alt,
			category: category
		};
		
		if (!db.images) {
			db.images = [];
		}
		db.images.push(newImage);
		existingPaths.add(path); // Add to set to avoid duplicates in the same run
		added++;
	});
	
	if (added > 0) {
		writeDatabase(db);
	}
	
	return { added, skipped };
}

/**
 * Populates the image library with images currently used by opening times
 * Only adds images that don't already exist in the library
 */
export function populateImagesFromOpeningTimes(): { added: number; skipped: number } {
	const db = readDatabase();
	const openingTimes = db.openingTimes;
	
	// Initialize images array if it doesn't exist
	if (!db.images) {
		db.images = [];
	}
	
	// Get existing image paths to avoid duplicates
	const existingPaths = new Set(db.images.map(img => img.path));
	
	let added = 0;
	let skipped = 0;
	
	// Check if opening times has a background image
	if (openingTimes && openingTimes.backgroundImage && openingTimes.backgroundImage.trim()) {
		const path = openingTimes.backgroundImage.trim();
		
		// Only add if it's a local image (starts with /images/)
		if (path.startsWith('/images/')) {
			if (existingPaths.has(path)) {
				skipped++;
			} else {
				// Generate a friendly name from the path
				const filename = path.split('/').pop() || 'image';
				const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
				const name = nameWithoutExt
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
				
				// Determine category
				let category = 'opening-times';
				const lowerPath = path.toLowerCase();
				if (lowerPath.includes('coffee')) {
					category = 'coffee';
				} else if (lowerPath.includes('pastries') || lowerPath.includes('food')) {
					category = 'food';
				}
				
				// Generate alt text
				const alt = name || filename;
				
				const newImage: SiteImage = {
					id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
					name: name || filename,
					path: path,
					alt: alt,
					category: category
				};
				
				db.images.push(newImage);
				existingPaths.add(path);
				added++;
			}
		}
	}
	
	if (added > 0) {
		writeDatabase(db);
	}
	
	return { added, skipped };
}

// Default navigation items
const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
	{ path: '/', label: 'Home', hidden: false },
	{ path: '/about', label: 'About Us', hidden: false },
	{ path: '/menu', label: 'Menu', hidden: false },
	{ path: '/opening-times', label: 'Opening Times', hidden: false },
	{ path: '/activities', label: 'Kids Activities', hidden: false },
	{ path: '/events', label: 'Events', hidden: false },
	{ path: '/donate', label: 'Donate', hidden: false },
	{ path: '/contact', label: 'Contact Us', hidden: false }
];

export function getNavigationSettings(): NavigationSettings {
	const db = readDatabase();
	if (!db.navigationSettings || !db.navigationSettings.items) {
		// Initialize with default items
		const defaultSettings: NavigationSettings = {
			items: DEFAULT_NAVIGATION_ITEMS.map(item => ({ ...item }))
		};
		// Save defaults to database
		db.navigationSettings = defaultSettings;
		writeDatabase(db);
		return defaultSettings;
	}
	
	// Merge in any missing default items (for cases where new items are added to defaults)
	const existingPaths = new Set(db.navigationSettings.items.map(item => item.path));
	const missingItems = DEFAULT_NAVIGATION_ITEMS.filter(item => !existingPaths.has(item.path));
	
	if (missingItems.length > 0) {
		// Add missing items to existing settings
		db.navigationSettings.items.push(...missingItems.map(item => ({ ...item })));
		writeDatabase(db);
	}
	
	return db.navigationSettings;
}

export function updateNavigationSettings(settings: NavigationSettings): void {
	const db = readDatabase();
	db.navigationSettings = settings;
	writeDatabase(db);
}

export function getPageBackgroundImages(): PageBackgroundImages {
	const db = readDatabase();
	return db.pageBackgrounds || {};
}

export function updatePageBackgroundImages(backgrounds: PageBackgroundImages): void {
	const db = readDatabase();
	db.pageBackgrounds = backgrounds;
	writeDatabase(db);
}

export function getPageBackgroundImage(path: string): string | null {
	const backgrounds = getPageBackgroundImages();
	return backgrounds[path] || null;
}

export function getHeroSliderSettings(): HeroSliderSettings {
	const db = readDatabase();
	if (!db.heroSliderSettings || !db.heroSliderSettings.images || db.heroSliderSettings.images.length === 0) {
		// Return empty hero slider settings if none exist
		return {
			images: []
		};
	}
	return db.heroSliderSettings;
}

export function updateHeroSliderSettings(settings: HeroSliderSettings): void {
	const db = readDatabase();
	db.heroSliderSettings = settings;
	writeDatabase(db);
}

export function getGallerySettings(): GallerySettings {
	const db = readDatabase();
	if (!db.gallerySettings || !db.gallerySettings.images || db.gallerySettings.images.length === 0) {
		// Return empty gallery settings if none exist
		return {
			images: []
		};
	}
	return db.gallerySettings;
}

export function updateGallerySettings(settings: GallerySettings): void {
	const db = readDatabase();
	db.gallerySettings = settings;
	writeDatabase(db);
}

export function getTvScreenSettings(): TvScreenSettings {
	const db = readDatabase();
	if (!db.tvScreenSettings || !db.tvScreenSettings.images || db.tvScreenSettings.images.length === 0) {
		// Initialize with empty settings
		const defaultSettings: TvScreenSettings = {
			images: [],
			transitionDuration: 5000
		};
		// Save defaults to database
		db.tvScreenSettings = defaultSettings;
		writeDatabase(db);
		return defaultSettings;
	}
	// Ensure transitionDuration has a default value
	if (!db.tvScreenSettings.transitionDuration) {
		db.tvScreenSettings.transitionDuration = 5000;
		writeDatabase(db);
	}
	return db.tvScreenSettings;
}

export function updateTvScreenSettings(settings: TvScreenSettings): void {
	const db = readDatabase();
	db.tvScreenSettings = settings;
	writeDatabase(db);
}

export function getEventsSettings(): EventsSettings {
	const db = readDatabase();
	return db.eventsSettings || {
		hideFromHomePage: false
	};
}

export function updateEventsSettings(settings: EventsSettings): void {
	const db = readDatabase();
	db.eventsSettings = settings;
	writeDatabase(db);
}

function readSpecialOffersDatabase(): SpecialOffersDatabase {
	console.log('[DB] readSpecialOffersDatabase() called');
	const dbPath = getSpecialOffersDbPath();
	console.log('[DB] Special offers DB path:', dbPath);
	
	try {
		const data = readFileSync(dbPath, 'utf-8');
		console.log('[DB] Successfully read special offers database');
		return JSON.parse(data);
	} catch (error) {
		console.warn('[DB] Failed to read special offers database:', error);
		
		// If file doesn't exist, try to initialize from git version
		// This helps on Railway when using persistent storage
		try {
			const gitDbPath = join(process.cwd(), './data/specialOffers.json');
			console.log('[DB] Attempting to initialize special offers from git:', gitDbPath);
			if (gitDbPath !== SPECIAL_OFFERS_DB_PATH && existsSync(gitDbPath)) {
				const gitData = readFileSync(gitDbPath, 'utf-8');
				const db = JSON.parse(gitData);
				// Copy to persistent location
				try {
					writeSpecialOffersDatabase(db);
					console.log('[DB] Successfully copied special offers database');
				} catch (writeError) {
					// If write fails, just return the db without saving
					console.warn('[DB] Could not write special offers database to persistent location:', writeError);
				}
				return db;
			}
		} catch (initError) {
			// Ignore initialization errors
			console.warn('[DB] Could not initialize special offers from git database:', initError);
		}
		
		// If file doesn't exist, return default structure
		console.log('[DB] Returning default empty special offers structure');
		return {
			offers: []
		};
	}
}

function writeSpecialOffersDatabase(data: SpecialOffersDatabase): void {
	console.log('[DB] writeSpecialOffersDatabase() called');
	const dbPath = getSpecialOffersDbPath();
	console.log('[DB] Writing special offers to path:', dbPath);
	
	// Ensure directory exists before writing (in case it wasn't created earlier)
	const dir = dirname(dbPath);
	console.log('[DB] Ensuring special offers directory exists:', dir);
	try {
		mkdirSync(dir, { recursive: true });
		console.log('[DB] Special offers directory ready:', dir);
	} catch (error) {
		// Directory might already exist, ignore
		console.warn('[DB] Special offers directory creation warning (may already exist):', error);
	}
	
	try {
		const jsonData = JSON.stringify(data, null, 2);
		console.log('[DB] Writing', jsonData.length, 'bytes to special offers database');
		writeFileSync(dbPath, jsonData, 'utf-8');
		console.log('[DB] Successfully wrote special offers database to', dbPath);
	} catch (error) {
		// If write fails (e.g., volume not mounted during build), log but don't crash
		console.error('[DB] Could not write special offers database to', dbPath, ':', error);
		console.error('[DB] Write error details:', error instanceof Error ? error.message : String(error));
		if (error instanceof Error && 'code' in error) {
			console.error('[DB] Error code:', (error as any).code);
		}
		throw error; // Re-throw so caller can handle it
	}
}

export function getSpecialOffers(): SpecialOffer[] {
	const db = readSpecialOffersDatabase();
	return db.offers || [];
}

export function addSpecialOffer(offer: SpecialOffer): void {
	const db = readSpecialOffersDatabase();
	if (!db.offers) {
		db.offers = [];
	}
	db.offers.push(offer);
	writeSpecialOffersDatabase(db);
}

export function updateSpecialOffer(offerId: string, updatedOffer: Partial<SpecialOffer>): void {
	const db = readSpecialOffersDatabase();
	if (!db.offers) {
		db.offers = [];
	}
	const index = db.offers.findIndex(o => o.id === offerId);
	if (index !== -1) {
		db.offers[index] = { ...db.offers[index], ...updatedOffer };
		writeSpecialOffersDatabase(db);
	}
}

export function removeSpecialOffer(offerId: string): void {
	const db = readSpecialOffersDatabase();
	if (!db.offers) {
		db.offers = [];
	}
	db.offers = db.offers.filter(o => o.id !== offerId);
	writeSpecialOffersDatabase(db);
}


import { writable } from 'svelte/store';

export interface Activity {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
	time: string;
	endTime?: string; // End time string (HH:MM)
	price: number;
	capacity: number;
	emailInformation?: string; // Information to be emailed to customers (not displayed on front end)
}

export interface Event {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string; // ISO date string (YYYY-MM-DD) - used for initial date or single events
	time: string; // Start time string (HH:MM)
	endTime?: string; // End time string (HH:MM) - optional
	recurring?: string[]; // Array of day names (e.g., ["Wednesday", "Thursday", "Friday"]) - if set, event repeats on these days
}

export interface SpecialOffer {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	emailInformation?: string;
}

export interface CartItem {
	id: string;
	title: string; // For activities or name for special offers
	description: string;
	image: string;
	price: number;
	quantity: number;
	type: 'activity' | 'special-offer'; // To distinguish between activities and special offers
	date?: string; // Only for activities
	time?: string; // Only for activities
	endTime?: string; // Only for activities
	emailInformation?: string;
}

export const cart = writable<CartItem[]>([]);

export function addToCart(item: Activity | SpecialOffer) {
	cart.update(items => {
		const existing = items.find(cartItem => cartItem.id === item.id);
		if (existing) {
			existing.quantity += 1;
			return items;
		}
		
		// Determine if it's an activity or special offer
		const isActivity = 'date' in item && 'time' in item;
		
		const newItem: CartItem = {
			id: item.id,
			title: isActivity ? (item as Activity).title : (item as SpecialOffer).name,
			description: item.description,
			image: item.image,
			price: item.price,
			quantity: 1,
			type: isActivity ? 'activity' : 'special-offer',
			...(isActivity && { 
				date: (item as Activity).date, 
				time: (item as Activity).time,
				endTime: (item as Activity).endTime
			}),
			emailInformation: item.emailInformation
		};
		
		return [...items, newItem];
	});
}

export function removeFromCart(activityId: string) {
	cart.update(items => items.filter(item => item.id !== activityId));
}

export function updateQuantity(activityId: string, quantity: number) {
	cart.update(items => {
		return items.map(item => 
			item.id === activityId ? { ...item, quantity } : item
		).filter(item => item.quantity > 0);
	});
}

export function clearCart() {
	cart.set([]);
}


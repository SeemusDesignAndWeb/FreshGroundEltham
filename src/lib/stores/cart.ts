import { writable } from 'svelte/store';

export interface Activity {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
	time: string;
	price: number;
	capacity: number;
	emailInformation?: string; // Information to be emailed to customers (not displayed on front end)
}

export interface CartItem extends Activity {
	quantity: number;
}

export const cart = writable<CartItem[]>([]);

export function addToCart(activity: Activity) {
	cart.update(items => {
		const existing = items.find(item => item.id === activity.id);
		if (existing) {
			existing.quantity += 1;
			return items;
		}
		return [...items, { ...activity, quantity: 1 }];
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


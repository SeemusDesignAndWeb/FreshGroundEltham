import { writable } from 'svelte/store';

export const cart = writable([]);

export function addToCart(item) {
	cart.update(items => {
		const existing = items.find(cartItem => cartItem.id === item.id);
		if (existing) {
			existing.quantity += 1;
			return items;
		}
		
		// Determine if it's an activity or special offer
		const isActivity = 'date' in item && 'time' in item;
		
		const newItem = {
			id: item.id,
      title: isActivity ? item.title : item.name,
			description: item.description,
			image: item.image,
			price: item.price,
			quantity: 1,
      type: isActivity ? 'activity' : 'special-offer',
			...(isActivity && { 
				date: item.date, 
				time: item.time 
			}),
			emailInformation: item.emailInformation
		};
		
		return [...items, newItem];
	});
}

export function removeFromCart(activityId) {
	cart.update(items => items.filter(item => item.id !== activityId));
}

export function updateQuantity(activityId, quantity) {
	cart.update(items => {
		return items.map(item => 
			item.id === activityId ? { ...item, quantity } : item
		).filter(item => item.quantity > 0);
	});
}

export function clearCart() {
	cart.set([]);
}


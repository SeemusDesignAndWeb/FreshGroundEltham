import { writable } from 'svelte/store';

const notifications = writable([]);

export function showNotification(
	message,
	type = 'info',
	duration = 5000
){
	const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
	const notification = { id, message, type, duration };
	
	notifications.update(current => [...current, notification]);
	
	// Auto-remove after duration
	if (duration > 0) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}
}

export function removeNotification(id) {
	notifications.update(current => current.filter(n => n.id !== id));
}

export function clearNotifications() {
	notifications.set([]);
}

// Convenience functions
export const notify = {
	success: (message, duration) => showNotification(message, 'success', duration),
	error: (message, duration) => showNotification(message, 'error', duration || 7000),
	info: (message, duration) => showNotification(message, 'info', duration),
	warning: (message, duration) => showNotification(message, 'warning', duration)
};

export { notifications };


import { writable } from 'svelte/store';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
	id: string;
	message: string;
	type: NotificationType;
	duration?: number; // Auto-dismiss duration in milliseconds (default: 5000)
}

const notifications = writable<Notification[]>([]);

export function showNotification(
	message: string,
	type: NotificationType = 'info',
	duration: number = 5000
): void {
	const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
	const notification: Notification = { id, message, type, duration };
	
	notifications.update(current => [...current, notification]);
	
	// Auto-remove after duration
	if (duration > 0) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}
}

export function removeNotification(id: string): void {
	notifications.update(current => current.filter(n => n.id !== id));
}

export function clearNotifications(): void {
	notifications.set([]);
}

// Convenience functions
export const notify = {
	success: (message: string, duration?: number) => showNotification(message, 'success', duration),
	error: (message: string, duration?: number) => showNotification(message, 'error', duration || 7000),
	info: (message: string, duration?: number) => showNotification(message, 'info', duration),
	warning: (message: string, duration?: number) => showNotification(message, 'warning', duration)
};

export { notifications };


import { writable } from 'svelte/store';

// Default activities for kids during half term and school holidays
const defaultActivities= [
	{
		id: '1',
		title: 'Craft Workshop',
		description: 'Creative arts and crafts session for children aged 5-12. All materials provided.',
		image: '/images/pastries.jpg',
		date: '2025-02-17',
		time: '10:00',
		price: 5.00,
		capacity: 15
	},
	{
		id: '2',
		title: 'Story Time',
		description: 'Interactive storytelling session with engaging books and activities. Perfect for ages 3-8.',
		image: '/images/coffee-making.jpg',
		date: '2025-02-18',
		time: '11:00',
		price: 3.00,
		capacity: 20
	},
	{
		id: '3',
		title: 'Baking Fun',
		description: 'Kids baking workshop where children can learn to make simple treats. Ages 6+.',
		image: '/images/pastries.jpg',
		date: '2025-02-19',
		time: '10:30',
		price: 8.00,
		capacity: 12
	},
	{
		id: '4',
		title: 'Half Term Games',
		description: 'Fun games and activities session including board games, puzzles and group activities.',
		image: '/images/coffee-latte-art.jpg',
		date: '2025-02-20',
		time: '13:00',
		price: 4.00,
		capacity: 18
	}
];

export const activities = writable(defaultActivities);

export function addActivity(activity) {
	activities.update(items => [...items, activity]);
}

export function removeActivity(activityId) {
	activities.update(items => items.filter(item => item.id !== activityId));
}

export function updateActivity(activityId, updatedActivity) {
	activities.update(items => 
		items.map(item => 
			item.id === activityId ? { ...item, ...updatedActivity } )
	);
}


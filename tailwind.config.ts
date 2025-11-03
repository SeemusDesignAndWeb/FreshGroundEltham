import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				heading: ['Bello Pro', 'sans-serif'],
				body: ['Mr Eaves Sans', 'sans-serif'],
			},
			colors: {
				primary: {
					DEFAULT: '#39918c',
					dark: '#2f435a'
				},
				brown: {
					light: '#d0b49f',
					DEFAULT: '#ab6b51'
				},
				cornflower: '#2f435a',
				'blue-green': '#39918c'
			}
		}
	},

	plugins: []
} satisfies Config;

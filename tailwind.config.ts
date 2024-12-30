import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: { 50: '#FFF5F2', 100: '#FFF1EE', 200: '#FFE4DE', 300: '#FFD5CC', 400: '#FFBCAD', 500: '#FE795D', 600: '#EF562F', 700: '#EB4F27', 800: '#CC4522', 900: '#A5371B'},
				secondary: { 50: '#F2F4FF', 100: '#E6E8FF', 200: '#BFC4FF', 300: '#999FFF', 400: '#4D6BFF', 500: '#0027FF', 600: '#001FE6', 700: '#0019CC', 800: '#001399', 900: '#000DCC'},
				danger: { 50: '#FFF2F2', 100: '#FFE6E6', 200: '#FFBFC4', 300: '#FF999F', 400: '#FF4D6B', 500: '#FF0027', 600: '#E6001F', 700: '#CC0019', 800: '#990013', 900: '#CC000D'},
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;

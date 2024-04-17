/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"bgcontainer": "#50af95",
				"hoverbgcontainer": "#68c3aa",
				"share": ': hsla(165, 43%, 51%, 0.8)',
				"bgrba": 'rgba(0, 0, 0, 0.3)',
				"boderhex": "#F08080",
				"text": "#ffff",
				"Black": "#000",
				
			  },
			  boxShadow: {
				'boxshadowbottom': '0px 4px 8px rgba(255, 255, 255, 0.)',
			  },
		},
	},
	plugins: [],
}

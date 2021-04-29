/** @type {import('@sveltejs/kit').Config} */
const node = require('@sveltejs/adapter-node');

module.exports = {
	kit: {
		adapter: node(),
		target: '#svelte'
	}
};

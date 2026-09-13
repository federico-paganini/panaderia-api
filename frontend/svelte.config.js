import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Svelte + SvelteKit configuration.
 *
 * This lives in its own file rather than inline in `vite.config.ts` (where
 * `sv create` puts it) because `svelte-check` only reads THIS file. With the
 * config inline, svelte-check finds no preprocessor, silently SKIPS every
 * component that has `<style lang="scss">` — which is all of them — and still
 * reports zero errors.
 *
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
	// Hands `lang="scss"` (and `lang="ts"`) to Vite's own pipeline, so
	// components share the SCSS `loadPaths` configured in `vite.config.ts`.
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Force runes mode for our own code; leave libraries on their own setting.
		// Can be removed in Svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter()
	}
};

export default config;

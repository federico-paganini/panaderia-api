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
		adapter: adapter(),

		// Content Security Policy. Every route is prerendered, so SvelteKit emits
		// this as a `<meta http-equiv>` in each page rather than as a header —
		// which is why `frame-ancestors` is NOT here: browsers ignore it in a meta
		// tag. It is sent as a real header instead (see `vercel.json`).
		//
		// `mode: 'hash'` matters: the built page carries one inline script,
		// SvelteKit's own hydration bootstrap. Hashing it is what lets `script-src`
		// stay at `self` instead of opening `unsafe-inline` for everything.
		//
		// The policy is this tight because the site genuinely loads nothing from
		// anywhere else — fonts are self-hosted precisely so that stays true.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				// `unsafe-inline` for STYLES only, and deliberately. SvelteKit's client
				// creates its screen-reader live region after hydration and hides it with
				// an inline style, so a strict `style-src` logs a violation on every page
				// load — noise that trains people to ignore CSP errors and would bury a
				// real one. What makes injected CSS dangerous is exfiltration, and those
				// sinks are already shut by `img-src` and `connect-src` above. `script-src`
				// stays strict with a hash, which is where the real risk lives.
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		},

		// Asserted rather than left to the default. It protects nothing today —
		// the site is fully prerendered, has no form, no POST handler and no
		// cookie — so this exists for the day someone adds one. An EMPTY
		// allowlist means no cross-origin exception at all, which is the strict
		// posture; SvelteKit then rejects any form or POST whose Origin does not
		// match the server.
		csrf: { trustedOrigins: [] }
	}
};

export default config;

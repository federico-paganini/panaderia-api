import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				// Lets any component reach the design scale with `@use 'styles' as *;`
				// instead of a relative climb out of its own folder.
				loadPaths: ['src/lib']
			}
		}
	},
	// Since SvelteKit 3 every Svelte and SvelteKit option is passed to the
	// `sveltekit()` plugin below; there is no `svelte.config.js`. svelte-check
	// reads it from here — verified on 2026-10-10 by planting a type error and
	// an undefined Sass variable in a component with `<style lang="scss">`:
	// both reported. (SvelteKit 2 made it read only `svelte.config.js`, and with
	// the config inline it skipped every SCSS component in silence.)
	//
	// `enhancedImages()` turns `<enhanced:img>` into a `<picture>` with AVIF and
	// WebP at several widths, and writes `width`/`height` so nothing shifts on
	// load. It must come before `sveltekit()`: it preprocesses the components.
	plugins: [
		enhancedImages(),
		sveltekit({
			// Hands `lang="scss"` (and `lang="ts"`) to Vite's own pipeline, so
			// components share the SCSS `loadPaths` configured in `vite.config.ts`.
			preprocess: vitePreprocess(),

			compilerOptions: {
				// Force runes mode for our own code; leave libraries on their own setting.
				// Can be removed in Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			// Content Security Policy. Every route is prerendered, so SvelteKit emits
			// this as a `<meta http-equiv>` in each page rather than as a header —
			// which is why `frame-ancestors` is NOT here: browsers ignore it in a meta
			// tag. It is sent as a real header instead (`scripts/security-headers.mjs`).
			//
			// `mode: 'hash'` matters: the built page carries one inline script,
			// SvelteKit's own hydration bootstrap. Hashing it is what lets `script-src`
			// stay at `self` instead of opening `unsafe-inline` for everything.
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
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					// `scripts/` is included on purpose: a build step that rewrites the
					// deploy output deserves a test as much as anything in `src/`, and
					// it does not belong under `src/`.
					include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});

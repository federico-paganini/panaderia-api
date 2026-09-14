import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';

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
	// Svelte and SvelteKit options live in `svelte.config.js` — svelte-check
	// reads only that file. See the docblock there.
	plugins: [sveltekit()],
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

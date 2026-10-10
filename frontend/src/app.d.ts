// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Brand } from '$lib/shared/brand';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/**
			 * The business the page belongs to, loaded by its route group's
			 * `+layout.ts`. Optional in the type only; read it through
			 * `currentBrand()`, which fails if a page sits outside a brand group.
			 */
			brand?: Brand;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

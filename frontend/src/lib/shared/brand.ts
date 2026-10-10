import { page } from '$app/state';
import type { LegalEntity } from './legal';

/**
 * One of the two businesses this site publishes. Each route group —
 * `(bakery)` and `(party-times)` — loads its brand in its `+layout.ts`, and
 * the shared components (`Nav`, `Logo`, `SeoHead`, `LegalFrame`, `MailLink`,
 * `PhoneLink`) render whichever brand the page belongs to.
 */
export interface Brand {
	/** Full name, for og:site_name and the like. */
	readonly name: string;
	/** What "Volver a …" and cross-links call it. */
	readonly shortName: string;
	/** What follows a page title: "Política de privacidad — {titleSuffix}". */
	readonly titleSuffix: string;
	/** The brand's landing. */
	readonly home: '/' | '/party-times';
	readonly entity: LegalEntity;
	readonly contact: {
		readonly phone: string;
		/** `tel:` URI, or null while the number is a placeholder. */
		readonly phoneHref: string | null;
		/** Click-to-chat link, or null while there is no number. */
		readonly whatsappHref: string | null;
		readonly email: string;
	};
	readonly logo: {
		readonly src: string;
		readonly alt: string;
		/** Width over height, so `<img>` can reserve its box before it loads. */
		readonly aspect: number;
	};
	/** "Última actualización" of each legal page. Bump with the text. */
	readonly privacyUpdated: string;
	readonly termsUpdated: string;
}

/**
 * The brand of the page being rendered. Every page sits under a brand group
 * (`src/routes/sitemap.xml/sitemap.spec.ts` checks it), so a missing brand is
 * a page in the wrong folder — fail loudly rather than fall back to one.
 */
export function currentBrand(): Brand {
	const brand = page.data.brand;
	if (!brand) throw new Error(`${page.url.pathname} is not under a brand route group.`);
	return brand;
}

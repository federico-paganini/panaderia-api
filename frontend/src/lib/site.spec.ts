import { describe, expect, it } from 'vitest';
import { LEGAL_ENTITY } from './legal/entity';
import { SITE, absoluteUrl } from './site';

describe('absoluteUrl', () => {
	it('resolves a path against the production domain', () => {
		expect(absoluteUrl('/privacy')).toBe('https://lasdeliciaslp.com/privacy');
	});

	it('keeps the root path', () => {
		expect(absoluteUrl('/')).toBe('https://lasdeliciaslp.com/');
	});

	it('never emits a protocol-relative or bare-host URL', () => {
		expect(absoluteUrl('/terms').startsWith('https://')).toBe(true);
	});
});

describe('site constants', () => {
	it('has no trailing slash on the base URL', () => {
		// `new URL(path, base)` treats a trailing slash as a directory; a stray
		// one here silently doubles up in every canonical link.
		expect(SITE.url.endsWith('/')).toBe(false);
	});
});

describe('legal entity', () => {
	// Meta's business verification matches these against the DGI certificate,
	// and the bot's app review depends on that match.
	it('carries a structurally valid Uruguayan RUT', () => {
		const rut = LEGAL_ENTITY.taxId;
		expect(rut).toMatch(/^\d{12}$/);

		const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		const sum = weights.reduce((acc, w, i) => acc + Number(rut[i]) * w, 0);
		expect(String((11 - (sum % 11)) % 11)).toBe(rut[11]);
	});

	it('reaches the contact address on the site’s own domain', () => {
		// The privacy policy publishes this as the channel for exercising rights
		// under Ley 18.331. An address on someone else's domain outlives nothing.
		const host = LEGAL_ENTITY.contactEmail.split('@')[1];
		expect(SITE.url).toContain(host);
	});
});

import { describe, expect, it } from 'vitest';
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

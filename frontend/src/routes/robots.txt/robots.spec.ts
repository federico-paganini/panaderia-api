import { describe, expect, it } from 'vitest';
import { ALLOWED_CRAWLERS, DENIED_CRAWLERS } from '$lib/crawlers';
import { GET } from './+server';

async function body() {
	return new Response(GET().body).text();
}

describe('robots.txt', () => {
	it('denies every crawler on the list, once', async () => {
		const text = await body();

		for (const ua of DENIED_CRAWLERS) {
			expect(text).toContain(`User-agent: ${ua}\n`);
		}
		expect(text.match(/^Disallow: \/$/gm)).toHaveLength(1);
	});

	it('keeps search engines welcome', async () => {
		const text = await body();

		expect(text).toContain('User-agent: Googlebot');
		expect(text).toContain('User-agent: Bingbot');
		// The catch-all stays open: a bakery wants to be found.
		expect(text).toMatch(/User-agent: \*\nAllow: \//);
	});

	it('never denies a Meta crawler', () => {
		// The one rule here that can break something outside this repository.
		// `/privacy` exists to get the WhatsApp app through Meta's review; a Meta
		// agent swept into the denied list — copying a stricter policy from
		// another project is exactly how that happens — would risk the single
		// thing the page is for.
		const meta = DENIED_CRAWLERS.filter((ua) => /facebook|meta-/i.test(ua));

		expect(meta, 'a Meta crawler is on the denied list').toEqual([]);
		expect(ALLOWED_CRAWLERS).toContain('facebookexternalhit');
	});

	it('points at the production sitemap', async () => {
		expect(await body()).toContain('Sitemap: https://lasdeliciaslp.com/sitemap.xml');
	});

	it('says plainly that it does not enforce', async () => {
		// Anyone reading this file should know it is a request, not a control.
		expect(await body()).toMatch(/does not enforce/i);
	});
});

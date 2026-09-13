import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES } from '$lib/routes';
import { SITE } from '$lib/site';
import { GET } from './+server';

/**
 * Every `+page.svelte` on disk, as the URL path it serves. Route groups —
 * `(legal)` — organise files without appearing in the URL, so they drop out.
 */
function routesOnDisk(): string[] {
	return readdirSync('src/routes', { recursive: true, encoding: 'utf8' })
		.filter((name) => name.endsWith('+page.svelte'))
		.map((name) => {
			const segments = name
				.split(/[/\\]/)
				.slice(0, -1)
				.filter((s) => !s.startsWith('('));
			return '/' + segments.join('/');
		})
		.map((path) => (path === '/' ? '/' : path.replace(/\/$/, '')));
}

describe('sitemap', () => {
	const listed = PUBLIC_ROUTES.map((r) => r.path);

	it('lists every page that exists', () => {
		// The direction that actually bites: a page added without a sitemap entry
		// is invisible to search, and nothing else would ever complain.
		expect([...routesOnDisk()].sort()).toEqual([...listed].sort());
	});

	it('emits absolute production URLs', async () => {
		const xml = await new Response(GET().body).text();

		for (const path of listed) {
			expect(xml).toContain(`<loc>${new URL(path, SITE.url).href}</loc>`);
		}
		expect(xml).not.toContain('vercel.app');
	});

	it('is well-formed and declares the sitemap namespace', async () => {
		const xml = await new Response(GET().body).text();

		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
		expect(xml.match(/<url>/g)).toHaveLength(listed.length);
		expect(xml.match(/<\/url>/g)).toHaveLength(listed.length);
	});
});

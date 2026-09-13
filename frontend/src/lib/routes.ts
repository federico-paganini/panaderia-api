/**
 * Every public page, in one list. The sitemap is generated from it, so a route
 * added here appears in the sitemap; `src/routes/sitemap.xml/sitemap.spec.ts`
 * checks the reverse — that no route exists on disk without an entry here.
 */
export const PUBLIC_ROUTES = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/privacy', changefreq: 'yearly', priority: '0.3' },
	{ path: '/terms', changefreq: 'yearly', priority: '0.3' }
] as const;

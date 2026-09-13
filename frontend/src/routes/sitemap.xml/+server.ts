import { PUBLIC_ROUTES } from '$lib/routes';
import { absoluteUrl } from '$lib/site';

export const prerender = true;

export function GET(): Response {
	const urls = PUBLIC_ROUTES.map(
		({ path, changefreq, priority }) => `\t<url>
\t\t<loc>${absoluteUrl(path)}</loc>
\t\t<changefreq>${changefreq}</changefreq>
\t\t<priority>${priority}</priority>
\t</url>`
	).join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}

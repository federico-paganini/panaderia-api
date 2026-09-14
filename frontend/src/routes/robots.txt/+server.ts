import { ALLOWED_CRAWLERS, DENIED_CRAWLERS } from '$lib/crawlers';
import { absoluteUrl } from '$lib/site';

export const prerender = true;

const BODY = `# Panadería y Confitería Las Delicias
#
# AI training crawlers, dataset builders and scrape-resellers are denied.
# Search engines are welcome — a bakery wants to be found.
#
# This file asks. It does not enforce: a crawler that ignores it is not stopped
# by anything here.

${DENIED_CRAWLERS.map((ua) => `User-agent: ${ua}`).join('\n')}
Disallow: /

${ALLOWED_CRAWLERS.map((ua) => `User-agent: ${ua}`).join('\n')}
Allow: /

User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

export function GET(): Response {
	return new Response(BODY, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}

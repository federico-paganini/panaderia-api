import { absoluteUrl } from '$lib/site';

export const prerender = true;

// Preview deployments serve this same body, but Vercel adds its own
// `X-Robots-Tag: noindex` header to them, and every page's canonical link
// points at the production domain — so a preview cannot outrank the real site.
const BODY = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

export function GET(): Response {
	return new Response(BODY, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}

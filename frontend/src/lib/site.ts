/**
 * Site identity: what is true of the whole site whichever business a page
 * belongs to. Facts about one business live in its brand module —
 * `$lib/bakery/brand` and `$lib/party-times/brand`.
 *
 * `url` is a committed constant rather than an env var on purpose. It is public
 * by definition — every page prints it in its canonical link — and it must NOT
 * follow the deployment: a preview has to declare the production domain as
 * canonical, or search engines index the preview instead.
 */
export const SITE = {
	url: 'https://lasdeliciaslp.com',
	locale: 'es-UY',
	/** BCP 47 tag for `<html lang>`; `locale` is the same value, kept separate in case one moves. */
	lang: 'es-UY'
} as const;

/** Absolute URL for a path, for canonical links, sitemaps and og:url. */
export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}

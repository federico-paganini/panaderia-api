/**
 * Site identity. Facts about the bakery that more than one page renders, in one
 * place so a correction lands everywhere at once.
 *
 * `url` is a committed constant rather than an env var on purpose. It is public
 * by definition — every page prints it in its canonical link — and it must NOT
 * follow the deployment: a Vercel preview has to declare the production domain
 * as canonical, or search engines index the preview instead.
 */
export const SITE = {
	name: 'Panadería y Confitería Las Delicias',
	shortName: 'Las Delicias',
	url: 'https://lasdeliciaslp.com',
	locale: 'es-UY',
	/** BCP 47 tag for `<html lang>`; `locale` is the same value, kept separate in case one moves. */
	lang: 'es-UY'
} as const;

export const ADDRESS = {
	street: 'Lavalleja 714',
	city: 'Las Piedras',
	department: 'Canelones',
	country: 'Uruguay',
	/** One line, the way the spec's hero info line prints it. */
	oneLine: 'Lavalleja 714 · Las Piedras, Canelones'
} as const;

/**
 * Opening hours. The counter opens before the phone is answered and closes
 * after it, so these are two different ranges and the site must not flatten
 * them into one — someone who walks over at 20:30 needs to know the door is
 * open even though nobody will pick up.
 */
export const HOURS = {
	days: 'Lunes a sábado',
	inPerson: '7:30 a 21:00',
	phone: '8:00 a 20:00'
} as const;

export const CONTACT = {
	phone: '+598 2364 1201',
	/** Tel: URI — no spaces, E.164. */
	phoneHref: 'tel:+59823641201'
} as const;

/** Absolute URL for a path, for canonical links, sitemaps and og:url. */
export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}

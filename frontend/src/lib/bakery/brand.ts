import type { Brand } from '$lib/shared/brand';
import { BAKERY_ENTITY } from './entity';
import logo from './logo-las-delicias.svg';

/** Facts about the bakery that more than one page renders, so a correction lands everywhere at once. */
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

/**
 * How long conversation data is kept in our own systems, in days. Published in
 * the privacy policy, which makes it a commitment rather than a preference:
 * whatever storage the WhatsApp bot ends up using (`~/Code/panaderia-bot`,
 * HANDOFF decision 5, still open) has to be able to delete on this schedule.
 */
export const RETENTION_DAYS = 30;

export const BAKERY: Brand = {
	name: 'Panadería y Confitería Las Delicias',
	shortName: 'Las Delicias',
	titleSuffix: 'Las Delicias',
	home: '/',
	entity: BAKERY_ENTITY,
	contact: {
		phone: BAKERY_ENTITY.phone,
		/** Tel: URI — no spaces, E.164. */
		phoneHref: 'tel:+59823641201',
		/** Click-to-chat link to +598 92 007 806. wa.me takes E.164 without the `+`. */
		whatsappHref: 'https://wa.me/59892007806',
		email: BAKERY_ENTITY.contactEmail
	},
	logo: { src: logo, alt: 'Panadería y Confitería Las Delicias', aspect: 2 },
	// Bump a page's date in the same commit that changes its text — the date is
	// what tells a reader, and Meta's app reviewer, that the document is current.
	privacyUpdated: '13 de septiembre de 2026',
	termsUpdated: '13 de septiembre de 2026'
};

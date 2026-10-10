import type { Brand } from '$lib/shared/brand';
import { PARTY_TIMES_ENTITY } from './entity';
import logo from './logo-party-times.svg';

/**
 * The party venue. A separate company with the same owners, so it gets its own
 * pages under `/party-times` rather than a section of the bakery's landing
 * (spec §1). Its facts are placeholders until Federico has them.
 */
export const PARTY_TIMES: Brand = {
	name: 'Las Delicias – Party Times',
	shortName: 'Party Times',
	titleSuffix: 'Las Delicias – Party Times',
	home: '/party-times',
	entity: PARTY_TIMES_ENTITY,
	contact: {
		phone: PARTY_TIMES_ENTITY.phone,
		phoneHref: null,
		whatsappHref: null,
		email: PARTY_TIMES_ENTITY.contactEmail
	},
	logo: { src: logo, alt: 'Las Delicias – Party Times, salón de eventos', aspect: 1 },
	// No dates until the pages have text.
	privacyUpdated: '[pendiente]',
	termsUpdated: '[pendiente]'
};

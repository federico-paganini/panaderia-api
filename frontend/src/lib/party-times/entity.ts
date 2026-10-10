import type { LegalEntity } from '#lib/shared/legal.js';

/**
 * The party venue, Las Delicias – Party Times: a separate company with the
 * same owners (Federico, 2026-10-10). Its legal pages render this, not the
 * bakery's entity.
 *
 * Every fact in brackets is still to come from Federico, and `isPending` turns
 * them into a switch: while any is left, the venue's pages stay out of search
 * and the bakery does not link to them.
 */
export const PARTY_TIMES_ENTITY: LegalEntity = {
	name: '[razón social del salón]',
	form: '[forma jurídica]',
	taxIdLabel: 'RUT',
	taxId: '[RUT del salón]',
	address: '[domicilio del salón]',
	country: 'Uruguay',
	phone: '[teléfono del salón]',
	// A new alias for the venue, to be created; where it forwards is still open.
	contactEmail: '[mail de privacidad del salón]'
};

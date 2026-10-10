import { describe, expect, it } from 'vitest';
import { BAKERY_ENTITY } from '#lib/bakery/entity.js';
import { PARTY_TIMES_ENTITY } from '#lib/party-times/entity.js';
import { SITE } from '#lib/site.js';
import { isPending, isPlaceholder, type LegalEntity } from './legal';

/** DGI's RUT: twelve digits, the last a mod-11 check over the first eleven. */
function expectValidRut(rut: string) {
	expect(rut).toMatch(/^\d{12}$/);

	const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const sum = weights.reduce((acc, w, i) => acc + Number(rut[i]) * w, 0);
	expect(String((11 - (sum % 11)) % 11)).toBe(rut[11]);
}

describe('placeholders', () => {
	it('are the bracketed values, and one is enough to make an entity pending', () => {
		expect(isPlaceholder('[RUT del salón]')).toBe(true);
		expect(isPlaceholder('080097130018')).toBe(false);

		const complete: LegalEntity = { ...BAKERY_ENTITY };
		expect(isPending(complete)).toBe(false);
		expect(isPending({ ...complete, taxId: '[RUT]' })).toBe(true);
	});
});

// Both companies, the same checks. A check that cannot run yet — the venue's
// facts are still placeholders — is skipped rather than passed: that state is
// guarded end to end instead (its pages are noindex and nothing links to them),
// and the moment the last bracket goes, these start running by themselves.
describe.each([
	['bakery', BAKERY_ENTITY],
	['party venue', PARTY_TIMES_ENTITY]
] as const)('%s legal entity', (_name, entity) => {
	const pending = isPending(entity);

	// Meta's business verification matches these against the DGI certificate,
	// and the bot's app review depends on that match.
	it.skipIf(pending)('carries a structurally valid Uruguayan RUT', () => {
		expectValidRut(entity.taxId);
	});

	it.skipIf(pending)('reaches its contact address on the site’s own domain', () => {
		// The privacy policy publishes this as the channel for exercising rights
		// under Ley 18.331. An address on someone else's domain outlives nothing.
		expect(SITE.url).toContain(entity.contactEmail.split('@')[1]);
	});
});

describe('the two companies', () => {
	it('the bakery’s facts are complete', () => {
		// It publishes legal pages today; a placeholder here would be live.
		expect(isPending(BAKERY_ENTITY)).toBe(false);
	});

	it('are not the same company', () => {
		// The whole reason the venue has its own pages.
		expect(PARTY_TIMES_ENTITY.name).not.toBe(BAKERY_ENTITY.name);
		expect(PARTY_TIMES_ENTITY.taxId).not.toBe(BAKERY_ENTITY.taxId);
	});
});

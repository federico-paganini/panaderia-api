/**
 * What a company publishing legal pages here has to state about itself. Two do:
 * the bakery and the party venue, separate companies with the same owners.
 *
 * Plain data and plain functions, no framework import: the e2e suite reads the
 * venue's entity from Node to know whether its pages are still placeholders.
 */
export interface LegalEntity {
	readonly name: string;
	readonly form: string;
	readonly taxIdLabel: string;
	readonly taxId: string;
	readonly address: string;
	readonly country: string;
	readonly phone: string;
	readonly contactEmail: string;
}

/**
 * True for a fact still to come. Spec §8: unknown facts are bracketed
 * placeholders, never invented — so a bracket is the marker.
 */
export function isPlaceholder(value: string): boolean {
	return value.includes('[');
}

/** True while any field of the entity is still a placeholder. */
export function isPending(entity: LegalEntity): boolean {
	return Object.values(entity).some(isPlaceholder);
}

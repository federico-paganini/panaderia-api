/**
 * "Last updated" dates for the legal pages. Bump a page's date in the same
 * commit that changes its text — the date is what tells a reader, and Meta's
 * app reviewer, that the document is current.
 */

/** Privacy policy (`/privacy`). */
export const PRIVACY_UPDATED = '13 de septiembre de 2026';

/** Terms of use (`/terms`). */
export const TERMS_UPDATED = '13 de septiembre de 2026';

/**
 * How long conversation data is kept in our own systems, in days. Published in
 * the privacy policy, which makes it a commitment rather than a preference:
 * whatever storage the WhatsApp bot ends up using (`~/Code/panaderia-bot`,
 * HANDOFF decision 5, still open) has to be able to delete on this schedule.
 */
export const RETENTION_DAYS = 30;

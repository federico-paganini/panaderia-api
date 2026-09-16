/**
 * The legal entity behind the bakery and the WhatsApp bot, as registered with
 * Uruguay's DGI. The privacy policy and the terms both render it.
 *
 * Meta's business verification matches the legal name and address against the
 * RUT certificate, so these must stay identical to it — the bot's app review
 * depends on it (`~/Code/panaderia-bot/docs/HANDOFF.md`).
 *
 * The check digit of the RUT below validates (weights 4,3,2,9,8,7,6,5,4,3,2;
 * sum 168, remainder 3, verifier 8).
 */
export const LEGAL_ENTITY = {
	name: 'GERALNA LTDA.',
	form: 'Sociedad de responsabilidad limitada',
	taxIdLabel: 'RUT',
	taxId: '080097130018',
	address: 'Lavalleja 714, Las Piedras, Canelones, Uruguay',
	country: 'Uruguay',
	phone: '+598 2364 1201',

	// Live since 2026-09-16, forwarded through forwardemail.net (the domain's MX
	// records point there). This is the channel data subjects use to exercise
	// their rights under Uruguay's Ley 18.331, and `/privacy` publishes it — so
	// it has to keep receiving. Changing it means changing a published legal
	// document, not just a constant.
	contactEmail: 'privacidad@lasdeliciaslp.com'
} as const;

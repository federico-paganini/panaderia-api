/**
 * Who may crawl this site, as `robots.txt` declares it.
 *
 * Kept out of the route file because SvelteKit only permits a fixed set of
 * exports there — and because a policy worth having is worth testing.
 */

/** Crawlers that build training corpora or resell scraped content. Denied. */
export const DENIED_CRAWLERS = [
	// Anthropic
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	'anthropic-ai',
	// OpenAI
	'GPTBot',
	'ChatGPT-User',
	'OAI-SearchBot',
	// Google's AI-training crawler — distinct from Googlebot, which is allowed
	'Google-Extended',
	// Perplexity
	'PerplexityBot',
	'Perplexity-User',
	// xAI
	'xAI',
	'GrokBot',
	// ByteDance, Apple, Amazon
	'Bytespider',
	'Applebot-Extended',
	'Amazonbot',
	// Dataset builders and scrape-resellers
	'cohere-ai',
	'CCBot',
	'Diffbot',
	'Omgilibot',
	'Timpibot',
	'DataForSeoBot',
	'ImagesiftBot'
] as const;

/**
 * Named explicitly so a future tightening of the catch-all cannot sweep them up
 * by accident.
 *
 * `facebookexternalhit` is the one that matters and the reason no Meta agent
 * appears in the denied list, even though a stricter policy elsewhere blocks
 * them: `/privacy` exists to get the WhatsApp app through Meta's review.
 * Blocking a Meta crawler to keep a bakery's opening hours out of a training
 * set would risk the single thing this page is for.
 */
export const ALLOWED_CRAWLERS = ['Googlebot', 'Bingbot', 'facebookexternalhit'] as const;

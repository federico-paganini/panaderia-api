import { describe, expect, it } from 'vitest';
import { SECURITY_HEADERS, withSecurityHeaders } from './security-headers.mjs';

/**
 * These headers cannot be asserted from the built output in a unit test, and by
 * the time they are wrong the site is already serving without them — so the
 * transform is pinned here instead.
 */
describe('withSecurityHeaders', () => {
	const base = { version: 3, routes: [{ src: '/privacy', dest: '/privacy/' }] };

	it('prepends a rule carrying every header', () => {
		const [rule] = withSecurityHeaders(base).routes;

		expect(Object.keys(rule.headers).sort()).toEqual(Object.keys(SECURITY_HEADERS).sort());
	});

	it('keeps the adapter’s own routes, after it', () => {
		const { routes } = withSecurityHeaders(base);

		expect(routes).toHaveLength(2);
		expect(routes[1]).toEqual(base.routes[0]);
	});

	it('lets the request fall through', () => {
		// Without `continue`, this rule would ANSWER every request instead of
		// decorating it, and the site would serve nothing but headers.
		expect(withSecurityHeaders(base).routes[0].continue).toBe(true);
	});

	it('carries frame-ancestors, which a meta tag cannot', () => {
		// The rest of the policy is emitted as `<meta http-equiv>` by SvelteKit.
		// Browsers ignore `frame-ancestors` there, so it has to be a real header
		// or the site is framable while looking protected.
		expect(SECURITY_HEADERS['Content-Security-Policy']).toContain("frame-ancestors 'none'");
	});

	it('refuses a Build Output API version it does not understand', () => {
		// A silent pass-through on a future version would ship a site with no
		// headers and a green build.
		expect(() => withSecurityHeaders({ version: 4, routes: [] })).toThrow(/version 3/);
	});
});

/**
 * Adds the response headers that a `<meta>` tag cannot carry to the Build
 * Output API config the Vercel adapter generates.
 *
 * Why a build step rather than `vercel.json`: the deploy runs
 * `vercel deploy --prebuilt`, which ships `.vercel/output` as-is. Nothing
 * compiles `vercel.json` into `config.json` on that path, so a `headers` block
 * there is silently ignored — verified against a preview deployment on
 * 2026-09-14, which answered with no `X-Frame-Options`, no `Referrer-Policy`
 * and no header CSP.
 *
 * The rest of the Content Security Policy lives in `svelte.config.js` and is
 * emitted as a `<meta http-equiv>` in each prerendered page. Only
 * `frame-ancestors` is repeated here, because browsers ignore that directive
 * in a meta tag. The two policies do not conflict: a browser enforces both,
 * and neither one relaxes the other.
 */
import { readFile, writeFile } from 'node:fs/promises';

const CONFIG = '.vercel/output/config.json';

export const SECURITY_HEADERS = {
	// Ignored in a meta tag, so it has to be a real header.
	'Content-Security-Policy': "frame-ancestors 'none'",
	// Same intent, for browsers that predate frame-ancestors.
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy':
		'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
};

/**
 * Returns the config with a header rule prepended. `continue: true` is what
 * makes it additive: the request keeps falling through to the routes the
 * adapter generated instead of being answered here.
 *
 * @param {{ version: number, routes?: unknown[] }} config
 */
export function withSecurityHeaders(config) {
	if (config.version !== 3) {
		throw new Error(`Expected Build Output API version 3, got ${config.version}.`);
	}

	const rule = { src: '/(.*)', headers: { ...SECURITY_HEADERS }, continue: true };
	return { ...config, routes: [rule, ...(config.routes ?? [])] };
}

// Only when run as a script, so the function above stays importable by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
	const config = withSecurityHeaders(JSON.parse(await readFile(CONFIG, 'utf8')));
	await writeFile(CONFIG, JSON.stringify(config, null, '\t') + '\n');

	const written = JSON.parse(await readFile(CONFIG, 'utf8'));
	const applied = Object.keys(written.routes[0]?.headers ?? {});
	if (applied.length !== Object.keys(SECURITY_HEADERS).length) {
		throw new Error('Security headers were not written back to the build output.');
	}
	console.log(`security headers applied: ${applied.join(', ')}`);
}

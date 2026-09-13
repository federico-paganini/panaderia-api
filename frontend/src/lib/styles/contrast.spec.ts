import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

// Makes the accessibility claim in `docs/landing-design-spec.md` §4 executable.
// The spec's table was computed once, by hand, against the light palette; this
// recomputes it from the COMPILED stylesheet on every run, and covers the dark
// palette the table does not yet list. Edit a colour and break a pair, and the
// suite says which pair and by how much — instead of the site shipping it.

const compiled = sass.compile('src/lib/styles/_themes.scss').css;

function paletteIn(selector: RegExp): Record<string, string> {
	const block = compiled.match(selector)?.[0] ?? '';
	expect(block, `no rule matched ${selector}`).not.toBe('');

	return Object.fromEntries(
		[...block.matchAll(/(--color-[a-z-]+):\s*([^;]+);/g)].map(([, name, value]) => [
			name,
			value.trim()
		])
	);
}

function relativeLuminance(hex: string): number {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
	const channels = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
	const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
	const a = relativeLuminance(fg);
	const b = relativeLuminance(bg);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Foreground/background pairs the design actually puts together. Absent on
 * purpose: `--color-wheat-light` on a surface — it is the handwritten accent
 * over PHOTOGRAPHY (spec §4), where the hero's dark overlay supplies the
 * contrast, not the canvas.
 */
const PAIRS: ReadonlyArray<readonly [fg: string, bg: string]> = [
	['--color-ink', '--color-canvas'],
	['--color-ink', '--color-slab'],
	['--color-ink', '--color-paper'],
	['--color-ink-muted', '--color-canvas'],
	['--color-ink-muted', '--color-paper'],
	['--color-brand', '--color-canvas'],
	['--color-brand', '--color-slab'],
	['--color-brand', '--color-paper'],
	['--color-brand-soft', '--color-canvas'],
	['--color-brand-soft', '--color-paper'],
	['--color-cta-text', '--color-wheat']
];

const THEMES = {
	light: /:root\s*\{[^}]*\}/,
	dark: /:root\[data-theme=["']?dark["']?\]\s*\{[^}]*\}/
} as const;

describe.each(Object.entries(THEMES))('%s palette meets WCAG AA', (theme, selector) => {
	const palette = paletteIn(selector);

	it.each(PAIRS)('%s on %s', (fg, bg) => {
		expect(palette[fg], `${fg} is not defined in the ${theme} palette`).toBeDefined();
		expect(palette[bg], `${bg} is not defined in the ${theme} palette`).toBeDefined();

		const ratio = contrast(palette[fg], palette[bg]);
		expect(
			Number(ratio.toFixed(2)),
			`${palette[fg]} on ${palette[bg]} is ${ratio.toFixed(2)}:1, below AA's 4.5:1`
		).toBeGreaterThanOrEqual(4.5);
	});
});

describe('the gold CTA', () => {
	const light = paletteIn(THEMES.light);

	it('never takes white text', () => {
		// Spec §4 calls this out explicitly: white on the gold CTA is 2.65:1.
		// The token exists so nobody reaches for #fff; this pins WHY.
		expect(contrast('#ffffff', light['--color-wheat'])).toBeLessThan(4.5);
		expect(contrast(light['--color-cta-text'], light['--color-wheat'])).toBeGreaterThanOrEqual(4.5);
	});
});

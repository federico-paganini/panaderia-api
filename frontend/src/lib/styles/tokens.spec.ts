import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = 'src';

// `_themes.scss` is the one file allowed to hold literal colours — it IS the
// palette. `app.html` is checked separately below, against those same tokens.
const PALETTE_FILE = join(SRC, 'lib', 'styles', '_themes.scss');

/** #abc · #aabbcc · #aabbccdd · rgb(…) · rgba(…) · hsl(…) · hsla(…) */
const RAW_COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\s*\(/gi;

function filesUnder(dir: string, ext: string): string[] {
	return readdirSync(dir, { recursive: true, encoding: 'utf8' })
		.filter((name) => name.endsWith(ext))
		.map((name) => join(dir, name));
}

/** The contents of every `<style>` block in a Svelte component. */
function styleBlocks(source: string): string {
	return [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
}

describe('no raw colours outside the palette', () => {
	// This is the guard that keeps a second theme cheap. Without it, colours
	// settle into components one at a time and adding a theme stops being a
	// block in `_themes.scss` and becomes an audit of every file.
	it.each(filesUnder(SRC, '.svelte'))('%s — style block', (file) => {
		const found = styleBlocks(readFileSync(file, 'utf8')).match(RAW_COLOUR);
		expect(found ?? [], `use a var(--color-*) token instead`).toEqual([]);
	});

	// SVG paints through presentation ATTRIBUTES as well as CSS, and a
	// `fill="#003898"` sitting in the markup would sail past a scan that only
	// reads <style> blocks — precisely where a logo or an icon would put one.
	it.each(filesUnder(SRC, '.svelte'))('%s — svg paint attributes', (file) => {
		const markup = readFileSync(file, 'utf8').replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
		const found = [...markup.matchAll(/\b(?:fill|stroke|stop-color|flood-color)\s*=\s*"([^"]*)"/g)]
			.map((m) => m[1])
			.filter((value) => RAW_COLOUR.test(value));
		expect(found, `paint through a class and a var(--color-*) token instead`).toEqual([]);
	});

	it.each(filesUnder(SRC, '.scss').filter((f) => f !== PALETTE_FILE))('%s', (file) => {
		const found = readFileSync(file, 'utf8').match(RAW_COLOUR);
		expect(found ?? [], `use a var(--color-*) token instead`).toEqual([]);
	});
});

describe('app.html theme-color', () => {
	// The browser-UI colour cannot be a CSS variable — it is a meta tag read
	// before any stylesheet. So it duplicates `--color-canvas` by hand, and this
	// is what stops the two from drifting apart.
	const html = readFileSync(join(SRC, 'app.html'), 'utf8');
	const palette = readFileSync(PALETTE_FILE, 'utf8');

	function canvasFor(block: RegExp): string {
		const scoped = palette.match(block)?.[0] ?? '';
		const value = scoped.match(/--color-canvas:\s*(#[0-9a-f]{3,8})/i)?.[1];
		expect(value, 'could not find --color-canvas in the palette block').toBeDefined();
		return value!.toLowerCase();
	}

	function metaFor(scheme: 'light' | 'dark'): string {
		const tag = html.match(
			new RegExp(`<meta name="theme-color" media="\\(prefers-color-scheme: ${scheme}\\)"[^>]*>`)
		)?.[0];
		expect(tag, `no theme-color meta for ${scheme}`).toBeDefined();
		return tag!.match(/content="(#[0-9a-f]{3,8})"/i)![1].toLowerCase();
	}

	it('light matches --color-canvas', () => {
		expect(metaFor('light')).toBe(canvasFor(/^:root \{[\s\S]*?^\}/m));
	});

	it('dark matches the dark --color-canvas', () => {
		expect(metaFor('dark')).toBe(canvasFor(/@mixin dark-palette \{[\s\S]*?^\}/m));
	});
});

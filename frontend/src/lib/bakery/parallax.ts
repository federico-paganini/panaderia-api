import type { Attachment } from 'svelte/attachments';

/**
 * Pointer parallax for the paper stickers (spec §6). Each sticker follows the
 * cursor's offset from the viewport centre, scaled by its own depth — the depth
 * illusion comes from the stickers moving at DIFFERENT rates, not from the
 * movement itself.
 *
 * One listener and one animation frame serve every sticker on the page, and
 * the frame only runs while something is still easing toward the pointer: a
 * still cursor costs nothing.
 */

/** Share of the remaining distance covered per frame. Lower is lazier. */
const EASE = 0.08;

/** Below this many pixels from its target a sticker counts as settled. */
const SETTLED = 0.1;

interface Layer {
	depth: number;
	x: number;
	y: number;
}

const layers = new Map<HTMLElement, Layer>();
let pointerX = 0;
let pointerY = 0;
let frame = 0;

function onPointerMove(event: PointerEvent) {
	pointerX = event.clientX - window.innerWidth / 2;
	pointerY = event.clientY - window.innerHeight / 2;
	frame ||= requestAnimationFrame(step);
}

function step() {
	frame = 0;
	let moving = false;

	for (const [node, layer] of layers) {
		const targetX = pointerX * layer.depth;
		const targetY = pointerY * layer.depth;
		layer.x += (targetX - layer.x) * EASE;
		layer.y += (targetY - layer.y) * EASE;
		// `translate`, not `transform`: the sticker's tilt and its entrance
		// animation own `rotate` and `transform`, and the individual transform
		// properties compose instead of overwriting each other.
		node.style.translate = `${layer.x.toFixed(2)}px ${layer.y.toFixed(2)}px`;

		moving ||= Math.abs(targetX - layer.x) > SETTLED || Math.abs(targetY - layer.y) > SETTLED;
	}

	if (moving) frame = requestAnimationFrame(step);
}

/**
 * `{@attach parallax(0.04)}`. Spec §6 puts depths in the 0.02–0.06 range.
 *
 * A no-op on a coarse pointer — there is no cursor to follow on a phone — and
 * when the reader asks for reduced motion.
 */
export function parallax(depth: number): Attachment<HTMLElement> {
	return (node) => {
		if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;

		layers.set(node, { depth, x: 0, y: 0 });
		if (layers.size === 1) window.addEventListener('pointermove', onPointerMove, { passive: true });

		return () => {
			layers.delete(node);
			if (layers.size > 0) return;
			window.removeEventListener('pointermove', onPointerMove);
			cancelAnimationFrame(frame);
			frame = 0;
		};
	};
}

/**
 * The wheat ear, as geometry only — no colour, no stroke widths, no filter.
 * Those belong to whatever paints it.
 *
 * One drawing serves two roles (spec §7): filled in gold it is the logo's ear,
 * stroked in ink it is the motif on every icon. Drawing them separately would
 * give the brand two hands, so the difference is paint, never shape.
 *
 * The numbers below were chosen by Federico on the prototype, 2026-09-13.
 */
export interface EarConfig {
	/** Pairs of grains along the axis, plus one terminal grain closing the tip. */
	pairs: number;
	/** Outward angle of a grain at the base, in degrees. Tightens toward the tip. */
	spread: number;
	/** Length factor of the awns — the bristles that make it read as wheat. */
	awn: number;
	/** How much grains shrink toward the tip. Zero keeps the ear even. */
	taper: number;
}

export const EAR: EarConfig = { pairs: 8, spread: 46, awn: 0.85, taper: 0 };

/** A single grain: a teardrop rising from the origin, 34 units tall. */
const GRAIN = 'M0,0 C9,-6 11,-20 0,-34 C-11,-20 -9,-6 0,0 Z';

/** Distance from the base of the head to the topmost pair. */
const HEAD = 150;

export interface EarPaths {
	/** The stem. */
	stem: string;
	/** One entry per grain: its transform and the paths drawn inside it. */
	grains: Array<{ transform: string; grain: string; vein: string; awn: string }>;
}

/**
 * Builds the ear's paths. The caller decides what to do with each part, which
 * is what lets gold mode drop the veins and ink mode drop the highlight.
 */
export function buildEar(config: EarConfig = EAR): EarPaths {
	const grains: EarPaths['grains'] = [];
	const awnLength = config.awn * 95;
	const awn = `M0,-31 Q 5,${(-31 - awnLength * 0.5).toFixed(1)} 12,${(-31 - awnLength).toFixed(1)}`;

	const place = (y: number, angle: number, scale: number) =>
		grains.push({
			transform: `translate(0 ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(3)})`,
			grain: GRAIN,
			vein: 'M0,-5 L0,-28',
			awn
		});

	for (let i = 0; i < config.pairs; i++) {
		const t = config.pairs === 1 ? 0 : i / (config.pairs - 1);
		const y = -44 - t * HEAD;
		const scale = 1 - config.taper * t;
		// Grains tighten toward the tip even when the taper is zero, which is
		// what keeps the silhouette pointed rather than a column.
		const angle = config.spread * (1 - 0.45 * t);
		place(y, -angle, scale);
		place(y, angle, scale);
	}

	place(-44 - HEAD - 16, 0, 1 - config.taper);

	return { stem: 'M0,52 C-4,22 -2,-14 0,-44', grains };
}

/** Frame for one upright ear, measured against the paths above. */
export const EAR_VIEWBOX = '-85 -300 170 370';

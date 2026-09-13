<script lang="ts">
	import EarShape from './EarShape.svelte';

	interface Props {
		/** Rendered height in px. The mark keeps its own aspect ratio. */
		height?: number;
	}

	let { height = 56 }: Props = $props();

	const uid = $props.id();
	const archId = `logo-arch-${uid}`;

	// The oval. The ring sits just inside it, as on the shop sign.
	const OVAL = { rx: 190, ry: 104 };
	const RING = { rx: 178, ry: 93 };

	// The arc the small caps ride on: a flattened curve across the upper half,
	// drawn left to right so the text reads the right way up.
	const ARCH = 'M -125,-38 A 140,86 0 0 1 125,-38';

	// The crossed ears. Laid almost flat (77° off vertical) so the tips run out
	// past the oval's edge on both sides — the detail that stops the mark being
	// a sealed badge (spec §3).
	//
	// `cross` is where the two STEM BASES meet, and the transform below is built
	// so that point is what stays fixed. The first attempt wrote
	// `rotate(a 0 150) scale(s)` and flung one ear clean outside the oval: SVG
	// applies a transform list right to left, so the scale ran first and the
	// rotation centre was then interpreted in the unscaled frame — the pivot
	// moved on its own. Anchoring at the origin removes the trap entirely.
	const EARS = { angle: 77, scale: 0.63, cross: { x: 0, y: 74 } };

	/** Stem base of the ear in its own coordinates (see `wheat-ear.ts`). */
	const EAR_BASE_Y = 52;

	// Right to left: lift the stem base to the origin, scale about it, rotate
	// about it, then drop it on the crossing point.
	const earTransform = (direction: number) =>
		`translate(${EARS.cross.x} ${EARS.cross.y}) rotate(${direction * EARS.angle}) ` +
		`scale(${EARS.scale}) translate(0 ${-EAR_BASE_Y})`;
</script>

<svg
	class="logo"
	style:height="{height}px"
	viewBox="-245 -128 490 245"
	role="img"
	aria-label="Panadería y Confitería Las Delicias"
>
	<ellipse class="field" cx="0" cy="0" rx={OVAL.rx} ry={OVAL.ry} />
	<ellipse class="ring" cx="0" cy="0" rx={RING.rx} ry={RING.ry} />

	{#each [-1, 1] as direction (direction)}
		<g transform={earTransform(direction)}>
			<EarShape mode="gold" roughness={0} />
		</g>
	{/each}

	<path id={archId} class="arch-path" d={ARCH} />
	<text class="caps">
		<textPath href="#{archId}" startOffset="50%" text-anchor="middle">
			PANADERÍA Y CONFITERÍA
		</textPath>
	</text>

	<!--
		PROVISIONAL. The real wordmark is Edwardian Script ITC, which cannot be
		served as a webfont (spec §3). Great Vibes stands in until the outlined
		paths come back from `docs/handoff-wordmark-outlines.md`; swapping this
		<text> for a <path> is the whole change.
	-->
	<text
		class="wordmark"
		x="0"
		y="14"
		text-anchor="middle"
		textLength="300"
		lengthAdjust="spacingAndGlyphs">Las Delicias</text
	>
</svg>

<style lang="scss">
	@use 'styles' as *;

	.logo {
		display: block;
		width: auto;
		overflow: visible;
	}

	.field {
		fill: var(--color-brand);
	}

	.ring {
		fill: none;
		stroke: var(--color-paper);
		stroke-width: 3.5;
	}

	.arch-path {
		fill: none;
		stroke: none;
	}

	.caps {
		fill: var(--color-paper);
		font-family: $font-display;
		font-weight: $weight-bold;
		font-size: 18px;
		letter-spacing: 2.2px;
	}

	.wordmark {
		fill: var(--color-paper);
		font-family: $font-script;
		font-size: 62px;
	}
</style>

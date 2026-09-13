<script lang="ts">
	import WheatEar from './WheatEar.svelte';

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
	const ARCH = `M -132,-30 A 148,92 0 0 1 132,-30`;

	// The crossed ears. Laid almost flat (72° off vertical) so the tips run out
	// past the oval's edge on both sides — the detail that stops the mark being
	// a sealed badge (spec §3). They pivot about a point below the oval, which
	// is what makes the stems converge instead of merely overlapping.
	const EARS = { angle: 72, scale: 0.66, pivotY: 150, baseY: 66 };
</script>

<svg
	class="logo"
	style:height="{height}px"
	viewBox="-220 -125 440 220"
	role="img"
	aria-label="Panadería y Confitería Las Delicias"
>
	<ellipse class="field" cx="0" cy="0" rx={OVAL.rx} ry={OVAL.ry} />
	<ellipse class="ring" cx="0" cy="0" rx={RING.rx} ry={RING.ry} />

	<g transform="translate(0 {EARS.baseY})">
		{#each [-1, 1] as direction (direction)}
			<g
				transform="rotate({direction * EARS.angle} 0 {EARS.pivotY}) scale({EARS.scale})"
				class="ear-slot"
			>
				<WheatEar mode="gold" roughness={0} />
			</g>
		{/each}
	</g>

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
	<text class="wordmark" x="0" y="26" text-anchor="middle">Las Delicias</text>
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
		stroke-width: 3;
	}

	.arch-path {
		fill: none;
		stroke: none;
	}

	// The ears sit inside their own nested <svg>, which has no intrinsic size
	// here; give the slot the ear's own frame so the transforms above land.
	.ear-slot :global(svg) {
		height: 370px;
		overflow: visible;
	}

	.caps {
		fill: var(--color-paper);
		font-family: $font-display;
		font-weight: $weight-bold;
		font-size: 26px;
		letter-spacing: 4px;
	}

	.wordmark {
		fill: var(--color-paper);
		font-family: $font-script;
		font-size: 92px;
	}
</style>

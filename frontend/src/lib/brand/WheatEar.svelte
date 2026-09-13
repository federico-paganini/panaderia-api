<script lang="ts">
	import { EAR_VIEWBOX, buildEar } from './wheat-ear';

	interface Props {
		/** `gold` fills the grains for the logo; `ink` strokes them for the icon set. */
		mode?: 'gold' | 'ink';
		/**
		 * Hand-drawn wobble, in viewBox units. The displacement scales with the
		 * drawing, so below roughly 40px on screen the noise falls under a pixel:
		 * it adds nothing and still costs a filter pass. Pass 0 there.
		 */
		roughness?: number;
		title?: string;
	}

	let { mode = 'ink', roughness = 4, title }: Props = $props();

	const ear = buildEar();
	// Filter ids are document-global, so two ears on one page would fight over
	// the name without this.
	const uid = $props.id();
	const filterId = `ear-rough-${uid}`;
	const rough = $derived(mode === 'ink' && roughness > 0.05);
</script>

<svg
	class="ear {mode}"
	viewBox={EAR_VIEWBOX}
	role={title ? 'img' : 'presentation'}
	aria-label={title}
	aria-hidden={title ? undefined : 'true'}
>
	{#if rough}
		<filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
			<feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="7" result="n" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="n"
				scale={roughness}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>
	{/if}

	<g filter={rough ? `url(#${filterId})` : undefined}>
		<path class="stem" d={ear.stem} />
		{#each ear.grains as g (g.transform)}
			<g transform={g.transform}>
				<path class="grain" d={g.grain} />
				{#if mode === 'ink'}
					<path class="vein" d={g.vein} />
				{:else}
					<path class="highlight" d={g.grain} transform="translate(-2 -9) scale(0.5)" />
				{/if}
				<path class="awn" d={g.awn} />
			</g>
		{/each}
	</g>
</svg>

<style lang="scss">
	.ear {
		display: block;
		width: auto;
		height: 100%;
		overflow: visible;
	}

	.grain {
		stroke-linejoin: round;
	}

	.vein,
	.awn,
	.stem {
		fill: none;
		stroke-linecap: round;
	}

	// Gold: volume from two flat tones rather than a gradient — crisper small,
	// and it recolours cleanly for the dark theme.
	.gold {
		.grain {
			fill: var(--color-wheat);
			stroke: none;
		}

		.highlight {
			fill: var(--color-wheat-light);
			stroke: none;
		}

		.awn {
			stroke: var(--color-wheat);
			stroke-width: 1.8;
		}

		.stem {
			stroke: var(--color-wheat);
			stroke-width: 3.4;
		}
	}

	// Ink takes its colour from whatever surface it sits on, so one icon works
	// on paper, on the slab and on the canvas without a variant.
	.ink {
		color: var(--color-brand);

		.grain {
			fill: none;
			stroke: currentColor;
			stroke-width: 2.4;
		}

		.vein {
			stroke: currentColor;
			stroke-width: 1.5;
		}

		.awn {
			stroke: currentColor;
			stroke-width: 1.4;
		}

		.stem {
			stroke: currentColor;
			stroke-width: 2.6;
		}
	}
</style>

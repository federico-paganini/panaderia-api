<script lang="ts">
	import { parallax } from './parallax';
	import ear from './sticker-ear.svg';

	interface Props {
		/** A short script phrase. */
		phrase: string;
		/** Which torn edge and tilt — three cuts, so no two neighbours match. */
		cut: 'a' | 'b' | 'c';
		/** Parallax rate, 0.02–0.06 (spec §6). Different depths are the effect. */
		depth: number;
	}

	let { phrase, cut, depth }: Props = $props();
</script>

<!-- Two elements, for the same reason as the hero's cut-outs (spec §6): the
     outer carries the tilt, the shadow and the parallax, the inner the paper and
     the torn-edge clip-path, which would otherwise clip its own shadow away.
     Decoration: the phrases repeat what the page already says. -->
<div class="sticker {cut}" aria-hidden="true" {@attach parallax(depth)}>
	<div class="paper">
		<!-- The logo's own ears, drawn by the same hand (spec §7). An <img>: three
		     stickers share one cached file. -->
		<img class="ear" src={ear} alt="" />
		<span class="phrase">{phrase}</span>
	</div>
</div>

<style lang="scss">
	@use 'styles' as *;

	.sticker {
		filter: drop-shadow(0 10px 14px var(--color-shadow));

		// Spec §9: the one entrance on the page — the stickers settle in. A
		// `transform` on top of the `rotate` below, which it composes with, so
		// the tilt survives the animation.
		@include motion-safe {
			animation: settle $duration-slow $ease-out both;
		}
	}

	@keyframes settle {
		from {
			opacity: 0;
			transform: rotate(-8deg) scale(0.85);
		}
	}

	.paper {
		display: flex;
		gap: $space-2;
		align-items: center;
		padding: $space-3 $space-5 $space-3 $space-3;
		background: var(--color-paper);
		color: var(--color-brand);
	}

	.ear {
		height: $space-16;
	}

	.phrase {
		font-family: $font-script;
		font-size: $font-size-2xl;
		line-height: 1;
		white-space: nowrap;
	}

	// The three torn edges are the spec's own (§6); the tilts sit in its
	// −9° … +11° range. Staggered so the stickers do not land in unison.
	.a {
		rotate: -7deg;
		animation-delay: 150ms;

		.paper {
			clip-path: polygon(
				3% 10%,
				28% 0%,
				55% 6%,
				78% 0%,
				100% 8%,
				97% 55%,
				100% 92%,
				72% 100%,
				45% 94%,
				20% 100%,
				0% 90%
			);
		}
	}

	.b {
		rotate: 6deg;
		animation-delay: 300ms;

		.paper {
			clip-path: polygon(
				0% 6%,
				22% 0%,
				50% 8%,
				80% 0%,
				100% 10%,
				96% 50%,
				100% 88%,
				70% 100%,
				40% 92%,
				15% 100%,
				2% 86%
			);
		}
	}

	.c {
		rotate: -3deg;
		animation-delay: 450ms;

		.paper {
			clip-path: polygon(
				4% 0%,
				40% 6%,
				72% 0%,
				100% 12%,
				96% 60%,
				100% 100%,
				60% 94%,
				30% 100%,
				0% 88%
			);
		}
	}
</style>

<script lang="ts">
	import Photo from '#lib/shared/Photo.svelte';
	import { ADDRESS, BAKERY } from './brand';
	import bizcochos from './photos/croissants-savoury.jpg?enhanced';
	import pan from './photos/flautas.jpg?enhanced';
	import Sticker from './Sticker.svelte';
</script>

<!-- Split hero: copy on the canvas, two photos as paper cut-outs beside it — one
     for "pan", one for "bizcochos", the two words of the headline. Not the
     spec's original full-bleed photo: every photo we have is portrait or square
     and WhatsApp-compressed, and white text over a bright bake failed contrast
     (spec §6 records the measurement). Here the copy sits on tokens whose
     contrast is already verified, and no photo has to stretch. -->
<section class="hero">
	<div class="copy">
		<h1>
			<span class="headline">Pan y bizcochos</span>
			<span class="accent">recién horneados</span>
		</h1>
		<p class="info">Panadería y Confitería · {ADDRESS.oneLine}</p>
		<!-- Same reason as PhoneLink: an external URL from a constant, which the
		     rule cannot resolve statically. -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="cta" href={BAKERY.contact.whatsappHref}>Pedí por WhatsApp</a>
	</div>

	<!-- Each cut-out is two elements, and the split is mandatory (spec §6): the
	     outer carries the rotation and the shadow, the inner the torn-edge
	     clip-path. A clip-path clips its own element's filter, so a shadow on the
	     clipped element would vanish. -->
	<div class="collage">
		<div class="cutout pan">
			<!-- Above the fold on every screen and the largest paint: fetched first. -->
			<Photo src={pan} alt="Flautas recién horneadas, apiladas" fetchpriority="high" />
		</div>
		<div class="cutout bizcochos">
			<Photo src={bizcochos} alt="Bandeja de croissants salados recién horneados" />
		</div>

		<!-- Each at its own depth: the rate difference is what reads as depth. -->
		<div class="place place-town"><Sticker phrase="Las Piedras" cut="a" depth={0.05} /></div>
		<div class="place place-bizcochos">
			<Sticker phrase="bizcochos" cut="b" depth={0.025} />
		</div>
		<div class="place place-fresh">
			<Sticker phrase="recién horneado" cut="c" depth={0.04} />
		</div>
	</div>
</section>

<style lang="scss">
	@use 'styles' as *;

	.hero {
		display: grid;
		gap: $space-8;
		padding-block: $space-6 $space-12;
		@include content-shell;

		@include breakpoint(md) {
			// The photos take the larger share: the aesthetic is mostly photography.
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			gap: $space-10;
			align-items: center;
			// Fills the first screen below the 72px nav.
			min-height: min(calc(100dvh - 72px), 60rem);
			padding-block: $space-8;
		}
	}

	h1 {
		display: flex;
		flex-direction: column;
	}

	.headline {
		// 7vw is 84px at the 1200px reference; the floor keeps phones near the
		// ~48px of spec §10, and the ceiling lets it grow with the wider column
		// up to 1600px instead of stopping at the sketch's size.
		font-size: clamp(#{$font-size-4xl}, 7vw, #{$font-size-7xl});
		font-weight: $weight-extrabold;
		line-height: $leading-display;
		letter-spacing: $tracking-display;
		text-transform: uppercase;
	}

	.accent {
		// Not the gold: wheat on the cream canvas is 2.4:1, which fails even the
		// large-text floor. Brand-soft is already verified against the canvas.
		color: var(--color-brand-soft);
		font-family: $font-script;
		font-size: clamp(#{$font-size-3xl}, 5.6vw, #{$font-size-6xl});
		font-weight: $weight-regular;
		line-height: 1;
	}

	.info {
		margin-top: $space-5;
		color: var(--color-ink-muted);
		font-size: $font-size-base;
	}

	.cta {
		display: inline-block;
		margin-top: $space-6;
		padding: $space-3 $space-8;
		border-radius: $radius-pill;
		background: var(--color-wheat);
		color: var(--color-cta-text);
		font-family: $font-display;
		font-size: $font-size-lg;
		font-weight: $weight-bold;
		letter-spacing: 0.04em;
		text-decoration: none;
		text-transform: uppercase;

		@include motion-safe {
			transition: transform $duration-fast $ease-out;

			&:hover {
				transform: translateY(-2px);
			}
		}
	}

	.collage {
		position: relative;
		order: -1;
		aspect-ratio: 1;

		@include breakpoint(md) {
			order: 0;
			aspect-ratio: 1.05;
		}
	}

	.cutout {
		position: absolute;
		filter: drop-shadow(0 10px 14px var(--color-shadow));

		// `:global` because the <img> belongs to Photo, not to this component.
		:global(img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	// Where each sticker sits. Positioning lives here, in the layout that owns
	// the collage; the sticker itself only knows how to look like paper.
	.place {
		position: absolute;
		z-index: $z-sticker;
		// Spec §10: smaller on phones.
		scale: 0.7;

		@include breakpoint(md) {
			scale: 1;
		}
	}

	.place-town {
		top: 2%;
		right: 2%;
	}

	.place-bizcochos {
		bottom: 2%;
		left: 26%;
	}

	// Spec §10 keeps two stickers on phones; the third joins from the
	// two-column layout up.
	.place-fresh {
		display: none;
		top: 38%;
		left: -4%;

		@include breakpoint(lg) {
			display: block;
		}
	}

	.pan {
		top: 0;
		left: 0;
		width: 54%;
		height: 88%;
		transform: rotate(-3deg);

		:global(img) {
			object-position: 50% 40%;
			clip-path: polygon(
				3% 2%,
				28% 0%,
				55% 1.5%,
				78% 0%,
				100% 2%,
				99% 55%,
				100% 98%,
				72% 100%,
				45% 98.5%,
				20% 100%,
				0% 97%
			);
		}
	}

	.bizcochos {
		right: 0;
		bottom: 0;
		width: 62%;
		height: 64%;
		transform: rotate(4deg);

		:global(img) {
			clip-path: polygon(
				0% 3%,
				22% 0%,
				50% 2%,
				80% 0%,
				100% 3%,
				98.5% 50%,
				100% 97%,
				70% 100%,
				40% 98%,
				15% 100%,
				1% 96%
			);
		}
	}
</style>

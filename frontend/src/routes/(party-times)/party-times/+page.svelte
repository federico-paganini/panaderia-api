<script lang="ts">
	import { resolve } from '$app/paths';
	import { BAKERY } from '$lib/bakery/brand';
	import { PARTY_TIMES } from '$lib/party-times/brand';
	import { isPending } from '$lib/shared/legal';
	import SeoHead from '$lib/shared/SeoHead.svelte';
</script>

<!-- SKELETON. The venue's own landing (spec §1): titles only until its facts,
     photos and WhatsApp number arrive. A separate company, so it links to the
     bakery as a sister business and carries its own legal pages. -->

<SeoHead
	title="{PARTY_TIMES.name} — Salón de fiestas"
	description="{PARTY_TIMES.name}, salón de fiestas."
	path="/party-times"
	noindex={isPending(PARTY_TIMES.entity)}
/>

<main>
	<p class="sister">
		Del mismo equipo que <a href={resolve('/')}>{BAKERY.name}</a>
	</p>

	<h1>{PARTY_TIMES.name}</h1>
	<p class="lede">Salón de fiestas.</p>

	<p class="pending">[pendiente: dirección, fotos y WhatsApp del salón]</p>
</main>

<nav aria-label="Legal">
	<a href={resolve('/party-times/privacy')}>Política de privacidad</a>
	<a href={resolve('/party-times/terms')}>Términos y condiciones</a>
</nav>

<style lang="scss">
	@use 'styles' as *;

	main {
		padding-block: $space-16 $space-12;
		@include content-shell;
	}

	.sister {
		color: var(--color-ink-muted);
		font-size: $font-size-sm;
	}

	h1 {
		margin-top: $space-4;
		font-size: clamp(#{$font-size-3xl}, 6vw, #{$font-size-6xl});
		font-weight: $weight-extrabold;
		line-height: $leading-display;
		text-transform: uppercase;
	}

	.lede {
		margin-top: $space-4;
		font-size: $font-size-lg;
	}

	.pending {
		margin-top: $space-8;
		color: var(--color-ink-muted);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: $space-4;
		padding-block: $space-8;
		@include content-shell;
	}
</style>

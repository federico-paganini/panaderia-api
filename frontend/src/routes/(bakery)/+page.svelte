<script lang="ts">
	import { resolve } from '$app/paths';
	import { BAKERY } from '$lib/bakery/brand';
	import Hero from '$lib/bakery/Hero.svelte';
	import { PARTY_TIMES } from '$lib/party-times/brand';
	import { isPending } from '$lib/shared/legal';
	import Nav from '$lib/shared/Nav.svelte';
	import SeoHead from '$lib/shared/SeoHead.svelte';
</script>

<SeoHead
	title={BAKERY.name}
	description="Pan y bizcochos recién horneados en Las Piedras, Canelones. Lavalleja 714."
	path="/"
/>

<header>
	<Nav />
</header>

<main>
	<Hero />

	<!-- Stand-in for the footer, which is still to be built. The legal links must
	     stay reachable from the landing meanwhile: /privacy is what Meta's
	     reviewer comes looking for. -->
	<nav aria-label="Legal">
		<a href={resolve('/privacy')}>Política de privacidad</a>
		<a href={resolve('/terms')}>Términos y condiciones</a>
		<!-- The way over to the party venue, a sister company. Held back while its
		     legal facts are placeholders, so no reader lands on a page that names
		     "[razón social del salón]" as the party responsible for their data. -->
		{#if !isPending(PARTY_TIMES.entity)}
			<a href={resolve('/party-times')}>Salón de fiestas {PARTY_TIMES.shortName}</a>
		{/if}
	</nav>
</main>

<style lang="scss">
	@use 'styles' as *;

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: $space-4;
		padding-block: $space-8;
		@include content-shell;
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/SeoHead.svelte';
	import { ADDRESS, SITE } from '$lib/site';
</script>

<SeoHead
	title={SITE.name}
	description="Pan y bizcochos recién horneados en Las Piedras, Canelones. Lavalleja 714."
	path="/"
/>

<!-- Placeholder. The landing itself is step 3 of the build; this page exists so
     the route, its metadata and the prerender pipeline are real from step 1. -->
<main>
	<h1>{SITE.name}</h1>
	<p>{ADDRESS.oneLine}</p>
	<nav>
		<a href={resolve('/privacy')}>Política de privacidad</a>
		<a href={resolve('/terms')}>Términos y condiciones</a>
	</nav>
</main>

<style lang="scss">
	@use 'styles' as *;

	main {
		display: flex;
		flex-direction: column;
		gap: $space-4;
		justify-content: center;
		min-height: 100dvh;
		@include content-shell;
	}

	h1 {
		font-size: $font-size-4xl;
		text-transform: uppercase;
		letter-spacing: $tracking-display;
		line-height: $leading-display;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: $space-4;
		margin-top: $space-4;
	}
</style>

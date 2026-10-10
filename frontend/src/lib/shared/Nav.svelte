<script lang="ts">
	import { currentBrand } from './brand';
	import Logo from './Logo.svelte';

	const { contact } = currentBrand();
</script>

<!-- The mark and the one link that has somewhere to go. Spec §6 lists four
     links; Productos, Nosotros and Dónde estamos join as their sections land,
     never before — an anchor to a section that does not exist is a dead link.
     The mark carries the name itself, so no wordmark beside it. -->
<nav aria-label="Principal">
	<Logo height={52} />
	<!-- Not "Pedí por WhatsApp": that is the hero's CTA, and two links with one
	     name are one too many for a screen reader's link list. -->
	{#if contact.whatsappHref}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={contact.whatsappHref}>Pedidos</a>
	{/if}
</nav>

<style lang="scss">
	@use 'styles' as *;

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: $space-4;
		min-height: 72px;
		padding-block: $space-2;
		@include content-shell;
	}

	a {
		font-family: $font-display;
		font-size: $font-size-base;
		font-weight: $weight-bold;
		letter-spacing: $tracking-caps;
		text-transform: uppercase;
		color: var(--color-brand);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>

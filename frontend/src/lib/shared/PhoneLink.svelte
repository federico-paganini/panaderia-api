<script lang="ts">
	import { currentBrand } from './brand';

	const { phone, phoneHref } = currentBrand().contact;
</script>

<!-- Same reason as MailLink: `tel:` is an external scheme, and plain text while
     the brand has no number yet. -->
{#if phoneHref}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={phoneHref}>{phone}</a>
{:else}
	{phone}
{/if}

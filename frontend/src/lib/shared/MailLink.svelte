<script lang="ts">
	import { currentBrand } from './brand';
	import { isPlaceholder } from './legal';

	const { email } = currentBrand().contact;
</script>

<!-- The brand's contact address, the same on every page that prints it. Plain
     text while it is still a placeholder: a `mailto:` to "[mail …]" would be a
     broken link on a page someone can reach.

     `svelte/no-navigation-without-resolve` can only prove a link is internal
     when the href is a static literal, and `mailto:` is not a route at all.
     Suppressed here once so no call site has to carry it. -->
{#if isPlaceholder(email)}
	{email}
{:else}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href="mailto:{email}">{email}</a>
{/if}

<script lang="ts">
	import { LEGAL_ENTITY } from '$lib/legal/entity';
</script>

<!-- `svelte/no-navigation-without-resolve` can only prove a link is internal when the href is a
     static literal; it cannot see through the interpolation, and `mailto:` is not a route at all.
     Suppressed here once so no call site has to carry it, and so the address can never differ
     between two pages. -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href="mailto:{LEGAL_ENTITY.contactEmail}">{LEGAL_ENTITY.contactEmail}</a>

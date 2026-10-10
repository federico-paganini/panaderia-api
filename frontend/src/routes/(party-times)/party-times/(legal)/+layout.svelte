<script lang="ts">
	import LegalFrame from '#lib/shared/LegalFrame.svelte';

	let { children } = $props();
</script>

<LegalFrame>{@render children()}</LegalFrame>

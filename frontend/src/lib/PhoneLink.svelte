<script lang="ts">
	import { CONTACT } from '$lib/site';
</script>

<!-- Same reason as MailLink: `tel:` is an external scheme, and the href is a constant the rule
     cannot resolve statically. -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href={CONTACT.phoneHref}>{CONTACT.phone}</a>

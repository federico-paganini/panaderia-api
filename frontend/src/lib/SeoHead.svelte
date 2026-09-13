<script lang="ts">
	import { SITE, absoluteUrl } from '$lib/site';

	interface Props {
		/** Page title, without the site name — this component appends it. */
		title: string;
		description: string;
		/** Route path, leading slash. Drives the canonical URL and og:url. */
		path: string;
		/** Keep a page out of search results (not used yet; the legal pages are indexable on purpose). */
		noindex?: boolean;
	}

	let { title, description, path, noindex = false }: Props = $props();

	// The canonical always points at the production domain (see `$lib/site`), so
	// a Vercel preview never competes with the real page in an index.
	const canonical = $derived(absoluteUrl(path));
	const fullTitle = $derived(path === '/' ? title : `${title} — ${SITE.shortName}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content="es_UY" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />

	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
</svelte:head>

<script lang="ts">
	import { page } from '$app/state';
	import { absoluteUrl } from '#lib/site.js';
	import { currentBrand } from './brand';

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

	const brand = currentBrand();

	// The canonical always points at the production domain (see `#lib/site.js`), so
	// a preview never competes with the real page in an index.
	const canonical = $derived(absoluteUrl(path));
	// A brand's landing carries its own full title; every other page is
	// suffixed with the brand it belongs to.
	const fullTitle = $derived(
		page.route.id === brand.home ? title : `${title} — ${brand.titleSuffix}`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={brand.name} />
	<meta property="og:locale" content="es_UY" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />

	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
</svelte:head>

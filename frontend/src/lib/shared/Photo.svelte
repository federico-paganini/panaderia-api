<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import type { HTMLImgAttributes } from 'svelte/elements';

	// Named props, not a `{...rest}` spread: with a spread Svelte cannot tell
	// whether an `onload` is inside, so its server render adds an inline
	// `onload="this.__e=event"` to the <img> — an inline handler the CSP's
	// `script-src 'self'` blocks, logging a violation on every page load.
	interface Props {
		/** A photo imported with `?enhanced`. */
		src: Picture;
		/** Required: every photo on this site shows a product someone is choosing. */
		alt: string;
		/** `high` for the photo that is the page's largest paint; omit otherwise. */
		fetchpriority?: HTMLImgAttributes['fetchpriority'];
	}

	let { src, alt, fetchpriority }: Props = $props();
</script>

<!-- The only place `<enhanced:img>` is written, and this component has NO
     <style> block on purpose. enhanced-img parses the raw component before the
     SCSS preprocessor runs, so a `//` comment or a `#{}` interpolation in the
     same file fails the build with a CSS syntax error that points nowhere near
     the cause. Components that show a photo import it with `?enhanced`, pass it
     here, and keep their SCSS. -->
<enhanced:img {src} {alt} {fetchpriority} />

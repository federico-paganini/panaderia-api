<script lang="ts">
	// Self-hosted webfonts. The `latin-` entry points ship only the Latin
	// subset, which covers Spanish in full (accents, ñ, ¿, ¡) at a fraction of
	// the bytes. Loading them from the site's own origin rather than Google's
	// CDN is deliberate: /privacy promises that a visitor's data is not
	// handed to third parties, and a font request would hand Google their IP on
	// every page view.
	import '@fontsource/barlow/latin-400.css';
	import '@fontsource/barlow/latin-500.css';
	import '@fontsource/barlow/latin-600.css';
	import '@fontsource/barlow-condensed/latin-700.css';
	import '@fontsource/barlow-condensed/latin-800.css';
	import '@fontsource/great-vibes/latin-400.css';

	import '../app.scss';

	let { children } = $props();
</script>

{@render children()}

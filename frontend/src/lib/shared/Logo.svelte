<script lang="ts">
	// The brand's finished mark (spec §3). An `<img>`, not inline: a mark is
	// tens of KB that would otherwise ride along in every page's HTML, while a
	// file is fetched once and cached. It needs nothing from the page either —
	// each mark paints its own fixed colours and reads the same in both themes.
	import { currentBrand } from './brand';

	interface Props {
		/** Rendered height in px; the width follows the mark's own proportions. */
		height?: number;
	}

	let { height = 56 }: Props = $props();

	const { logo } = currentBrand();
</script>

<!-- `width` and `height` written out so the slot is reserved before the file arrives. -->
<img class="logo" src={logo.src} alt={logo.alt} {height} width={Math.round(height * logo.aspect)} />

<style>
	.logo {
		display: block;
	}
</style>

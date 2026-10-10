<script lang="ts">
	import EarShape from './EarShape.svelte';
	import { EAR_VIEWBOX } from './wheat-ear';

	interface Props {
		mode?: 'gold' | 'ink';
		roughness?: number;
		/** Give it a label to expose it as an image; without one it is decoration. */
		title?: string;
	}

	let { mode = 'ink', roughness = 4, title }: Props = $props();
</script>

<!-- A standalone ear with its own frame. Inside another `<svg>`, use
     `<EarShape>` instead and place it with your own transform. -->
<svg
	class="frame"
	viewBox={EAR_VIEWBOX}
	role={title ? 'img' : 'presentation'}
	aria-label={title}
	aria-hidden={title ? undefined : 'true'}
>
	<EarShape {mode} {roughness} />
</svg>

<style lang="scss">
	.frame {
		display: block;
		width: auto;
		height: 100%;
		overflow: visible;
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { LEGAL_ENTITY } from '$lib/legal/entity';
	import { SITE } from '$lib/site';

	let { children } = $props();
</script>

<div class="shell">
	<header>
		<a class="back" href={resolve('/')}>
			<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M15 18l-6-6 6-6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Volver a {SITE.shortName}
		</a>
	</header>

	<main class="prose">
		{@render children()}
	</main>

	<footer>
		<p>{LEGAL_ENTITY.name} · {LEGAL_ENTITY.taxIdLabel} {LEGAL_ENTITY.taxId}</p>
		<p>{LEGAL_ENTITY.address}</p>
	</footer>
</div>

<style lang="scss">
	@use 'styles' as *;

	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--color-canvas);
	}

	header {
		border-bottom: 1px solid var(--color-border);
	}

	.back {
		display: inline-flex;
		gap: $space-2;
		align-items: center;
		width: 100%;
		max-width: $prose-width;
		margin-inline: auto;
		padding-block: $space-4;
		font-family: $font-display;
		font-size: $font-size-lg;
		font-weight: $weight-bold;
		text-transform: uppercase;
		letter-spacing: $tracking-display;
		color: var(--color-brand);
		text-decoration: none;
		@include gutter;

		svg {
			width: 1em;
			height: 1em;
		}

		&:hover {
			text-decoration: underline;
		}
	}

	footer {
		width: 100%;
		max-width: $prose-width;
		margin-inline: auto;
		padding-block: $space-8 $space-16;
		font-size: $font-size-sm;
		color: var(--color-ink-muted);
		border-top: 1px solid var(--color-border);
		@include gutter;

		p {
			margin: 0;
		}
	}

	// Prose typography for the legal documents. The bodies live in each child
	// `+page.svelte`, so these descendant rules must be `:global()`.
	.prose {
		flex: 1;
		width: 100%;
		max-width: $prose-width;
		margin-inline: auto;
		padding-block: $space-12 $space-16;
		line-height: $leading-relaxed;
		@include gutter;
	}

	.prose :global(h1) {
		font-size: $font-size-3xl;
		font-weight: $weight-extrabold;
		text-transform: uppercase;
		letter-spacing: $tracking-display;
		line-height: $leading-display;
		margin-bottom: $space-4;
	}

	.prose :global(h2) {
		font-size: $font-size-xl;
		margin-top: $space-10;
		margin-bottom: $space-3;
	}

	.prose :global(h3) {
		font-size: $font-size-lg;
		font-family: $font-body;
		font-weight: $weight-semibold;
		color: var(--color-ink);
		margin-top: $space-6;
		margin-bottom: $space-2;
	}

	.prose :global(.lede) {
		font-size: $font-size-lg;
		color: var(--color-ink-muted);
		margin-bottom: $space-4;
	}

	.prose :global(.updated) {
		font-size: $font-size-sm;
		color: var(--color-ink-muted);
		margin-bottom: $space-10;
	}

	.prose :global(p),
	.prose :global(ul),
	.prose :global(ol) {
		margin-bottom: $space-4;
	}

	.prose :global(ul),
	.prose :global(ol) {
		padding-left: $space-6;
	}

	.prose :global(li) {
		margin-bottom: $space-2;
	}

	.prose :global(li::marker) {
		color: var(--color-wheat);
	}

	.prose :global(strong) {
		font-weight: $weight-semibold;
	}

	// Tables carry the data-and-purpose grids a privacy policy needs. They are
	// the one element allowed to be wider than the column, inside their own
	// scroller, so the page body still never scrolls sideways.
	.prose :global(.table-scroll) {
		overflow-x: auto;
		margin-bottom: $space-6;
	}

	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: $font-size-sm;
	}

	.prose :global(th),
	.prose :global(td) {
		padding: $space-3;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid var(--color-border);
	}

	.prose :global(th) {
		font-weight: $weight-semibold;
		color: var(--color-brand);
		border-bottom-color: var(--color-border-strong);
	}

	.prose :global(.contact) {
		margin-top: $space-12;
		padding: $space-6;
		background: var(--color-slab);
		border-radius: $radius-xl;
		font-size: $font-size-sm;
	}
</style>

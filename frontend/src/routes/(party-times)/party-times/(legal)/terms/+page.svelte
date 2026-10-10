<script lang="ts">
	import { resolve } from '$app/paths';
	import { PARTY_TIMES } from '$lib/party-times/brand';
	import { isPending } from '$lib/shared/legal';
	import SeoHead from '$lib/shared/SeoHead.svelte';

	const { entity } = PARTY_TIMES;
</script>

<!-- SKELETON, for the same reasons as the venue's privacy page. -->

<SeoHead
	title="Términos y condiciones"
	description="Condiciones de uso de las páginas de {PARTY_TIMES.name} y de su canal de atención."
	path="/party-times/terms"
	noindex={isPending(entity)}
/>

<h1>Términos y condiciones</h1>

<p class="lede">
	Estas condiciones regulan el uso de las páginas de {PARTY_TIMES.name} y de su canal de atención.
</p>

<p class="updated">Última actualización: {PARTY_TIMES.termsUpdated}</p>

<h2>1. Quiénes somos</h2>
<p>
	<strong>{entity.name}</strong> ({entity.taxIdLabel}
	{entity.taxId}), con domicilio en {entity.address}.
</p>

<h2>2. Qué es este sitio</h2>
<p>[pendiente]</p>

<h2>3. El canal de atención</h2>
<p>[pendiente: depende de qué número atiende las consultas del salón]</p>

<h2>4. Reservas y señas</h2>
<p>[pendiente: condiciones del salón]</p>

<h2>5. Datos personales</h2>
<p>
	Cómo tratamos tus datos está explicado en la
	<a href={resolve('/party-times/privacy')}>política de privacidad</a>, que forma parte de estas
	condiciones.
</p>

<h2>6. Ley aplicable</h2>
<p>
	Estas condiciones se rigen por las leyes de la República Oriental del Uruguay, y cualquier
	controversia se somete a sus tribunales competentes.
</p>

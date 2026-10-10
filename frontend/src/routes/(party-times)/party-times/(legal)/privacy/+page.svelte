<script lang="ts">
	import { PARTY_TIMES } from '$lib/party-times/brand';
	import { isPending } from '$lib/shared/legal';
	import SeoHead from '$lib/shared/SeoHead.svelte';

	const { entity } = PARTY_TIMES;
</script>

<!-- SKELETON. The section list mirrors the bakery's policy; the bodies wait
     for two things: the venue's legal facts (`$lib/party-times/entity`), and whether
     the WhatsApp assistant keeps answering the venue's queries on the bakery's
     number or moves to a number of the venue's own — which decides whose
     processing sections 3 to 5 describe. Nothing here is invented. -->

<SeoHead
	title="Política de privacidad"
	description="Qué datos personales trata {PARTY_TIMES.name}, para qué, con quién los comparte y cómo ejercer tus derechos."
	path="/party-times/privacy"
	noindex={isPending(entity)}
/>

<h1>Política de privacidad</h1>

<p class="lede">
	Esta política explica qué datos personales trata {PARTY_TIMES.name}, para qué, con quién los
	comparte y cómo podés controlarlos.
</p>

<p class="updated">Última actualización: {PARTY_TIMES.privacyUpdated}</p>

<h2>1. Quién es responsable</h2>
<p>
	<strong>{entity.name}</strong> ({entity.taxIdLabel}
	{entity.taxId}), con domicilio en {entity.address}, es la responsable del tratamiento de los datos
	descritos en esta política.
</p>
<p>Para cualquier cosa relacionada con tus datos, escribinos a {entity.contactEmail}.</p>

<h2>2. El sitio web</h2>
<p>[pendiente: lo que registra el alojamiento del sitio, que se comparte con la panadería]</p>

<h2>3. El canal de WhatsApp</h2>
<p>[pendiente: depende de qué número atiende las consultas del salón]</p>

<h2>4. Con quién se comparten</h2>
<p>[pendiente]</p>

<h2>5. Transferencias internacionales</h2>
<p>[pendiente]</p>

<h2>6. Cuánto tiempo los conservamos</h2>
<p>[pendiente]</p>

<h2 id="rights">7. Tus derechos</h2>
<p>[pendiente]</p>

<script lang="ts">
	import { resolve } from '$app/paths';
	import MailLink from '$lib/MailLink.svelte';
	import PhoneLink from '$lib/PhoneLink.svelte';
	import SeoHead from '$lib/SeoHead.svelte';
	import { LEGAL_ENTITY } from '$lib/legal/entity';
	import { TERMS_UPDATED } from '$lib/legal/versions';
	import { SITE } from '$lib/site';
</script>

<SeoHead
	title="Términos y condiciones"
	description="Condiciones de uso del sitio de Panadería y Confitería Las Delicias y de su canal de atención por WhatsApp."
	path="/terms"
/>

<h1>Términos y condiciones</h1>

<p class="lede">
	Estas condiciones regulan el uso de {SITE.url.replace('https://', '')} y del canal de atención por WhatsApp
	de {SITE.name}. Al usar cualquiera de los dos, las aceptás.
</p>

<p class="updated">Última actualización: {TERMS_UPDATED}</p>

<h2>1. Quiénes somos</h2>
<p>
	<strong>{LEGAL_ENTITY.name}</strong> ({LEGAL_ENTITY.taxIdLabel}
	{LEGAL_ENTITY.taxId}), con domicilio en {LEGAL_ENTITY.address}.
</p>

<h2>2. Qué es este sitio</h2>
<p>
	Es un sitio informativo: mostramos qué hacemos, dónde estamos y cómo contactarnos.
	<strong>No es una tienda</strong> — desde acá no se compra, no se reserva y no se paga.
</p>
<p>
	Los productos, precios, horarios y disponibilidad que aparezcan en el sitio son
	<strong>orientativos</strong> y pueden cambiar sin aviso previo. Para confirmar cualquiera de esas cosas,
	escribinos o pasá por el local.
</p>

<h2>3. El canal de WhatsApp</h2>

<h3>3.1 Parte de las respuestas son automáticas</h3>
<p>
	Una parte de las respuestas la redacta un asistente automático basado en un modelo de lenguaje. Te
	lo decimos de frente porque nos parece que corresponde saberlo. Como cualquier sistema de este
	tipo, <strong>puede equivocarse</strong>: confundir un precio, una fecha, una capacidad o una
	condición.
</p>

<h3>3.2 Una respuesta automática no confirma nada</h3>
<p>
	Ninguna respuesta del asistente constituye una oferta en firme, un presupuesto, una reserva ni una
	confirmación de pedido. <strong
		>Un pedido o una reserva quedan confirmados únicamente cuando los confirma una persona del
		negocio.</strong
	>
</p>
<p>
	Si hay diferencia entre lo que dijo el asistente y lo que confirma una persona del equipo, vale lo
	que dice la persona.
</p>

<h3>3.3 Disponibilidad</h3>
<p>
	No garantizamos que el canal esté disponible en todo momento ni un plazo determinado de respuesta.
	Fuera del horario de atención, la respuesta puede demorar.
</p>

<h2>4. Uso aceptable</h2>
<p>Al escribirnos, te comprometés a no:</p>
<ul>
	<li>enviar contenido ilícito, ofensivo, discriminatorio o engañoso;</li>
	<li>hacerte pasar por otra persona o por el propio negocio;</li>
	<li>usar el canal para publicidad no solicitada o envíos masivos;</li>
	<li>intentar alterar, sobrecargar o vulnerar el funcionamiento del servicio.</li>
</ul>
<p>Podemos dejar de responder a un número que haga cualquiera de estas cosas.</p>

<h2>5. Contenidos del sitio</h2>
<p>
	El nombre, el logo, los textos y las imágenes de este sitio pertenecen a {LEGAL_ENTITY.name} o se usan
	con autorización. Podés compartir enlaces libremente; reproducir los contenidos con fines comerciales
	requiere nuestro permiso.
</p>

<h2>6. Servicios de terceros</h2>
<p>
	El canal de atención funciona sobre WhatsApp, de Meta Platforms, Inc. Su uso se rige además por
	las condiciones de Meta, sobre las que no tenemos control.
</p>

<h2>7. Responsabilidad</h2>
<p>
	El sitio se ofrece tal como está. No respondemos por daños derivados de la imposibilidad de usarlo
	ni por errores en la información orientativa a la que se refiere el punto 2.
</p>
<p>
	<strong
		>Nada de lo anterior limita los derechos que te reconoce la normativa uruguaya de defensa del
		consumidor</strong
	>, que se aplica igual.
</p>

<h2>8. Datos personales</h2>
<p>
	Cómo tratamos tus datos está explicado en la
	<a href={resolve('/privacy')}>política de privacidad</a>, que forma parte de estas condiciones.
</p>

<h2>9. Cambios</h2>
<p>
	Podemos modificar estas condiciones. Cuando lo hagamos, actualizamos la fecha del encabezado; la
	versión vigente es siempre la publicada en esta página.
</p>

<h2>10. Ley aplicable</h2>
<p>
	Estas condiciones se rigen por las leyes de la República Oriental del Uruguay, y cualquier
	controversia se somete a sus tribunales competentes.
</p>

<div class="contact">
	<p>
		<strong>{LEGAL_ENTITY.name}</strong> · {LEGAL_ENTITY.taxIdLabel}
		{LEGAL_ENTITY.taxId}<br />
		{LEGAL_ENTITY.address}<br />
		<MailLink /> ·
		<PhoneLink />
	</p>
</div>

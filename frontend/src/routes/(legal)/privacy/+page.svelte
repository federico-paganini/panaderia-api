<script lang="ts">
	import { resolve } from '$app/paths';
	import MailLink from '$lib/MailLink.svelte';
	import PhoneLink from '$lib/PhoneLink.svelte';
	import SeoHead from '$lib/SeoHead.svelte';
	import { LEGAL_ENTITY } from '$lib/legal/entity';
	import { PRIVACY_UPDATED, RETENTION_DAYS } from '$lib/legal/versions';
	import { ADDRESS, SITE } from '$lib/site';
</script>

<SeoHead
	title="Política de privacidad"
	description="Qué datos personales trata Panadería y Confitería Las Delicias, para qué, con quién los comparte y cómo ejercer tus derechos."
	path="/privacy"
/>

<h1>Política de privacidad</h1>

<p class="lede">
	Esta política explica qué datos personales tratamos, para qué, con quién los compartimos y cómo
	podés controlarlos. Cubre dos cosas distintas: este sitio y el canal de atención por WhatsApp.
</p>

<p class="updated">Última actualización: {PRIVACY_UPDATED}</p>

<h2>1. Quién es responsable</h2>
<p>
	<strong>{LEGAL_ENTITY.name}</strong> ({LEGAL_ENTITY.taxIdLabel}
	{LEGAL_ENTITY.taxId}), con domicilio en {LEGAL_ENTITY.address}, es la responsable del tratamiento
	de los datos descritos en esta política. Opera la Panadería y Confitería Las Delicias y el salón
	de fiestas Las Delicias – Party Times.
</p>
<p>
	Para cualquier cosa relacionada con tus datos, escribinos a
	<MailLink />
	o llamanos al <PhoneLink />.
</p>

<h2>2. El sitio web: prácticamente nada</h2>
<p>
	Este sitio es estático y no te pide ningún dato. <strong>No usa cookies</strong>, no tiene
	analítica ni medición de audiencia, no tiene formularios y no carga recursos de terceros: las
	tipografías se sirven desde nuestro propio dominio justamente para que tu navegador no le avise de
	tu visita a nadie más.
</p>
<p>
	Lo único que queda registrado es lo que registra cualquier servidor web. Nuestro proveedor de
	alojamiento, <strong>Vercel Inc.</strong> (Estados Unidos), guarda registros técnicos de las solicitudes
	que incluyen la dirección IP, la fecha y hora y el navegador utilizado. No los usamos para identificarte
	ni los cruzamos con ninguna otra información.
</p>

<h2>3. El canal de WhatsApp</h2>
<p>Acá sí hay un tratamiento real de datos, y conviene que sepas exactamente cuál.</p>

<h3>3.1 Qué datos tratamos</h3>
<ul>
	<li>Tu número de teléfono.</li>
	<li>El nombre que tengas configurado en tu perfil de WhatsApp.</li>
	<li>
		El contenido de los mensajes que nos mandás: texto, imágenes, audios, ubicación o archivos.
	</li>
	<li>Metadatos técnicos: fecha y hora, identificadores de mensaje y estado de entrega.</li>
</ul>

<h3>3.2 Cómo llegan hasta nosotros</h3>
<p>
	A través de la plataforma WhatsApp Business de <strong>Meta Platforms, Inc.</strong> Meta trata esos
	datos como responsable por derecho propio y bajo sus propias políticas, sobre las que no tenemos control.
</p>

<h3>3.3 Para qué los usamos</h3>
<ul>
	<li>Responder consultas sobre el salón de fiestas y sobre la panadería.</li>
	<li>Derivar la conversación a una persona del equipo cuando hace falta.</li>
	<li>Mantener el hilo de lo conversado mientras la consulta sigue abierta.</li>
</ul>
<p>
	No usamos tus datos para publicidad, no armamos perfiles con ellos y no los cruzamos con ninguna
	otra base.
</p>

<h3>3.4 Respuestas automáticas generadas por un modelo de lenguaje</h3>
<p>
	Parte de las respuestas las redacta un asistente automático. Para generarlas,
	<strong>el texto de tu mensaje se envía a Anthropic PBC</strong> (Estados Unidos), proveedora del modelo
	de lenguaje que escribe la respuesta. Anthropic actúa como encargada del tratamiento: usa ese contenido
	para producir la respuesta y, conforme a sus condiciones de servicio para la API, no lo utiliza para
	entrenar sus modelos.
</p>

<h3>3.5 Este número recibe más que consultas del salón</h3>
<p>
	Es el número de siempre de la panadería. Por él entran también pedidos y mensajes de clientes de
	toda la vida. El asistente automático <strong
		>lee los mensajes entrantes para decidir si corresponde una respuesta automática</strong
	>, y se mantiene en silencio cuando no corresponde. Eso significa que un mensaje puede haber sido
	procesado por el sistema aunque el asistente no lo haya respondido.
</p>

<h3>3.6 Quién los ve</h3>
<p>
	El personal del negocio, desde la aplicación de WhatsApp Business, igual que siempre. Cuando una
	consulta necesita a una persona concreta del equipo, se le avisa por WhatsApp.
</p>

<h2>4. Con quién se comparten</h2>
<div class="table-scroll">
	<table>
		<thead>
			<tr>
				<th>Destinatario</th>
				<th>Para qué</th>
				<th>Dónde trata los datos</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Meta Platforms, Inc.</td>
				<td>Es el canal: sin WhatsApp no hay mensaje</td>
				<td>Estados Unidos e internacional</td>
			</tr>
			<tr>
				<td>Anthropic PBC</td>
				<td>Genera el texto de las respuestas automáticas</td>
				<td>Estados Unidos</td>
			</tr>
			<tr>
				<td>Vercel Inc.</td>
				<td>Aloja y sirve este sitio</td>
				<td>Estados Unidos</td>
			</tr>
		</tbody>
	</table>
</div>
<p>
	No hay ningún otro destinatario. <strong>No vendemos datos personales</strong> ni los cedemos con fines
	publicitarios.
</p>

<h2>5. Transferencias internacionales</h2>
<p>
	Los tres destinatarios de arriba están fuera de Uruguay. Si nos escribís por WhatsApp, ese
	tratamiento fuera del país es inevitable: es cómo funciona el servicio. Si preferís evitarlo,
	podés llamarnos al <PhoneLink /> o pasar por el local, en
	{ADDRESS.oneLine}.
</p>

<h2>6. Cuánto tiempo los conservamos</h2>
<p>
	Los datos de la conversación que guardamos <strong>en nuestros propios sistemas</strong> se
	conservan <strong>{RETENTION_DAYS} días</strong> contados desde el último mensaje, y después se eliminan.
</p>
<p>
	Eso no alcanza al historial que queda dentro de WhatsApp. Esos mensajes viven en la cuenta de
	WhatsApp Business del negocio y en los teléfonos del equipo, y se rigen por las políticas de
	WhatsApp y por el tiempo que se conserven en esos dispositivos.
</p>

<h2 id="rights">7. Tus derechos</h2>
<p>
	La Ley N.º 18.331 de Protección de Datos Personales te reconoce los derechos de
	<strong>acceso, rectificación, actualización, inclusión, supresión y oposición</strong> sobre tus datos.
</p>
<p>
	Para ejercerlos, escribinos a
	<MailLink />
	o llamanos al <PhoneLink />. Vamos a pedirte algo que permita verificar que sos la persona titular
	de los datos — normalmente alcanza con que nos escribas desde el mismo número de WhatsApp.
	Respondemos dentro de los plazos que fija la ley.
</p>
<p>
	Si considerás que no atendimos bien tu pedido, podés reclamar ante la
	<strong>Unidad Reguladora y de Control de Datos Personales (URCDP)</strong>, el órgano de control
	en Uruguay.
</p>

<h2>8. Menores de edad</h2>
<p>
	El canal de atención está pensado para personas adultas. No pedimos ni buscamos datos de menores.
	Si nos das cuenta de que recibimos datos de una persona menor de edad sin autorización de quien
	ejerce su patria potestad, los eliminamos.
</p>

<h2>9. Cambios en esta política</h2>
<p>
	Si esta política cambia, actualizamos la fecha del encabezado. Los cambios importantes se avisan
	en esta misma página.
</p>

<h2>10. Seguridad</h2>
<p>
	Aplicamos medidas razonables para proteger los datos: las credenciales de acceso a la plataforma
	nunca se comparten, las comunicaciones viajan cifradas y el acceso queda limitado al personal que
	lo necesita. Ningún sistema es infalible, y no prometemos lo contrario.
</p>

<div class="contact">
	<p>
		<strong>{LEGAL_ENTITY.name}</strong> · {LEGAL_ENTITY.taxIdLabel}
		{LEGAL_ENTITY.taxId}<br />
		{LEGAL_ENTITY.address}<br />
		<MailLink /> ·
		<PhoneLink />
	</p>
	<p>
		Ver también los <a href={resolve('/terms')}>términos y condiciones</a> de
		{SITE.shortName}.
	</p>
</div>

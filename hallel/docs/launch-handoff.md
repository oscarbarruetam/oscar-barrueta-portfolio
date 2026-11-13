# HALLEL | Publicación del dominio y medición

Estado revisado: 13 de noviembre de 2026.

## 1. Estado verificado

- La web funciona en **https://oscarbarruetam.github.io/hallel-media/** (repositorio principal `oscarbarruetam/hallel-media`).
- Existe una copia en el portafolio `oscarbarruetam/oscar-barrueta-portfolio/hallel/` que debe seguir enlazando hacia el sitio principal.
- `hallelmedia.com` **NO** está conectado. El registro A actual apunta a `192.64.119.212` (Namecheap parking) y `www` a `parkingpage.namecheap.com`.
- Los nameservers son `dns1.registrar-servers.com` y `dns2.registrar-servers.com` (Namecheap BasicDNS).
- El calendario público `https://calendar.app.google/pT9L2mMR988rwKQ38` funciona, está activo, ofrece citas de 30 minutos y genera Meet tras reservar. La consulta del 13/11/2026 mostró citas para ese día, sin demostrar disponibilidad recurrente los días siguientes.
- Los eventos de `assets/conversion-events.js` **solo se agregan a dataLayer**; no hay propiedad GA4/GTM de HALLEL configurada ni se recopilan conversiones confirmadas.

## 2. Conectar Namecheap a GitHub Pages (requiere acceso del dueño)

**Solo el repositorio dedicado `oscarbarruetam/hallel-media` debe recibir el dominio personalizado.** No configurar también el repositorio del portafolio.

1. En Namecheap → Domain List → `hallelmedia.com` → Manage → Advanced DNS, eliminar los registros de aparcamiento que actualmente apuntan a `192.64.119.212` (raíz `@`) y `parkingpage.namecheap.com` (`www`). Preservar registros de correo, SPF, DKIM, DMARC, MX y cualquier otro servicio independiente.
2. Configurar cuatro registros de tipo `A` para host `@`:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Configurar un `CNAME` para `www` → `oscarbarruetam.github.io`. No poner `https://` ni barras.
4. En GitHub → `oscarbarruetam/hallel-media` → Settings → Pages → Custom domain, guardar `hallelmedia.com`. Esperar verificación DNS. Activar *Enforce HTTPS* cuando GitHub tenga el certificado listo.
5. Comprobar con navegador externo que `https://hallelmedia.com/`, `https://www.hallelmedia.com/`, `/agendar/`, `/servicios/shopify-cro/`, `/resultados/` y las imágenes se cargan correctamente.
6. **Solo después de que HTTPS funcione:** actualizar `canonical`, `og:url`, `sitemap.xml`, `robots.txt` del sitio principal y la copia del portafolio para apuntar a `https://hallelmedia.com/`. Actualmente están temporalmente en `https://oscarbarruetam.github.io/hallel-media/` para no señalar a un dominio aparcado.
7. Dar de alta el sitemap en Google Search Console tras verificar propiedad del dominio.

**No crear el archivo CNAME ni forzar redirección antes de ajustar DNS y poder comprobar el dominio**, porque dejaría inaccesible la publicación que hoy sí funciona.

## 3. Agenda

- El booking público funciona; pero hay que verificar en Google Calendar Appointment Schedules que existan bloques recurrentes de 30 minutos para los próximos 14–30 días, que la zona horaria sea la de Ciudad de México y que la disponibilidad no esté limitada a un solo día.
- La página de `/agendar/` ya no promete franjas fijas que puedan diferir de las reales. La disponibilidad oficial la muestra Google.
- NO usar el clic de abrir Google Calendar como cita confirmada.

## 4. Google Analytics y GTM (requiere acceso de cuenta)

1. Crear o localizar una propiedad **GA4 exclusiva para HALLEL** y un contenedor **GTM de HALLEL**; no reutilizar los de clientes.
2. Verificar los identificadores `G-XXXXXXXXXX` / `GTM-XXXXXXX`, propiedad del dueño y acceso administrativo; no publicarlos sin origen comprobado.
3. Conectar GTM a las páginas públicas tras implementar preferencias de consentimiento y aviso de privacidad aplicable.
4. Crear disparadores para eventos en dataLayer ya disponibles:
   `hallel_service_select`, `hallel_case_view`, `hallel_booking_start`, `hallel_booking_page_view`, `hallel_booking_provider_open`, `hallel_contact_whatsapp`, `hallel_contact_instagram`.
5. Validar eventos en GTM Preview/Tag Assistant y GA4 DebugView.
6. Registrar `booking_confirmed` solo mediante una confirmación real de Google Calendar (integración autorizada), y registrar `meeting_attended`, `qualified_lead` y contrato en un CRM. Estos eventos **no están configurados**.

## 5. QA previa a pauta

- Recorrer desktop y móvil, probar idioma ES/EN, servicio → llamada → Google Calendar, y verificar contraste/legibilidad de watermarks.
- Verificar LCP/CLS/INP en el hosting final, Search Console, sitemap, consentimiento y que todas las imágenes se sirvan del repositorio correcto.
- Probar las tres landings `/campanas/shopify-cro/`, `/campanas/klaviyo-email/`, `/campanas/google-ads/`; están `noindex,follow` y enlazan a servicios + agenda.
- No destinar presupuesto a anuncios que apunten al dominio mientras esté aparcado.

## Restricciones técnicas de este trabajo

El repositorio y Google Calendar están conectados al asistente; **Namecheap, GitHub Pages Settings y Google Analytics/GTM no disponen de una sesión de administración conectada aquí**. Las acciones de DNS, vinculación del dominio, propiedad GA4, y configuración de confirmación de agenda deben finalizarse dentro de esas cuentas, con permisos del dueño. No se efectuaron reservas de prueba.

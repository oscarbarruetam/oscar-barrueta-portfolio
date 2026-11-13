# HALLEL — configuración de medición para captación

## Implementado en el sitio

El archivo `assets/conversion-events.js` detecta clics y emite eventos al `window.dataLayer`. **Esto no significa que ya se estén guardando en GA4.** Hace falta conectar un contenedor GTM o un proveedor de analítica válido y configurar los disparadores.

| Evento en dataLayer | Acción del usuario | Qué mide |
|---|---|---|
| `hallel_service_select` | Clic en enlace hacia /servicios/ | Interés en servicio |
| `hallel_case_view` | Clic en enlace hacia /resultados/ | Interés en evidencia |
| `hallel_booking_start` | Clic hacia /agendar/ | Inicio del flujo de reserva |
| `hallel_booking_page_view` | Visita a /agendar/ | Vista de la página de reserva |
| `hallel_booking_provider_open` | Clic para abrir calendar.app.google | Salida hacia el proveedor de agenda |
| `hallel_contact_whatsapp` | Clic hacia WhatsApp | Contacto por WhatsApp |
| `hallel_contact_instagram` | Clic hacia Instagram | Contacto por DM |

Los eventos incluyen `page_path`; cuando corresponde, también `source_page`, `destination`, `case_id` o el servicio especificado en el parámetro de URL. No recopilan datos personales de formularios ni mensajes.

## Pendiente para medición real

1. Conectar el ID real de Google Tag Manager del negocio o configurar GA4 mediante la cuenta que corresponda; **no publicar IDs inventados ni de otras marcas**.
2. En GTM, crear disparadores de tipo *Custom Event* con los nombres anteriores y enviarlos a GA4. Probar en GTM Preview y GA4 DebugView.
3. Registrar la **cita confirmada** desde Google Calendar Appointment Schedules o desde su integración autorizada. Abrir la agenda **no es una conversión confirmada**.
4. Registrar `meeting_attended` y `qualified_lead` en un CRM o proceso comercial. El sitio no conoce esos estados por sí solo.
5. Configurar los controles de consentimiento que correspondan antes de instalar herramientas de analítica que establezcan cookies.

## Embudo comercial sugerido

Visita → servicio seleccionado → clic para agendar → página de reserva → proveedor abierto → cita confirmada (dato externo) → reunión realizada (CRM) → prospecto calificado (CRM) → contrato.

No usar `booking_provider_open` como sustituto de `booking_confirmed` ni reportar un aumento de conversión sin comparar datos reales.

## Páginas para tráfico frío

- `/campanas/shopify-cro/`
- `/campanas/klaviyo-email/`
- `/campanas/google-ads/`

Son páginas de campaña intencionalmente `noindex`. Se puede etiquetar cada anuncio con UTMs sin modificar los valores de las ofertas o los resultados mostrados. Verificar la página de agenda y la atribución antes de invertir.

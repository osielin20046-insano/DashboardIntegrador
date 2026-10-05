# Dashboard Integrador de Servicios Digitales

SPA (HTML + CSS + JavaScript vanilla, módulos ES) que actúa como cliente de 4 servicios en una sola página: **e-commerce**, **multimedia**, **correo electrónico** y **chatbot (WebSockets)**.

## Cómo correrlo

1. Clona el repositorio.
2. Crea tu archivo de configuración a partir del ejemplo (`js/config.js` **no** viene en el repo porque contiene claves):
   ```bash
   cp js/config.example.js js/config.js        # Linux / Mac / Git Bash
   copy js\config.example.js js\config.js      # Windows (CMD)
   ```
3. Abre `js/config.js` y reemplaza por tus credenciales:
   - `YOUTUBE_API_KEY`: en Google Cloud Console, habilita **YouTube Data API v3** y crea una API key.
   - `EMAILJS.service_id`, `EMAILJS.template_id` y `EMAILJS.user_id` (Public Key): se obtienen en el panel de [EmailJS](https://www.emailjs.com).
4. Sirve la carpeta con un servidor local (Live Server de VS Code, o `python -m http.server`). No funciona con doble clic por los módulos ES.
5. Plantilla de EmailJS: debe usar las variables `{{from_name}}`, `{{reply_to}}` y `{{message}}`, que coinciden con los `name` de los campos del formulario.

> **Claves protegidas** `js/config.js` está en `.gitignore`; el repo incluye `js/config.example.js` como plantilla.

## Arquitectura

```
index.html        → estructura de la página única
css/              → base (variables), layout (grid), components
js/main.js        → arranque y conexión de módulos
js/state.js       → estado compartido (token, productos, carrito)
js/config.example.js → plantilla de configuración (URLs y llaves)
js/services/      → comunicación con APIs
    http.js           cliente HTTP central (headers, token, status, log)
    storeService.js   Fake Store: login y catálogo
    youtubeService.js YouTube Data API: búsqueda y metadatos
    emailService.js   EmailJS: envío de correo
    chatService.js    WebSocket
js/ui/            → renderizado del DOM
    storeView.js, cartView.js, videoView.js, contactView.js, chatView.js, dom.js
```

Los **servicios** solo hablan con las APIs; las **vistas** solo pintan el DOM; `main.js` los une. Así cada módulo se puede probar y cambiar sin tocar los demás.


## Manejo de respuestas HTTP

| Código | Dónde aparece | Qué hace la app |
|---|---|---|
| 200 | Todos los servicios | Renderiza el resultado en el DOM |
| 400 | EmailJS (datos o plantilla inválidos), YouTube (petición o key inválida) | Muestra el mensaje en la UI, incluyendo el detalle que devuelve la API |
| 401 | EmailJS (credenciales inválidas) | Mensaje específico en el formulario de contacto |
| 403 | YouTube (cuota agotada o key restringida) | Aviso (toast) para revisar la API key o la cuota |

Todas las llamadas usan `async/await` con `try/catch`. `http.js` registra en consola método, URL, status y tiempo de cada petición, y lanza un error con `status` y `data` cuando la respuesta no es exitosa.

## Notas técnicas

- **Multimedia:** el botón **▶ Videos** de cada producto busca un solo video relacionado (`maxResults=1`) y lo reproduce directamente. El chatbot, en cambio, puede mostrar una lista de 4 resultados. Se filtra con `videoEmbeddable=true` para que el video se pueda reproducir dentro de la página.
- **Reproductor:** se controla con la IFrame Player API y su evento `onStateChange` (sin iniciar, reproduciendo, en pausa, terminado, etc.). Los metadatos (duración y vistas) salen de `contentDetails` y `statistics`. YouTube no expone el bitrate ni la resolución exacta.
- **Cuota de YouTube:** cada búsqueda cuesta 100 unidades y la consulta de detalles 1 unidad, con un límite diario de 10,000. Por eso `youtubeService.js` guarda en caché las búsquedas repetidas.
- **Correo:** el navegador no puede enviar por SMTP, así que se usa la API REST de EmailJS con un payload JSON (`service_id`, `template_id`, `user_id` y `template_params`). El plan gratuito permite 200 envíos al mes.

## Seguridad

- El JWT de la tienda se manda en el header `Authorization: Bearer`.
- Las claves viven en `js/config.js`, que no se sube al repositorio.
- En una app 100% frontend, cualquier llave se puede ver en la pestaña Network. Por eso conviene **restringir la API key de YouTube** por referente HTTP (dominios permitidos) en Google Cloud Console. La Public Key de EmailJS está pensada para usarse en el navegador.

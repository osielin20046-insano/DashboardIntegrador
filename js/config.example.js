// ⚠️ Reemplaza los valores "PON_AQUI_..." con tus datos reales.
export const CONFIG = {
  // E-commerce (Fake Store API) — usuario de prueba de su documentación
  STORE_URL: "https://fakestoreapi.com",
  STORE_USER: { username: "mor_2314", password: "83r5^_" },

  // Multimedia (YouTube Data API v3)
  YOUTUBE_URL: "https://www.googleapis.com/youtube/v3",
  YOUTUBE_API_KEY: "PON_AQUI_TU_API_KEY_DE_YOUTUBE",

  // Correo (EmailJS REST API)
  EMAILJS_URL: "https://api.emailjs.com/api/v1.0/email/send",
  EMAILJS: {
    service_id: "PON_AQUI_TU_SERVICE_ID",
    template_id: "PON_AQUI_TU_TEMPLATE_ID",
    user_id: "PON_AQUI_TU_PUBLIC_KEY",
  },

  // Chat (WebSocket) — servidor de eco; cámbialo si deja de funcionar
  WS_URL: "wss://ws.postman-echo.com/raw",
};

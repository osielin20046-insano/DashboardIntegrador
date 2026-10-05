const MSG = {
  400: "Datos inválidos o plantilla incorrecta (400).",
  401: "Credenciales de EmailJS inválidas (401).",
  403: "EmailJS rechazó la petición (403): revisa la configuración de tu cuenta y servicio.",
  429: "Demasiados envíos seguidos (429). Espera un momento e intenta de nuevo.",
};

export function initContact(form, out, send) {
  const btn = form.querySelector("button");
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return; // respeta los atributos required/type="email" del HTML
    if (btn) btn.disabled = true;
    out.textContent = "Enviando…";
    try {
      await send(Object.fromEntries(new FormData(form)));
      out.textContent = "Mensaje enviado (200 OK).";
      form.reset();
    }  catch (err) {
  console.error("EmailJS:", err.status, err.data);
  const detail = typeof err.data === "string" ? ` — ${err.data}` : "";
  out.textContent = (MSG[err.status] || `No se pudo enviar: ${err.message}`) + detail;
}
  };
}
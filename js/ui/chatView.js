// js/ui/chatView.js
import { connectChat, sendChat } from "../services/chatService.js";

const CATS = [
  [/electr/, "electronics"],
  [/joy/, "jewelery"],
  [/mujer|women/, "women's clothing"],
  [/hombre|\bmen/, "men's clothing"]
];

// Sugerencias rápidas para el usuario
const SUGGESTIONS = [
  "¿Cuánto tarda en llegar mi pedido?",
  "¿Cuáles son los métodos de pago?",
  "¿Cómo realizo una devolución?",
  "Ver mi carrito",
  "Videos de laptops"
];

export function initChat({ log, form, input, status }, act) {
  const sent = [];

  const add = (who, text) => {
    const p = document.createElement("p");
    p.className = who;
    p.textContent = text;
    log.append(p);
    log.scrollTop = log.scrollHeight;
  };

  const showTyping = () => {
    if (document.getElementById("typing")) return;
    const p = document.createElement("p");
    p.id = "typing";
    p.className = "bot typing";
    p.textContent = "Bot está escribiendo...";
    log.append(p);
    log.scrollTop = log.scrollHeight;
  };

  const hideTyping = () => {
    const el = document.getElementById("typing");
    if (el) el.remove();
  };
  
  // Renderiza los botones de sugerencias debajo del log de mensajes
  const renderSuggestions = () => {
    let suggContainer = document.getElementById("chatSuggestions");
    if (!suggContainer) {
      suggContainer = document.createElement("div");
      suggContainer.id = "chatSuggestions";
      suggContainer.className = "chat-suggestions";
      log.parentNode.insertBefore(suggContainer, form);
    }

    suggContainer.innerHTML = SUGGESTIONS.map(
      (s) => `<button type="button" class="sugg-chip">${s}</button>`
    ).join("");

    suggContainer.querySelectorAll(".sugg-chip").forEach((btn) => {
      btn.onclick = () => {
        input.value = btn.textContent;
        form.requestSubmit(); // Envía el formulario automáticamente
      };
    });
  };

  const bot = (t) => {
    const q = t.toLowerCase();

    // 1. Preguntas Frecuentes (Envío, Pagos, Devoluciones)
    if (/tarda|envío|envio|tiempo|llegar|pedido|entrega/.test(q)) {
      return "El envío estándar tarda de 3 a 5 días hábiles. Si es envío exprés, llega de 1 a 2 días hábiles.";
    }
    if (/pago|tarjeta|metodo|método|transferencia/.test(q)) {
      return "Aceptamos tarjetas de crédito/débito (Visa, Mastercard), PayPal y transferencias bancarias.";
    }
    if (/devolucion|devolución|cambio|garantía|garantia/.test(q)) {
      return "Tienes hasta 30 días posteriores a tu compra para solicitar la devolución o cambio sin costo adicional.";
    }

    // 2. Búsqueda de Videos
    if (/video/.test(q)) {
      const term = q.replace(/\b(videos?|de|sobre|busca|buscar)\b/g, "").trim() || "tecnología";
      act.showVideos(term);
      return `Buscando videos de "${term}".`;
    }

    // 3. Filtrar Categorías de Tienda
    const cat = CATS.find(([re]) => re.test(q));
    if (cat) {
      act.setCategory(cat[1]);
      return `Mostrando la categoría ${cat[1]}.`;
    }

    // 4. Carrito y Contacto
    if (/carrito|total/.test(q)) return act.cartInfo();
    if (/contacto|correo|mensaje/.test(q)) {
      act.openContact();
      return "Te llevo al formulario de contacto.";
    }

    return "Puedo ayudarte con información de envíos, pagos, devoluciones, filtrar productos, buscar videos o revisar tu carrito.";
  };

  // Conexión WebSocket
  connectChat(
    (m) => {
      const i = sent.indexOf(m);
      if (i < 0) return;
      sent.splice(i, 1);
      
      setTimeout(() => {
        hideTyping();
        add("bot", bot(m));
      }, 400);
    },
    (s) => (status.textContent = s)
  );

  form.onsubmit = (e) => {
    e.preventDefault();
    const t = input.value.trim();
    if (!t) return;
    add("user", t);
    if (sendChat(t)){
      sent.push(t);
      showTyping();
    } 
    else add("bot", "Sin conexión con el servidor de chat.");
    input.value = "";
  };

  renderSuggestions();
}
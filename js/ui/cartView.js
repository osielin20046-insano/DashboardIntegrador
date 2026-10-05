import { esc } from "./dom.js";

export function renderCart(el, cart, onRemove) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.innerHTML = cart.length
    ? cart
        .map((i) => `<li><span>${esc(i.title.slice(0, 26))}… ×${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)} <button data-rm="${i.id}" aria-label="Quitar">✕</button></span></li>`)
        .join("") + `<li class="total"><span>Total</span><span>$${total.toFixed(2)}</span></li>`
    : `<li class="muted">Tu carrito está vacío.</li>`;
  el.onclick = (e) => e.target.dataset.rm && onRemove(+e.target.dataset.rm);
}

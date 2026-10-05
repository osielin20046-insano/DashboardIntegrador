import { esc } from "./dom.js";

export function renderStore(el, products, { onAdd, onVideos }) {
  el.innerHTML = products
    .map(
      (p) => `<article class="card">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
        <h3>${esc(p.title)}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <div class="row"><button data-add="${p.id}">Agregar</button><button class="ghost" data-vid="${p.id}">▶ Videos</button></div>
      </article>`
    )
    .join("");
  el.onclick = (e) => {
    const { add, vid } = e.target.dataset;
    if (add) onAdd(+add);
    if (vid) onVideos(+vid);
  };
}

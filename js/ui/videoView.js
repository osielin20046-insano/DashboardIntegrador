import { esc } from "./dom.js";

let player, ready;

export function loadYT() {
  ready = new Promise((res) => { window.onYouTubeIframeAPIReady = res; });
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.append(s);
}

export function renderVideos(el, vids, onPick) {
  el.innerHTML =
    vids
      .map((v) => `<li><button data-id="${esc(v.id)}">${esc(v.title)}</button>
        <div class="muted">${esc(v.channel)} · ${v.duration} · ${Number(v.views || 0).toLocaleString()} vistas</div></li>`)
      .join("") || `<li class="muted">Sin resultados.</li>`;
  el.onclick = (e) => e.target.dataset.id && onPick(e.target.dataset.id);
}

// onState recibe el código de estado de la IFrame Player API (eventos del reproductor).
export async function playVideo(id, onState) {
  await ready;
  if (player) return player.loadVideoById(id);
  player = new YT.Player("player", {
    videoId: id,
    playerVars: { autoplay: 1 },
    events: { onStateChange: (e) => onState(e.data) },
  });
}

import { state } from "./state.js";
import { $, esc } from "./ui/dom.js";
import { login, getProducts } from "./services/storeService.js";
import { searchVideos } from "./services/youtubeService.js";
import { sendEmail } from "./services/emailService.js";
import { renderStore } from "./ui/storeView.js";
import { renderCart } from "./ui/cartView.js";
import { loadYT, renderVideos, playVideo } from "./ui/videoView.js";
import { initChat } from "./ui/chatView.js";
import { initContact } from "./ui/contactView.js";

const PLAYER_STATES = { "-1": "sin iniciar", 0: "terminado", 1: "reproduciendo", 2: "en pausa", 3: "cargando", 5: "en cola" };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => (t.hidden = true), 4000);
}

function drawStore() {
  const cat = $("#filter").value;
  const list = cat ? state.products.filter((p) => p.category === cat) : state.products;
  renderStore($("#products"), list, {
    onAdd: addToCart,
    onVideos: (id) => {
  const p = state.products.find((x) => x.id === id);
  showVideos(`${p.title.split(" ").slice(0, 4).join(" ")} reseña`, true); // true = solo uno
},
  });
}

function addToCart(id) {
  const item = state.cart.find((i) => i.id === id);
  if (item) item.qty++;
  else state.cart.push({ ...state.products.find((p) => p.id === id), qty: 1 });
  drawCart();
}

function drawCart() {
  renderCart($("#cart"), state.cart, (id) => {
    state.cart = state.cart.filter((i) => i.id !== id);
    drawCart();
  });
  $("#cartCount").textContent = state.cart.reduce((n, i) => n + i.qty, 0);
}

async function showVideos(q, single = false) {
  $("#videoTitle").textContent = `Videos: ${q}`;
  const onState = (s) => ($("#playerState").textContent = PLAYER_STATES[s] ?? s);
  const pick = (id) => playVideo(id, onState);
  try {
    const vids = await searchVideos(q, single ? 1 : 4);
    renderVideos($("#videoList"), vids, pick);
    if (single && vids.length) pick(vids[0].id); // reproducir de una vez
    else if (single) toast("No encontré un video relacionado para este producto.");
  } catch (e) {
    toast(e.status === 403 || e.status === 400 ? `YouTube (${e.status}): revisa tu API key o la cuota.` : `YouTube: ${e.message}`);
  }
}

function setCategory(cat) {
  $("#filter").value = cat;
  drawStore();
}

function cartInfo() {
  const n = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  return n ? `Llevas ${n} artículo(s), total $${total.toFixed(2)}.` : "Tu carrito está vacío.";
}

async function boot() {
  drawCart();
  try { await login(); $("#auth").textContent = "🔒 JWT activo"; }
  catch (e) { toast(`Login: ${e.message}`); }

  try {
    state.products = await getProducts();
    const cats = [...new Set(state.products.map((p) => p.category))];
    $("#filter").insertAdjacentHTML("beforeend", cats.map((c) => `<option>${esc(c)}</option>`).join(""));
    $("#filter").onchange = drawStore;
    drawStore();
  } catch (e) {
    $("#products").textContent = "No se pudo cargar el catálogo.";
    toast(`Tienda: ${e.message}`);
  }

  loadYT();
  initChat(
    { log: $("#chatLog"), form: $("#chatForm"), input: $("#chatInput"), status: $("#chatStatus") },
    { setCategory, showVideos, cartInfo, openContact: () => $("#contactForm input").focus() }
  );
  initContact($("#contactForm"), $("#mailStatus"), sendEmail);
}

boot();

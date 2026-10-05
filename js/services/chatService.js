import { CONFIG } from "../config.js";

let ws;

export function connectChat(onMessage, onStatus) {
  ws = new WebSocket(CONFIG.WS_URL);
  ws.onopen = () => onStatus("conectado");
  ws.onclose = () => onStatus("desconectado");
  ws.onerror = () => onStatus("error de conexión");
  ws.onmessage = (e) => onMessage(e.data);
}

export function sendChat(text) {
  if (ws?.readyState !== WebSocket.OPEN) return false;
  ws.send(text);
  return true;
}

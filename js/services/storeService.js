import { CONFIG } from "../config.js";
import { state } from "../state.js";
import { http } from "./http.js";

const PLATZI = "https://api.escuelajs.co/api/v1";

export async function login() {
  try {
    const { access_token } = await http(`${PLATZI}/auth/login`, {
      method: "POST",
      body: { email: "john@mail.com", password: "changeme" }, // usuario de prueba de su documentación
    });
    state.token = access_token;
  } catch (e) {
    console.warn("Platzi login falló, probando Fake Store", e);
    const { token } = await http(`${CONFIG.STORE_URL}/auth/login`, { method: "POST", body: CONFIG.STORE_USER });
    state.token = token;
  }
  return state.token;
}

export async function getProducts() {
  try {
    const list = await http(`${PLATZI}/products?offset=0&limit=20`, { token: state.token });
    return list.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category?.name ?? "otros",
      image: String(p.images?.[0] ?? "").match(/https?:\/\/[^"\]\s,]+/)?.[0] ?? "",
    }));
  } catch (e) {
    console.warn("Platzi no responde, probando Fake Store", e);
    return http(`${CONFIG.STORE_URL}/products`);
  }
}
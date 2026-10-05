// Cliente HTTP central: headers, token, manejo de status y log para la pestaña Network.
export async function http(url, { method = "GET", body, token, headers = {} } = {}) {
  const h = { ...headers };
  if (body) h["Content-Type"] = "application/json";
  if (token) h.Authorization = `Bearer ${token}`;
  const t0 = performance.now();
  const res = await fetch(url, { method, headers: h, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(8000) });
  console.log(`[HTTP] ${method} ${url.split("?")[0]} -> ${res.status} (${Math.round(performance.now() - t0)} ms)`);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

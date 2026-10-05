import { CONFIG } from "../config.js";
import { http } from "./http.js";

const cache = new Map(); // evita gastar cuota repitiendo búsquedas

function parseDuration(iso = "") {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return "–";
  const [h, min, s] = [m[1] || 0, m[2] || 0, m[3] || 0];
  return `${h ? h + ":" : ""}${String(min).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}

export async function searchVideos(q, max = 4) {
  const key = `${q}|${max}`; // la caché ahora distingue "1 video" de "4 videos"
  if (cache.has(key)) return cache.get(key);
  const { YOUTUBE_URL: U, YOUTUBE_API_KEY: K } = CONFIG;
  const s = await http(
    `${U}/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${max}&q=${encodeURIComponent(q)}&key=${K}`
  );
  if (!s.items.length) return []; // sin resultados: evitamos pedir detalles de "nada"
  const ids = s.items.map((i) => i.id.videoId).join(",");
  const d = await http(`${U}/videos?part=contentDetails,statistics&id=${ids}&key=${K}`);
  const videos = s.items.map((it) => {
    const det = d.items.find((x) => x.id === it.id.videoId);
    return {
      id: it.id.videoId,
      title: it.snippet.title,
      channel: it.snippet.channelTitle,
      duration: parseDuration(det?.contentDetails.duration),
      views: det?.statistics.viewCount,
    };
  });
  cache.set(key, videos);
  return videos;
}

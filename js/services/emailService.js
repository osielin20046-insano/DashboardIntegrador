import { CONFIG } from "../config.js";
import { http } from "./http.js";

// Los nombres de template_params deben coincidir con las variables de tu plantilla EmailJS.
export const sendEmail = (params) =>
  http(CONFIG.EMAILJS_URL, { method: "POST", body: { ...CONFIG.EMAILJS, template_params: params } });

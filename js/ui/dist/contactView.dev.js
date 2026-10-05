"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initContact = initContact;
var MSG = {
  400: "Datos inválidos o plantilla incorrecta (400).",
  401: "Credenciales de EmailJS inválidas (401).",
  403: "EmailJS rechazó la petición (403): revisa la configuración de tu cuenta y servicio.",
  429: "Demasiados envíos seguidos (429). Espera un momento e intenta de nuevo."
};

function initContact(form, out, send) {
  var btn = form.querySelector("button");

  form.onsubmit = function _callee(e) {
    var detail;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();

            if (form.reportValidity()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            // respeta los atributos required/type="email" del HTML
            if (btn) btn.disabled = true;
            out.textContent = "Enviando…";
            _context.prev = 5;
            _context.next = 8;
            return regeneratorRuntime.awrap(send(Object.fromEntries(new FormData(form))));

          case 8:
            out.textContent = "Mensaje enviado (200 OK).";
            form.reset();
            _context.next = 17;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](5);
            console.error("EmailJS:", _context.t0.status, _context.t0.data);
            detail = typeof _context.t0.data === "string" ? " \u2014 ".concat(_context.t0.data) : "";
            out.textContent = (MSG[_context.t0.status] || "No se pudo enviar: ".concat(_context.t0.message)) + detail;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[5, 12]]);
  };
}
//# sourceMappingURL=contactView.dev.js.map

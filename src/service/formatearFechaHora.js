export function formatearHora(hora) {
    if (!hora) return "";

    const [h, m] = hora.split(":").map(Number);
    const sufijo = h >= 12 ? " pm" : " am";

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${sufijo}`;
  }

export function formatearFecha(fecha) {
    if (!fecha) return "";
    const [yyyy, mm, dd] = fecha.split("-");
    return `${dd}-${mm}-${yyyy}`;
  }

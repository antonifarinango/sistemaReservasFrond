import { useState, useEffect } from "react";
import { getHorario } from "../service/disponibilidad";

const EMPTY_ARRAY = [];

export default function SelectHoras({ fecha, horas, minutos, value, onHoraChange, reservasMesa = EMPTY_ARRAY, editReservaId = null }) {
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horarioDia, setHorarioDia] = useState(null);

  // Obtener el horario según el día de la semana
  useEffect(() => {
    if (!fecha) return;

    const opciones = { weekday: "long" };
    const dia = new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", opciones);
    const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);

    getHorario(diaCapitalizado).then((data) => {
      setHorarioDia(data);
    });
  }, [fecha]);

  // Generar los intervalos cuando ya tengamos el horario
  useEffect(() => {
    if (!horarioDia) return;

    const ahora = new Date();
    const fechaActual = new Date().toLocaleDateString("en-CA"); // formato YYYY-MM-DD local

    let horaInicio, minutoInicio;

    if (fecha === fechaActual) {
      horaInicio = ahora.getHours();
      minutoInicio = ahora.getMinutes();
    } else {
      const [h, m] = horarioDia.horaApertura.split(":").map(Number);
      horaInicio = h;
      minutoInicio = m;
    }

    const [horaFin, minutoFin] = [horas, minutos];

    let inicio = new Date(`${fecha}T00:00:00`);
    inicio.setHours(horaInicio, minutoInicio < 30 ? 30 : 0, 0, 0);
    if (minutoInicio >= 30) inicio.setHours(horaInicio + 1, 0, 0);

    let fin = new Date(`${fecha}T00:00:00`);
    fin.setHours(horaFin, minutoFin, 0, 0);
    fin.setMinutes(fin.getMinutes() - 30);

    // Si la hora de fin es anterior al inicio → limpiar todo
    if (fin <= inicio) {
      setHorasDisponibles([]);
      return;
    }

    const intervalos = [];
    const cursor = new Date(inicio);

    const horasOcupadas = reservasMesa
      .filter((r) => r.fecha.startsWith(fecha) && r.id !== editReservaId && r.estadoReserva !== "Cancelada")
      .map((r) => r.fecha.split("T")[1].substring(0, 5));

    while (cursor <= fin) {
      const h = String(cursor.getHours()).padStart(2, "0");
      const m = String(cursor.getMinutes()).padStart(2, "0");
      const horaStr = `${h}:${m}`;
      
      intervalos.push({
        hora: horaStr,
        ocupado: horasOcupadas.includes(horaStr)
      });
      
      cursor.setMinutes(cursor.getMinutes() + 30);
    }

    setHorasDisponibles(intervalos);
  }, [fecha, horarioDia, horas, minutos, reservasMesa, editReservaId]);

  // Validar que el value actual esté dentro de las horas disponibles
  useEffect(() => {
    if (horasDisponibles.length > 0) {
      // Find the first non-occupied hour if value is empty or not in the list
      const isValid = horasDisponibles.some(h => h.hora === value && !h.ocupado);
      
      if (!isValid && value) {
        // If the current value is occupied (and it's not our own edited reservation), or not in list
        // Try to select the first available one
        const firstAvailable = horasDisponibles.find(h => !h.ocupado);
        if (firstAvailable) {
          onHoraChange(firstAvailable.hora);
        } else {
          // Si no hay disponibles, limpiar
          onHoraChange("");
        }
      } else if (!value) {
        const firstAvailable = horasDisponibles.find(h => !h.ocupado);
        if (firstAvailable) {
          onHoraChange(firstAvailable.hora);
        }
      }
    } else if (horasDisponibles.length === 0 && value !== "") {
      onHoraChange("");
    }
  }, [horasDisponibles, value, onHoraChange]);

  const handleChange = (e) => {
    onHoraChange(e.target.value);
  };
  

  return (
    <select
      className="form-select"
      value={value || ""}
      onChange={handleChange}
      required
      disabled={horasDisponibles.length === 0}
    >
      {horasDisponibles.map((item, i) => (
        <option key={i} value={item.hora} disabled={item.ocupado}>
          {item.hora} {item.ocupado ? "(Reservado)" : ""}
        </option>
      ))}
    </select>
  );
}

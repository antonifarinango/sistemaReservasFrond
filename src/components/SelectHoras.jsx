import { useState, useEffect } from "react";
import { getHorario } from "../service/disponibilidad";

export default function SelectHoras({ fecha, horas, minutos, onHoraChange }) {
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
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
      setHoraSeleccionada("");
      onHoraChange("");
      return;
    }

    const intervalos = [];
    const cursor = new Date(inicio);
    while (cursor <= fin) {
      const h = String(cursor.getHours()).padStart(2, "0");
      const m = String(cursor.getMinutes()).padStart(2, "0");
      intervalos.push(`${h}:${m}`);
      cursor.setMinutes(cursor.getMinutes() + 30);
    }

    setHorasDisponibles(intervalos);
    setHoraSeleccionada(intervalos[0] || "");
    onHoraChange(intervalos[0] || "");

  }, [fecha, horarioDia, horas, minutos]);

  const handleChange = (e) => {
    const value = e.target.value;
    setHoraSeleccionada(value);
    onHoraChange(value);
  };
  

  return (
    <select
      className="form-select"
      value={horaSeleccionada}
      onChange={handleChange}
      required
      disabled={horasDisponibles.length === 0}
    >
      {horasDisponibles.map((hora, i) => (
        <option key={i} value={hora}>
          {hora}
        </option>
      ))}
    </select>
  );
}

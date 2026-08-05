// Utilidades compartidas entre la carta Levey-Jennings de un nivel
// (GraficoLeveyJennings) y la vista combinada de varios niveles
// (GraficoLeveyJenningsCombinado): formateo de fechas y clasificacion de un
// punto por su puntaje z, para no duplicar esta logica entre ambos graficos.

export const colorResultado = "#157a70";
export const colorMedia = "#c34f71";
export const colorAlerta = "#a6690a";
export const colorControl = "#b3392f";

// Paleta de series para el grafico combinado: un color por nivel, distinto
// de los colores de las lineas de referencia (media/alerta/control) para no
// confundir "que nivel es" con "que tan grave es el punto".
export const paletaSeriesPorNivel = ["#157a70", "#3457d5", "#7c3aed", "#c2740c"];

export const nombresDeMeses = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Clasifica un punto por su puntaje z (cuantas DE se aleja de la media),
// usando el mismo criterio 2 DE / 3 DE que el resto de la app (ver
// clasificarValidacion en westgard.js). El color de "en control" es
// parametrizable para que cada serie del grafico combinado conserve su
// propio color cuando esta dentro de rango.
export function obtenerEstadoDelPunto(puntajeZ, colorEnControl = colorResultado) {
  if (Math.abs(puntajeZ) > 3) return { texto: "Fuera de control", color: colorControl };
  if (Math.abs(puntajeZ) > 2) return { texto: "Alerta", color: colorAlerta };
  return { texto: "En control", color: colorEnControl };
}

export function obtenerFechaCorta(fecha) {
  if (!fecha) return "Sin fecha";
  const partesDeFecha = fecha.split(/[-/]/);
  return partesDeFecha.length >= 2 ? `${partesDeFecha[0]}/${partesDeFecha[1]}` : fecha;
}

export function obtenerFechaCompleta(fecha, hora) {
  if (!fecha) return `Sin fecha · ${hora || "Sin hora"}`;
  const partesDeFecha = fecha.split(/[-/]/);
  if (partesDeFecha.length < 3) return `${fecha} · ${hora || "Sin hora"}`;

  const [dia, mes, anio] = partesDeFecha;
  const nombreDelMes = nombresDeMeses[Number(mes) - 1] ?? mes;
  return `${dia} de ${nombreDelMes} de ${anio} · ${hora || "Sin hora"}`;
}

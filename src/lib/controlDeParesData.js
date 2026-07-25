// Datos mock del modulo "Control de Pares": comparacion de un mismo examen
// leido/medido por dos tecnicos distintos (Control 1 / Control 2), tal como
// se llevaba hasta ahora en una planilla de Google Sheets con una hoja por
// mes. Mismo criterio que mockData.js: todo centralizado aca para que el dia
// que exista el backend real (Java) el reemplazo sea solo esta capa, sin
// tocar la UI.

export const mesesControlDePares = [
  { id: "2026-05", etiqueta: "Mayo 2026" },
  { id: "2026-06", etiqueta: "Junio 2026" },
  { id: "2026-07", etiqueta: "Julio 2026" },
];

export const registrosControlDePares = [
  // Mayo 2026
  {
    id: "CP-2026-05-001",
    mesId: "2026-05",
    fecha: "06-05-2026",
    examen: "Recuento de reticulocitos",
    control1: { valor: "1,35%", tecnico: "BOL" },
    control2: { valor: "1,42%", tecnico: "FDI" },
    observaciones: "",
  },
  {
    id: "CP-2026-05-002",
    mesId: "2026-05",
    fecha: "06-05-2026",
    examen: "Velocidad de hemosedimentación (VHS)",
    control1: { valor: "12 mm/h", tecnico: "MVE" },
    control2: { valor: "14 mm/h", tecnico: "RSO" },
    observaciones: "",
  },
  {
    id: "CP-2026-05-003",
    mesId: "2026-05",
    fecha: "20-05-2026",
    examen: "Tinción de Gram",
    control1: { valor: "Cocos gram (+) en racimos", tecnico: "BOL" },
    control2: { valor: "Cocos gram (+) en racimos", tecnico: "MVE" },
    observaciones: "Concordante",
  },

  // Junio 2026
  {
    id: "CP-2026-06-001",
    mesId: "2026-06",
    fecha: "02-06-2026",
    examen: "Recuento de reticulocitos",
    control1: { valor: "1,40%", tecnico: "BOL" },
    control2: { valor: "1,50%", tecnico: "FDI" },
    observaciones: "",
  },
  {
    id: "CP-2026-06-002",
    mesId: "2026-06",
    fecha: "02-06-2026",
    examen: "Eosinófilos en secreción nasal",
    control1: { valor: "Negativo", tecnico: "FDI" },
    control2: { valor: "Negativo", tecnico: "BOL" },
    observaciones: "",
  },
  {
    id: "CP-2026-06-003",
    mesId: "2026-06",
    fecha: "15-06-2026",
    examen: "Frotis manual",
    control1: { valor: "Tinción OK", tecnico: "BOL" },
    control2: { valor: "Tinción OK", tecnico: "MVE" },
    observaciones: "Células epiteliales: abundante · Leucocitos 5-10 · Eritrocitos 0-3",
  },
  {
    id: "CP-2026-06-004",
    mesId: "2026-06",
    fecha: "22-06-2026",
    examen: "Sedimento urinario",
    control1: { valor: "Leucocitos 3-5/campo", tecnico: "RSO" },
    control2: { valor: "Leucocitos 4-6/campo", tecnico: "MVE" },
    observaciones: "",
  },

  // Julio 2026
  {
    id: "CP-2026-07-001",
    mesId: "2026-07",
    fecha: "02-07-2026",
    examen: "Recuento de reticulocitos",
    control1: { valor: "1,40%", tecnico: "BOL" },
    control2: { valor: "1,50%", tecnico: "FDI" },
    observaciones: "",
  },
  {
    id: "CP-2026-07-002",
    mesId: "2026-07",
    fecha: "02-07-2026",
    examen: "Eosinófilos en secreción nasal",
    control1: { valor: "Negativo", tecnico: "FDI" },
    control2: { valor: "Negativo", tecnico: "BOL" },
    observaciones: "",
  },
  {
    id: "CP-2026-07-003",
    mesId: "2026-07",
    fecha: "09-07-2026",
    examen: "Frotis manual",
    control1: { valor: "Tinción OK", tecnico: "BOL" },
    control2: { valor: "Tinción OK", tecnico: "AMH" },
    observaciones: "Células epiteliales: abundante · Leucocitos 5-10 · Eritrocitos 0-3",
  },
  {
    id: "CP-2026-07-004",
    mesId: "2026-07",
    fecha: "18-07-2026",
    examen: "Velocidad de hemosedimentación (VHS)",
    control1: { valor: "10 mm/h", tecnico: "RSO" },
    control2: { valor: "18 mm/h", tecnico: "MVE" },
    observaciones: "Revisar: diferencia mayor a la esperada",
  },
];

export function obtenerRegistrosPorMes(mesId) {
  return registrosControlDePares.filter((registro) => registro.mesId === mesId);
}

export function obtenerMesPorId(mesId) {
  return mesesControlDePares.find((mes) => mes.id === mesId);
}

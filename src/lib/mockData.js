// Datos mock del modulo "Analisis QC" (Controles).
//
// Todo esta centralizado en este archivo (en vez de vivir dentro de cada
// componente) para que el dia que exista un backend real, cambiar de mock a
// API sea solo cambiar la fuente de estos datos, sin tocar la UI.

// Las 8 categorias de analisis del laboratorio. El "id" es el slug que se
// usa en la URL (/Controles/[id]).
export const categorias = [
  { id: "quimica", nombre: "Quimica", area: "Bioquimica" },
  { id: "hematologia", nombre: "Hematologia", area: "Laboratorio" },
  { id: "hormonas", nombre: "Hormonas", area: "Inmunoanalisis" },
  { id: "microbiologia", nombre: "Microbiologia", area: "Cultivos" },
  { id: "parasitologia", nombre: "Parasitologia", area: "Laboratorio" },
  { id: "biologia-molecular", nombre: "Biologia Molecular", area: "Genetica" },
  { id: "banco-de-sangre", nombre: "Banco de sangre", area: "Hemoterapia" },
  { id: "serologia", nombre: "Serologia", area: "Inmunoanalisis" },
];

// Analitos que se controlan en cada categoria.
export const analitos = [
  { id: "glucosa", nombre: "Glucosa", unidad: "mg/dL", categoriaId: "quimica" },
  { id: "colesterol", nombre: "Colesterol total", unidad: "mg/dL", categoriaId: "quimica" },
  { id: "creatinina", nombre: "Creatinina", unidad: "mg/dL", categoriaId: "quimica" },
  { id: "hemoglobina", nombre: "Hemoglobina", unidad: "g/dL", categoriaId: "hematologia" },
  { id: "hematocrito", nombre: "Hematocrito", unidad: "%", categoriaId: "hematologia" },
  { id: "leucocitos", nombre: "Leucocitos", unidad: "x10^3/uL", categoriaId: "hematologia" },
  { id: "tsh", nombre: "TSH", unidad: "uUI/mL", categoriaId: "hormonas" },
  { id: "t4-libre", nombre: "T4 libre", unidad: "ng/dL", categoriaId: "hormonas" },
  { id: "recuento-colonias", nombre: "Recuento de colonias", unidad: "UFC/mL", categoriaId: "microbiologia" },
  { id: "carga-parasitaria", nombre: "Carga parasitaria", unidad: "parasitos/campo", categoriaId: "parasitologia" },
  { id: "carga-viral", nombre: "Carga viral", unidad: "copias/mL", categoriaId: "biologia-molecular" },
  { id: "hemoglobina-donante", nombre: "Hemoglobina donante", unidad: "g/dL", categoriaId: "banco-de-sangre" },
  { id: "indice-reactividad", nombre: "Indice de reactividad", unidad: "S/CO", categoriaId: "serologia" },
];

// Patrones de puntaje z (cuantas SD se aleja cada punto de la media) usados
// para generar series de resultados de ejemplo. Se dejan explicitos para que
// se entienda por que un nivel termina en verde, naranja o rojo cuando el
// motor de reglas de westgard.js lo evalua (no es un color puesto a mano).
const PATRON_OK = [0.2, -0.3, 0.1, 0.4, -0.2, 0.3, -0.1, 0.2, 0.0, -0.3, 0.1, 0.2];
const PATRON_ADVERTENCIA_1_2S = [0.1, -0.2, 0.3, -0.1, 0.2, 0.0, -0.3, 0.2, 0.1, -0.2, 0.3, 2.3];
const PATRON_RECHAZO_1_3S = [0.1, -0.2, 0.1, -0.1, 0.2, -0.1, 0.1, -0.2, 0.1, -0.1, 0.2, 3.4];
const PATRON_RECHAZO_2_2S = [0.1, -0.1, 0.2, -0.2, 0.1, -0.1, 0.2, -0.1, 0.1, -0.2, 2.2, 2.4];

// Convierte un patron de puntajes z en valores "medidos" usando la media y
// la SD real del nivel (asi el motor de reglas trabaja con datos crudos,
// igual que lo haria con mediciones reales de un instrumento).
function generarValores(media, sd, patronZ) {
  return patronZ.map((z) => Number((media + z * sd).toFixed(2)));
}

// Arma los dos niveles clasicos (Normal y Patologico) de un control a partir
// de sus medias/SD reales y del patron de comportamiento que se le quiera dar
// a cada nivel (PATRON_OK, PATRON_ADVERTENCIA_1_2S, etc).
function crearNiveles({ normal, patologico }) {
  return [
    {
      id: "normal",
      nombre: "Normal",
      media: normal.media,
      sd: normal.sd,
      unidad: normal.unidad,
      valores: generarValores(normal.media, normal.sd, normal.patron),
    },
    {
      id: "patologico",
      nombre: "Patologico",
      media: patologico.media,
      sd: patologico.sd,
      unidad: patologico.unidad,
      valores: generarValores(patologico.media, patologico.sd, patologico.patron),
    },
  ];
}

// Controles de calidad mock, agrupados por categoria. Cada uno trae sus
// niveles con la serie historica de resultados ya generada.
export const controles = [
  // Hematologia: un control OK (verde) y uno con advertencia (naranja)
  {
    id: "CTL-HEM-001",
    nombre: "Diagon-H Hemoglobina",
    lote: "HB0018",
    fabricante: "Diagon",
    matriz: "Sangre total",
    categoriaId: "hematologia",
    analitoId: "hemoglobina",
    fechaCalibracion: "18/05/2026",
    fechaCaducidad: "30/03/2027",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 3,
    responsable: "B. Olate",
    niveles: crearNiveles({
      normal: { media: 13.0, sd: 0.4, unidad: "g/dL", patron: PATRON_OK },
      patologico: { media: 8.0, sd: 0.3, unidad: "g/dL", patron: PATRON_OK },
    }),
  },
  {
    id: "CTL-HEM-002",
    nombre: "Diagon-H Hematocrito",
    lote: "HT0022",
    fabricante: "Diagon",
    matriz: "Sangre total",
    categoriaId: "hematologia",
    analitoId: "hematocrito",
    fechaCalibracion: "18/05/2026",
    fechaCaducidad: "30/03/2027",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 3,
    responsable: "B. Olate",
    niveles: crearNiveles({
      normal: { media: 42, sd: 1.2, unidad: "%", patron: PATRON_OK },
      patologico: { media: 25, sd: 1.0, unidad: "%", patron: PATRON_ADVERTENCIA_1_2S },
    }),
  },
  {
    id: "CTL-HEM-003",
    nombre: "Diagon-H Leucocitos",
    lote: "LK0031",
    fabricante: "Diagon",
    matriz: "Sangre total",
    categoriaId: "hematologia",
    analitoId: "leucocitos",
    fechaCalibracion: "02/06/2026",
    fechaCaducidad: "30/03/2027",
    estadoCalibracion: "Calibrado",
    estado: "Caducado",
    stock: 1,
    responsable: "B. Olate",
    niveles: crearNiveles({
      normal: { media: 7.5, sd: 0.5, unidad: "x10^3/uL", patron: PATRON_OK },
      patologico: { media: 2.0, sd: 0.3, unidad: "x10^3/uL", patron: PATRON_OK },
    }),
  },

  // Quimica: un control OK (verde) y uno rechazado por 1-3s (rojo)
  {
    id: "CTL-QUI-001",
    nombre: "BioRad Glucosa",
    lote: "GL0090",
    fabricante: "Bio-Rad",
    matriz: "Suero",
    categoriaId: "quimica",
    analitoId: "glucosa",
    fechaCalibracion: "10/06/2026",
    fechaCaducidad: "10/11/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 5,
    responsable: "F. Diaz",
    niveles: crearNiveles({
      normal: { media: 100, sd: 4, unidad: "mg/dL", patron: PATRON_OK },
      patologico: { media: 250, sd: 8, unidad: "mg/dL", patron: PATRON_RECHAZO_1_3S },
    }),
  },
  {
    id: "CTL-QUI-002",
    nombre: "BioRad Colesterol",
    lote: "CO0044",
    fabricante: "Bio-Rad",
    matriz: "Suero",
    categoriaId: "quimica",
    analitoId: "colesterol",
    fechaCalibracion: "10/06/2026",
    fechaCaducidad: "10/11/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 5,
    responsable: "F. Diaz",
    niveles: crearNiveles({
      normal: { media: 180, sd: 6, unidad: "mg/dL", patron: PATRON_OK },
      patologico: { media: 280, sd: 9, unidad: "mg/dL", patron: PATRON_OK },
    }),
  },

  // Hormonas: un control rechazado por 2-2s (rojo), para mostrar otra regla distinta
  {
    id: "CTL-HOR-001",
    nombre: "Diagon-D TSH",
    lote: "TS0012",
    fabricante: "Diagon",
    matriz: "Suero",
    categoriaId: "hormonas",
    analitoId: "tsh",
    fechaCalibracion: "01/06/2026",
    fechaCaducidad: "10/11/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 2,
    responsable: "F. Diaz",
    niveles: crearNiveles({
      normal: { media: 2.5, sd: 0.2, unidad: "uUI/mL", patron: PATRON_RECHAZO_2_2S },
      patologico: { media: 12, sd: 0.6, unidad: "uUI/mL", patron: PATRON_OK },
    }),
  },

  // El resto de las categorias arrancan con un solo control OK, para que la
  // pantalla no quede vacia al navegar ahi.
  {
    id: "CTL-MIC-001",
    nombre: "Control Microbiologia",
    lote: "MB0007",
    fabricante: "Liofilchem",
    matriz: "Suspension bacteriana",
    categoriaId: "microbiologia",
    analitoId: "recuento-colonias",
    fechaCalibracion: "05/06/2026",
    fechaCaducidad: "05/12/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 4,
    responsable: "M. Vera",
    niveles: crearNiveles({
      normal: { media: 150, sd: 10, unidad: "UFC/mL", patron: PATRON_OK },
      patologico: { media: 500, sd: 25, unidad: "UFC/mL", patron: PATRON_OK },
    }),
  },
  {
    id: "CTL-PAR-001",
    nombre: "Control Parasitologia",
    lote: "PR0003",
    fabricante: "Liofilchem",
    matriz: "Muestra fecal",
    categoriaId: "parasitologia",
    analitoId: "carga-parasitaria",
    fechaCalibracion: "05/06/2026",
    fechaCaducidad: "05/12/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 2,
    responsable: "M. Vera",
    niveles: crearNiveles({
      normal: { media: 5, sd: 0.8, unidad: "parasitos/campo", patron: PATRON_OK },
      patologico: { media: 20, sd: 1.5, unidad: "parasitos/campo", patron: PATRON_OK },
    }),
  },
  {
    id: "CTL-BIO-001",
    nombre: "Control Biologia Molecular",
    lote: "BM0015",
    fabricante: "Roche",
    matriz: "Plasma",
    categoriaId: "biologia-molecular",
    analitoId: "carga-viral",
    fechaCalibracion: "12/06/2026",
    fechaCaducidad: "12/12/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 3,
    responsable: "R. Soto",
    niveles: crearNiveles({
      normal: { media: 1000, sd: 60, unidad: "copias/mL", patron: PATRON_OK },
      patologico: { media: 50000, sd: 2500, unidad: "copias/mL", patron: PATRON_OK },
    }),
  },
  {
    id: "CTL-BAN-001",
    nombre: "Control Banco de Sangre",
    lote: "BS0009",
    fabricante: "Bio-Rad",
    matriz: "Sangre total",
    categoriaId: "banco-de-sangre",
    analitoId: "hemoglobina-donante",
    fechaCalibracion: "12/06/2026",
    fechaCaducidad: "12/12/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 6,
    responsable: "R. Soto",
    niveles: crearNiveles({
      normal: { media: 14, sd: 0.5, unidad: "g/dL", patron: PATRON_OK },
      patologico: { media: 9, sd: 0.4, unidad: "g/dL", patron: PATRON_OK },
    }),
  },
  {
    id: "CTL-SER-001",
    nombre: "Control Serologia",
    lote: "SE0021",
    fabricante: "Abbott",
    matriz: "Suero",
    categoriaId: "serologia",
    analitoId: "indice-reactividad",
    fechaCalibracion: "15/06/2026",
    fechaCaducidad: "15/12/2026",
    estadoCalibracion: "Calibrado",
    estado: "Activo",
    stock: 4,
    responsable: "M. Vera",
    niveles: crearNiveles({
      normal: { media: 0.5, sd: 0.05, unidad: "S/CO", patron: PATRON_OK },
      patologico: { media: 3.0, sd: 0.15, unidad: "S/CO", patron: PATRON_OK },
    }),
  },
];

// Helpers de lectura, usados por las paginas para no repetir los mismos
// .find()/.filter() en cada componente.

export function obtenerCategoriaPorId(categoriaId) {
  return categorias.find((categoria) => categoria.id === categoriaId);
}

export function obtenerAnalitosPorCategoria(categoriaId) {
  return analitos.filter((analito) => analito.categoriaId === categoriaId);
}

export function obtenerAnalitoPorId(analitoId) {
  return analitos.find((analito) => analito.id === analitoId);
}

export function obtenerControlesPorCategoria(categoriaId) {
  return controles.filter((control) => control.categoriaId === categoriaId);
}

export function obtenerControlPorId(controlId) {
  return controles.find((control) => control.id === controlId);
}

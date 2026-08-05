// Motor de reglas de Westgard.
//
// Evalua una serie de resultados de control frente a la media y la
// desviacion estandar (SD) del nivel, y determina si el control queda:
//   - "ok"          -> dentro de parametros (verde)
//   - "advertencia" -> regla 1-2s disparada, hay que inspeccionar (naranja)
//   - "rechazado"   -> alguna regla de rechazo disparada (rojo)
//
// Reglas implementadas: 1-2s (advertencia), 1-3s, 2-2s, R-4s, 4-1s y 10x
// (rechazo). 1-3s y R-4s detectan error aleatorio; 2-2s, 4-1s y 10x detectan
// error sistematico. Referencia: J.O. Westgard, "Multirule QC Procedures"
// https://westgard.com/westgard-rules.html

export const ESTADOS = {
  OK: "ok",
  ADVERTENCIA: "advertencia",
  RECHAZADO: "rechazado",
};

// Pasa cada resultado crudo a su puntaje z: cuantas SD se aleja de la media.
function calcularZScores(valores, media, sd) {
  return valores.map((valor) => (valor - media) / sd);
}

// Evalua la serie de UN nivel (ej. "Normal" de un control) contra las
// reglas de un solo control. Devuelve el estado y que reglas se dispararon.
export function evaluateSeries(valores, media, sd) {
  if (!valores || valores.length === 0 || !sd) {
    return { estado: ESTADOS.OK, reglas: [] };
  }

  const zScores = calcularZScores(valores, media, sd);
  const ultimo = zScores[zScores.length - 1];
  const reglasDeRechazo = [];

  // 1-3s: un solo punto fuera de +/-3 SD -> rechazo por error aleatorio.
  if (Math.abs(ultimo) > 3) {
    reglasDeRechazo.push("1-3s");
  }

  // 2-2s: los ultimos 2 puntos superan +/-2 SD del mismo lado -> rechazo
  // por error sistematico.
  if (zScores.length >= 2) {
    const penultimo = zScores[zScores.length - 2];
    const mismoLado = Math.sign(penultimo) === Math.sign(ultimo) && Math.sign(ultimo) !== 0;
    if (mismoLado && Math.abs(penultimo) > 2 && Math.abs(ultimo) > 2) {
      reglasDeRechazo.push("2-2s");
    }
  }

  // 4-1s: los ultimos 4 puntos superan +/-1 SD del mismo lado -> rechazo
  // por error sistematico.
  if (zScores.length >= 4) {
    const ultimosCuatro = zScores.slice(-4);
    const lado = Math.sign(ultimosCuatro[0]);
    const mismoLado = lado !== 0 && ultimosCuatro.every((z) => Math.sign(z) === lado && Math.abs(z) > 1);
    if (mismoLado) {
      reglasDeRechazo.push("4-1s");
    }
  }

  // 10x: los ultimos 10 puntos caen del mismo lado de la media -> rechazo
  // por error sistematico (aunque ninguno supere 2 SD individualmente).
  if (zScores.length >= 10) {
    const ultimosDiez = zScores.slice(-10);
    const lado = Math.sign(ultimosDiez[0]);
    const mismoLado = lado !== 0 && ultimosDiez.every((z) => Math.sign(z) === lado);
    if (mismoLado) {
      reglasDeRechazo.push("10x");
    }
  }

  if (reglasDeRechazo.length > 0) {
    return { estado: ESTADOS.RECHAZADO, reglas: reglasDeRechazo };
  }

  // 1-2s: un solo punto fuera de +/-2 SD -> advertencia, no rechaza por si sola,
  // solo dispara la revision del resto de las reglas.
  if (Math.abs(ultimo) > 2) {
    return { estado: ESTADOS.ADVERTENCIA, reglas: ["1-2s"] };
  }

  return { estado: ESTADOS.OK, reglas: [] };
}

// R-4s: compara la misma corrida (mismo indice) entre dos niveles del
// control. Si la diferencia entre sus puntajes z supera 4 SD -> rechazo
// por error aleatorio entre niveles.
function evaluarRangoEntreNiveles(nivelA, nivelB) {
  const zA = calcularZScores(nivelA.valores, nivelA.media, nivelA.sd);
  const zB = calcularZScores(nivelB.valores, nivelB.media, nivelB.sd);
  const cantidadPuntos = Math.min(zA.length, zB.length);

  for (let i = 0; i < cantidadPuntos; i += 1) {
    if (Math.abs(zA[i] - zB[i]) > 4) {
      return true;
    }
  }
  return false;
}

// Evalua un control completo (todos sus niveles) y devuelve el peor estado
// encontrado: rechazado > advertencia > ok, junto con el detalle por nivel
// para poder explicar en pantalla por que quedo en naranja o rojo.
export function evaluateControl(niveles) {
  const detallePorNivel = niveles.map((nivel) => ({
    nivelId: nivel.id,
    nombre: nivel.nombre,
    ...evaluateSeries(nivel.valores, nivel.media, nivel.sd),
  }));

  let reglasDisparadas = detallePorNivel.flatMap((detalle) => detalle.reglas);

  const seDisparoRango = niveles.length >= 2 && evaluarRangoEntreNiveles(niveles[0], niveles[1]);
  if (seDisparoRango) {
    reglasDisparadas = [...reglasDisparadas, "R-4s"];
  }

  let estado = ESTADOS.OK;
  const hayRechazo = seDisparoRango || detallePorNivel.some((detalle) => detalle.estado === ESTADOS.RECHAZADO);
  const hayAdvertencia = detallePorNivel.some((detalle) => detalle.estado === ESTADOS.ADVERTENCIA);

  if (hayRechazo) {
    estado = ESTADOS.RECHAZADO;
  } else if (hayAdvertencia) {
    estado = ESTADOS.ADVERTENCIA;
  }

  return { estado, reglas: reglasDisparadas, detallePorNivel };
}

// Clasificacion de "Validado" para el ultimo valor de un nivel puntual (no
// la serie completa): el badge de color que se muestra en la pantalla
// Registro QC (Analisis QC) para decidir, de un vistazo, si ese resultado
// necesita revision. Distinta de evaluateControl/evaluateSeries de arriba,
// que miran la serie historica completa contra las reglas multi-punto de
// Westgard: aca se clasifica un solo punto por su puntaje z, que es el
// criterio que pidio el laboratorio para esta columna.
export const NIVELES_VALIDACION = {
  VALIDADO: "validado",
  REVISAR: "revisar",
  RECHAZADO: "rechazado",
};

export function clasificarValidacion(valor, nivel) {
  if (valor == null || Number.isNaN(valor) || !nivel?.sd) {
    return { clasificacion: NIVELES_VALIDACION.VALIDADO, z: 0 };
  }

  const z = (valor - nivel.media) / nivel.sd;
  const zAbsoluto = Math.abs(z);

  if (zAbsoluto > 3) {
    return { clasificacion: NIVELES_VALIDACION.RECHAZADO, z };
  }
  if (zAbsoluto > 2) {
    return { clasificacion: NIVELES_VALIDACION.REVISAR, z };
  }
  return { clasificacion: NIVELES_VALIDACION.VALIDADO, z };
}

// Sesgo (bias, %): que tan lejos esta un valor de la media del nivel,
// como porcentaje de esa media. Se muestra junto a DE y CV en "Parametros
// QC" (los tres indicadores clasicos de control de calidad tipo
// Levey-Jennings).
export function calcularSesgo(valor, nivel) {
  if (valor == null || Number.isNaN(valor) || !nivel?.media) {
    return 0;
  }
  return ((valor - nivel.media) / nivel.media) * 100;
}

// Comentario sugerido para la columna "Comentario" de Registro QC, segun la
// clasificacion de arriba. Es un punto de partida editable, no un texto
// fijo: el tecnologo lo puede complementar antes de registrar.
export const COMENTARIOS_SUGERIDOS = {
  [NIVELES_VALIDACION.VALIDADO]: "No aplica.",
  [NIVELES_VALIDACION.REVISAR]: "Acción riesgosa, se recomienda repetir control.",
  [NIVELES_VALIDACION.RECHAZADO]: "Resultado fuera de control, no informar. Repetir control y notificar al supervisor.",
};

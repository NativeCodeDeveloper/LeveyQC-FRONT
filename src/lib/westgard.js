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

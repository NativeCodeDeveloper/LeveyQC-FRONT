"use client";

// Carta Levey-Jennings combinada: superpone los 2 o 3 niveles de un mismo
// control (ej. Normal + Patologico) en un solo grafico, para comparar el
// mismo dia/corrida entre niveles de un vistazo. Complementa a
// GraficoLeveyJennings (que sigue siendo el grafico de UN nivel, el formato
// clasico), no lo reemplaza.
//
// Como los niveles suelen tener medias y unidades distintas (ej. Hemoglobina
// Normal ~13 g/dL vs Patologico ~8 g/dL), no se pueden superponer en valores
// crudos. La practica estandar de Westgard QC para combinar niveles es
// normalizar cada resultado a su puntaje z / SDI (Standard Deviation Index):
// (valor - media) / DE, y graficar eso en un eje compartido de +/-3 DE.
// Referencia: "FAQ's about Multirule QC" (westgard.com/lessons/westgard-rules
// /westgard-rules/quest4.html) - "calculate the difference of each control
// observation from its expected mean, divide by the expected standard
// deviation to give a z-score or SDI, and then plot the SDI value on a
// control chart whose central mean is zero and whose control limits are
// drawn as +/-1, +/-2 and +/-3".

import { useState } from "react";
import {
  colorAlerta,
  colorControl,
  colorMedia,
  obtenerEstadoDelPunto,
  obtenerFechaCompleta,
  obtenerFechaCorta,
  paletaSeriesPorNivel,
} from "./graficoLeveyJenningsUtils";

const anchoGrafico = 1120;
const altoGrafico = 480;
const margenGrafico = { superior: 46, derecho: 40, inferior: 76, izquierdo: 74 };
const anchoAreaDatos = anchoGrafico - margenGrafico.izquierdo - margenGrafico.derecho;
const altoAreaDatos = altoGrafico - margenGrafico.superior - margenGrafico.inferior;
const nivelesDesviacion = [3, 2, 1, 0, -1, -2, -3];
const limiteVisualZ = 3.5;
const cantidadMaximaDeCorridas = 20;

export default function GraficoLeveyJenningsCombinado({ niveles, nombreAnalito, nombreControl, loteControl }) {
  // Series: una por nivel, con su puntaje z ya calculado y acotada a las
  // ultimas N corridas. Se alinean por la DERECHA (la corrida mas reciente
  // de cada nivel comparte columna), asi si un nivel tiene menos registros
  // que otro igual queda comparable "el mismo dia" en los puntos que si
  // coinciden.
  const series = niveles.map((nivel, indiceNivel) => {
    const desviacionSegura = nivel.sd || 1;
    const valoresVisibles = nivel.valores.slice(-cantidadMaximaDeCorridas);
    const registrosVisibles = nivel.registros.slice(-cantidadMaximaDeCorridas);
    const indiceInicial = Math.max(0, nivel.valores.length - valoresVisibles.length);
    return {
      nivelId: nivel.nivelId,
      nombreNivel: nivel.nombreNivel,
      unidad: nivel.unidad,
      color: paletaSeriesPorNivel[indiceNivel % paletaSeriesPorNivel.length],
      puntos: valoresVisibles.map((valor, indice) => ({
        valor,
        puntajeZ: (valor - nivel.media) / desviacionSegura,
        numeroCorrida: indiceInicial + indice + 1,
        registro: registrosVisibles[indice],
      })),
    };
  });

  const cantidadDeColumnas = Math.max(1, ...series.map((serie) => serie.puntos.length));

  // Columna cuyo objetivo es alinear a la derecha: el ultimo punto de cada
  // serie cae siempre en la ultima columna, sin importar si esa serie tiene
  // menos corridas que las demas.
  function columnaDelPunto(serie, indiceEnSerie) {
    return cantidadDeColumnas - serie.puntos.length + indiceEnSerie;
  }

  const [columnaSeleccionada, establecerColumnaSeleccionada] = useState(
    Math.max(0, Math.floor(cantidadDeColumnas / 2) - 1)
  );

  function convertirZEnY(z) {
    const proporcion = (limiteVisualZ - z) / (limiteVisualZ * 2);
    return margenGrafico.superior + proporcion * altoAreaDatos;
  }

  function convertirColumnaEnX(columna) {
    if (cantidadDeColumnas <= 1) return margenGrafico.izquierdo + anchoAreaDatos / 2;
    return margenGrafico.izquierdo + (columna / (cantidadDeColumnas - 1)) * anchoAreaDatos;
  }

  const baseDelGrafico = margenGrafico.superior + altoAreaDatos;

  const seriesGraficadas = series.map((serie) => {
    const puntosConPosicion = serie.puntos.map((punto, indice) => {
      const columna = columnaDelPunto(serie, indice);
      return { ...punto, columna, x: convertirColumnaEnX(columna), y: convertirZEnY(punto.puntajeZ) };
    });
    return { ...serie, puntos: puntosConPosicion };
  });

  // Fecha comun de la columna seleccionada: se toma del primer nivel que
  // tenga un registro en esa columna (en teoria todos comparten fecha, por
  // eso tiene sentido combinarlos).
  const puntoDeFechaSeleccionada = seriesGraficadas
    .flatMap((serie) => serie.puntos)
    .find((punto) => punto.columna === columnaSeleccionada);

  const anchoTarjeta = 300;
  const altoTarjeta = 64 + seriesGraficadas.length * 46;
  const xColumnaSeleccionada = convertirColumnaEnX(columnaSeleccionada);
  const posicionTarjetaX = Math.min(
    margenGrafico.izquierdo + anchoAreaDatos - anchoTarjeta - 8,
    Math.max(margenGrafico.izquierdo + 8, xColumnaSeleccionada + 16)
  );
  const posicionTarjetaY = margenGrafico.superior + 10;

  return (
    <section className="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_18px_50px_rgba(31,37,48,0.075)]">
      <header className="flex flex-wrap items-start justify-between gap-5 px-5 pb-3 pt-5 sm:px-7 sm:pt-7">
        <div>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Seguimiento analítico · Niveles combinados</p>
          <h3 className="m-0 mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">Carta Levey-Jennings (SDI)</h3>
          <p className="m-0 mt-1.5 text-[12.5px] text-ink-muted">
            {nombreAnalito} · Control {nombreControl} · Lote {loteControl}
          </p>
          <p className="m-0 mt-1 text-[10.5px] text-ink-faint">
            Cada nivel normalizado a puntaje z (DE respecto de su propia media) para poder compararlos en un mismo eje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink-muted">
          {seriesGraficadas.map((serie) => (
            <span key={serie.nivelId} className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full border-[3px] bg-white" style={{ borderColor: serie.color }} aria-hidden="true" />
              {serie.nombreNivel} ({serie.unidad})
            </span>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto px-3 pb-3 sm:px-6">
        <svg
          viewBox={`0 0 ${anchoGrafico} ${altoGrafico}`}
          className="w-full min-w-[900px]"
          role="img"
          aria-label={`Carta Levey-Jennings combinada de ${nombreAnalito}, niveles ${seriesGraficadas.map((serie) => serie.nombreNivel).join(", ")}`}
        >
          <rect x="0" y="0" width={anchoGrafico} height={altoGrafico} fill="#ffffff" />

          {nivelesDesviacion.map((nivelDesviacion) => {
            const posicionY = convertirZEnY(nivelDesviacion);
            const esMedia = nivelDesviacion === 0;
            const esLimiteControl = Math.abs(nivelDesviacion) === 3;
            const esLimiteAlerta = Math.abs(nivelDesviacion) === 2;
            const colorLinea = esLimiteControl ? colorControl : esLimiteAlerta ? colorAlerta : esMedia ? colorMedia : "#d7dbe0";

            return (
              <g key={nivelDesviacion}>
                <line
                  x1={margenGrafico.izquierdo}
                  x2={margenGrafico.izquierdo + anchoAreaDatos}
                  y1={posicionY}
                  y2={posicionY}
                  stroke={colorLinea}
                  strokeWidth={esMedia ? "1.8" : esLimiteControl || esLimiteAlerta ? "1.25" : "1"}
                  strokeDasharray={esMedia ? "6 5" : esLimiteControl || esLimiteAlerta ? "8 6" : "4 7"}
                  opacity={esMedia || esLimiteControl || esLimiteAlerta ? "0.9" : "0.75"}
                />
                <text x={margenGrafico.izquierdo - 13} y={posicionY + 4} textAnchor="end" fill={colorLinea} fontSize="11.5" fontWeight={esMedia ? "700" : "500"}>
                  {esMedia ? "Media" : `${nivelDesviacion > 0 ? "+" : ""}${nivelDesviacion} DE`}
                </text>
              </g>
            );
          })}

          <line
            x1={margenGrafico.izquierdo}
            x2={margenGrafico.izquierdo + anchoAreaDatos}
            y1={baseDelGrafico}
            y2={baseDelGrafico}
            stroke="#cfd3d8"
            strokeWidth="1"
          />

          {columnaSeleccionada >= 0 ? (
            <line
              x1={xColumnaSeleccionada}
              x2={xColumnaSeleccionada}
              y1={margenGrafico.superior}
              y2={baseDelGrafico}
              stroke="#c7cbd1"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
          ) : null}

          {seriesGraficadas.map((serie) => (
            <g key={serie.nivelId}>
              {serie.puntos.length > 1 ? (
                <polyline
                  points={serie.puntos.map((punto) => `${punto.x},${punto.y}`).join(" ")}
                  fill="none"
                  stroke={serie.color}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null}

              {serie.puntos.map((punto) => {
                const estadoDelPunto = obtenerEstadoDelPunto(punto.puntajeZ, serie.color);
                const estaSeleccionado = punto.columna === columnaSeleccionada;
                return (
                  <g
                    key={`${serie.nivelId}-${punto.numeroCorrida}`}
                    tabIndex="0"
                    role="button"
                    aria-label={`${serie.nombreNivel}, corrida ${punto.numeroCorrida}: ${punto.valor} ${serie.unidad}, ${estadoDelPunto.texto}`}
                    onMouseEnter={() => establecerColumnaSeleccionada(punto.columna)}
                    onFocus={() => establecerColumnaSeleccionada(punto.columna)}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={punto.x} cy={punto.y} r="12" fill={estadoDelPunto.color} opacity={estaSeleccionado ? "0.14" : "0"} />
                    <circle
                      cx={punto.x}
                      cy={punto.y}
                      r={estaSeleccionado ? "6.5" : "5.2"}
                      fill="#ffffff"
                      stroke={estadoDelPunto.color}
                      strokeWidth="3"
                    />
                  </g>
                );
              })}
            </g>
          ))}

          {Array.from({ length: cantidadDeColumnas }, (valorNulo, columna) => {
            const puntoDeReferencia = seriesGraficadas.flatMap((serie) => serie.puntos).find((punto) => punto.columna === columna);
            if (!puntoDeReferencia) return null;
            const x = convertirColumnaEnX(columna);
            return (
              <g key={`etiqueta-columna-${columna}`}>
                <text x={x} y={baseDelGrafico + 23} textAnchor="middle" fill="#747a82" fontSize="10.5" fontWeight={columna === columnaSeleccionada ? "700" : "500"}>
                  {obtenerFechaCorta(puntoDeReferencia.registro?.fechaIngreso)}
                </text>
                <text x={x} y={baseDelGrafico + 41} textAnchor="middle" fill="#a1a1a6" fontSize="9.5" fontWeight="500">
                  #{puntoDeReferencia.numeroCorrida}
                </text>
              </g>
            );
          })}

          {puntoDeFechaSeleccionada ? (
            <g pointerEvents="none">
              <rect x={posicionTarjetaX} y={posicionTarjetaY} width={anchoTarjeta} height={altoTarjeta} rx="12" fill="#ffffff" stroke="#dfe2e6" />
              <text x={posicionTarjetaX + 16} y={posicionTarjetaY + 24} fill="#1d1d1f" fontSize="12" fontWeight="700">
                {obtenerFechaCompleta(puntoDeFechaSeleccionada.registro?.fechaIngreso, puntoDeFechaSeleccionada.registro?.horaUltimaModificacion)}
              </text>
              {seriesGraficadas.map((serie, indiceSerie) => {
                const punto = serie.puntos.find((puntoDeLaSerie) => puntoDeLaSerie.columna === columnaSeleccionada);
                const y = posicionTarjetaY + 50 + indiceSerie * 46;
                if (!punto) {
                  return (
                    <text key={serie.nivelId} x={posicionTarjetaX + 16} y={y} fill="#a1a1a6" fontSize="11">
                      {serie.nombreNivel}: sin corrida en esta columna
                    </text>
                  );
                }
                const estadoDelPunto = obtenerEstadoDelPunto(punto.puntajeZ, serie.color);
                return (
                  <g key={serie.nivelId}>
                    <circle cx={posicionTarjetaX + 21} cy={y - 4} r="4" fill={serie.color} />
                    <text x={posicionTarjetaX + 35} y={y} fill="#1d1d1f" fontSize="11.5" fontWeight="700">
                      {serie.nombreNivel}: {punto.valor} {serie.unidad}
                    </text>
                    <text x={posicionTarjetaX + 35} y={y + 16} fill={estadoDelPunto.color} fontSize="10.5" fontWeight="600">
                      {punto.puntajeZ > 0 ? "+" : ""}{punto.puntajeZ.toFixed(2)} DE · {estadoDelPunto.texto}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : null}

          <text x={margenGrafico.izquierdo + anchoAreaDatos / 2} y={altoGrafico - 10} textAnchor="middle" fill="#6e6e73" fontSize="11.5" fontWeight="600">
            Número de corrida (mismo día entre niveles)
          </text>
          <text
            x="18"
            y={margenGrafico.superior + altoAreaDatos / 2}
            textAnchor="middle"
            fill="#6e6e73"
            fontSize="11.5"
            fontWeight="600"
            transform={`rotate(-90 18 ${margenGrafico.superior + altoAreaDatos / 2})`}
          >
            Puntaje z (DE)
          </text>
        </svg>
      </div>

      <footer className="grid border-t border-line bg-white sm:grid-cols-3">
        <NotaTecnica titulo="Zona esperada" detalle="Resultados dentro de ±2 DE, cualquier nivel" color="bg-[#157a70]" />
        <NotaTecnica titulo="Límite de alerta" detalle="Resultados sobre ±2 DE" color="bg-status-warn" />
        <NotaTecnica titulo="Límite de control" detalle="Resultados sobre ±3 DE" color="bg-status-alert" />
      </footer>
    </section>
  );
}

function NotaTecnica({ titulo, detalle, color }) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <span className={`size-2.5 shrink-0 rounded-full ${color}`} aria-hidden="true" />
      <div>
        <p className="m-0 text-[11.5px] font-semibold text-ink">{titulo}</p>
        <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">{detalle}</p>
      </div>
    </div>
  );
}

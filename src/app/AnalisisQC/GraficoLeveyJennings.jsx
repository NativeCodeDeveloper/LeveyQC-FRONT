"use client";

// Carta Levey-Jennings construida con SVG nativo. Su objetivo es representar
// cada corrida respecto de la media y los limites de ±1, ±2 y ±3 DE con una
// estetica blanca, limpia e interactiva, sin dependencias de graficos.

import { useState } from "react";

const anchoGrafico = 1120;
const altoGrafico = 520;
const margenGrafico = { superior: 46, derecho: 92, inferior: 76, izquierdo: 98 };
const anchoAreaDatos = anchoGrafico - margenGrafico.izquierdo - margenGrafico.derecho;
const altoAreaDatos = altoGrafico - margenGrafico.superior - margenGrafico.inferior;
const nivelesDesviacion = [3, 2, 1, 0, -1, -2, -3];

const colorResultado = "#157a70";
const colorMedia = "#c34f71";
const colorAlerta = "#a6690a";
const colorControl = "#b3392f";
const nombresDeMeses = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export default function GraficoLeveyJennings({
  valores,
  registros = [],
  media,
  desviacionEstandar,
  unidad,
  nombreAnalito,
  nombreNivel,
  nombreControl,
  loteControl,
}) {
  const desviacionSegura = desviacionEstandar || 1;
  const valoresVisibles = valores.slice(-20);
  const registrosVisibles = registros.slice(-20);
  const indiceInicial = Math.max(0, valores.length - valoresVisibles.length);
  const limiteSuperiorVisual = media + desviacionSegura * 3.5;
  const limiteInferiorVisual = media - desviacionSegura * 3.5;

  // Punto seleccionado cuyo objetivo es mostrar una guia y el detalle de la
  // corrida al pasar el cursor o navegar con teclado.
  const [indicePuntoSeleccionado, establecerIndicePuntoSeleccionado] = useState(
    Math.max(0, Math.floor(valoresVisibles.length / 2) - 1)
  );

  function convertirValorEnY(valor) {
    const proporcion = (limiteSuperiorVisual - valor) / (limiteSuperiorVisual - limiteInferiorVisual);
    return margenGrafico.superior + proporcion * altoAreaDatos;
  }

  function convertirIndiceEnX(indice) {
    if (valoresVisibles.length <= 1) return margenGrafico.izquierdo + anchoAreaDatos / 2;
    return margenGrafico.izquierdo + (indice / (valoresVisibles.length - 1)) * anchoAreaDatos;
  }

  function obtenerEstadoDelPunto(puntajeZ) {
    if (Math.abs(puntajeZ) > 3) return { texto: "Fuera de control", color: colorControl };
    if (Math.abs(puntajeZ) > 2) return { texto: "Alerta", color: colorAlerta };
    return { texto: "En control", color: colorResultado };
  }

  function obtenerFechaCorta(fecha) {
    if (!fecha) return "Sin fecha";
    const partesDeFecha = fecha.split(/[-/]/);
    return partesDeFecha.length >= 2 ? `${partesDeFecha[0]}/${partesDeFecha[1]}` : fecha;
  }

  function obtenerFechaCompleta(fecha, hora) {
    if (!fecha) return `Sin fecha · ${hora || "Sin hora"}`;
    const partesDeFecha = fecha.split(/[-/]/);
    if (partesDeFecha.length < 3) return `${fecha} · ${hora || "Sin hora"}`;

    const [dia, mes, anio] = partesDeFecha;
    const nombreDelMes = nombresDeMeses[Number(mes) - 1] ?? mes;
    return `${dia} de ${nombreDelMes} de ${anio} · ${hora || "Sin hora"}`;
  }

  const puntosGraficados = valoresVisibles.map((valor, indice) => ({
    valor,
    puntajeZ: (valor - media) / desviacionSegura,
    x: convertirIndiceEnX(indice),
    y: convertirValorEnY(valor),
    numeroCorrida: indiceInicial + indice + 1,
    registro: registrosVisibles[indice],
  }));

  const puntosDeLinea = puntosGraficados.map((punto) => `${punto.x},${punto.y}`).join(" ");
  const baseDelGrafico = margenGrafico.superior + altoAreaDatos;
  const puntosDelArea = puntosGraficados.length > 0
    ? `${puntosGraficados[0].x},${baseDelGrafico} ${puntosDeLinea} ${puntosGraficados[puntosGraficados.length - 1].x},${baseDelGrafico}`
    : "";
  const puntoSeleccionado = puntosGraficados[indicePuntoSeleccionado] ?? puntosGraficados[0];
  const estadoPuntoSeleccionado = puntoSeleccionado ? obtenerEstadoDelPunto(puntoSeleccionado.puntajeZ) : null;
  const ultimoPunto = puntosGraficados[puntosGraficados.length - 1];
  const estadoUltimoPunto = ultimoPunto ? obtenerEstadoDelPunto(ultimoPunto.puntajeZ) : null;

  // Posicion acotada cuyo objetivo es mantener la tarjeta informativa dentro
  // del area visible incluso al seleccionar el primer o ultimo punto.
  const anchoTarjeta = 350;
  const altoTarjeta = 210;
  const posicionTarjetaX = puntoSeleccionado
    ? Math.min(
        margenGrafico.izquierdo + anchoAreaDatos - anchoTarjeta - 12,
        Math.max(margenGrafico.izquierdo + 12, puntoSeleccionado.x + 18)
      )
    : 0;
  const posicionTarjetaY = puntoSeleccionado
    ? Math.min(baseDelGrafico - altoTarjeta - 12, Math.max(margenGrafico.superior + 12, puntoSeleccionado.y - 54))
    : 0;

  return (
    <section className="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_18px_50px_rgba(31,37,48,0.075)]">
      <header className="flex flex-wrap items-start justify-between gap-5 px-5 pb-3 pt-5 sm:px-7 sm:pt-7">
        <div>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Seguimiento analítico</p>
          <h3 className="m-0 mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">Carta Levey-Jennings</h3>
          <p className="m-0 mt-1.5 text-[12.5px] text-ink-muted">
            {nombreAnalito} · {nombreNivel} · Control {nombreControl} · Lote {loteControl}
          </p>
          <p className="m-0 mt-1 text-[10.5px] text-ink-faint">
            Seguimiento de las últimas {valoresVisibles.length} corridas registradas
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {ultimoPunto && estadoUltimoPunto ? (
            <div className="flex items-center gap-4 rounded-lg border border-line bg-[#fbfcfc] px-3.5 py-2.5">
              <div>
                <p className="m-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Último resultado</p>
                <p className="m-0 mt-0.5 text-[13px] font-semibold tabular-nums text-ink">{ultimoPunto.valor} {unidad}</p>
                <p className="m-0 mt-0.5 text-[9.5px] text-ink-muted">
                  {obtenerFechaCompleta(ultimoPunto.registro?.fechaIngreso, ultimoPunto.registro?.horaUltimaModificacion)}
                </p>
                <p className="m-0 mt-0.5 text-[9.5px] text-ink-muted">
                  {ultimoPunto.registro?.nombreResponsable ?? "Sin responsable"} · @{ultimoPunto.registro?.usuarioResponsable ?? "sin-usuario"}
                </p>
              </div>
              <span className="h-7 w-px bg-line" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold" style={{ color: estadoUltimoPunto.color }}>
                <span className="size-2 rounded-full" style={{ backgroundColor: estadoUltimoPunto.color }} aria-hidden="true" />
                {estadoUltimoPunto.texto}
              </span>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full border-[3px] border-[#157a70] bg-white" aria-hidden="true" />
              Resultado
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full border-[3px] border-[#c34f71] bg-white" aria-hidden="true" />
              Media
            </span>
            <span className="text-lg font-semibold leading-none tracking-[0.12em] text-ink-faint" aria-hidden="true">•••</span>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto px-3 pb-3 sm:px-6">
        <svg
          viewBox={`0 0 ${anchoGrafico} ${altoGrafico}`}
          className="w-full min-w-[900px]"
          role="img"
          aria-label={`Carta Levey-Jennings de ${nombreAnalito}, nivel ${nombreNivel}`}
        >
          <defs>
            <linearGradient id="rellenoAreaLevey" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorResultado} stopOpacity="0.18" />
              <stop offset="70%" stopColor={colorResultado} stopOpacity="0.07" />
              <stop offset="100%" stopColor={colorResultado} stopOpacity="0.015" />
            </linearGradient>
            <filter id="sombraTarjetaLevey" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#1f2530" floodOpacity="0.14" />
            </filter>
          </defs>

          <rect x="0" y="0" width={anchoGrafico} height={altoGrafico} fill="#ffffff" />

          {nivelesDesviacion.map((nivelDesviacion) => {
            const valorLinea = media + nivelDesviacion * desviacionSegura;
            const posicionY = convertirValorEnY(valorLinea);
            const esMedia = nivelDesviacion === 0;
            const esLimiteControl = Math.abs(nivelDesviacion) === 3;
            const esLimiteAlerta = Math.abs(nivelDesviacion) === 2;
            const colorLinea = esLimiteControl
              ? colorControl
              : esLimiteAlerta
                ? colorAlerta
                : esMedia
                  ? colorMedia
                  : "#d7dbe0";

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
                <text
                  x={margenGrafico.izquierdo - 13}
                  y={posicionY + 4}
                  textAnchor="end"
                  fill="#717780"
                  fontSize="11.5"
                  fontWeight={esMedia ? "700" : "500"}
                >
                  {valorLinea.toFixed(2)}
                </text>
                <text
                  x={margenGrafico.izquierdo + anchoAreaDatos + 14}
                  y={posicionY + 4}
                  fill={colorLinea}
                  fontSize="11.5"
                  fontWeight={esMedia || esLimiteControl || esLimiteAlerta ? "700" : "500"}
                >
                  {nivelDesviacion === 0 ? "Media" : `${nivelDesviacion > 0 ? "+" : ""}${nivelDesviacion} DE`}
                </text>
              </g>
            );
          })}

          {puntosDelArea ? <polygon points={puntosDelArea} fill="url(#rellenoAreaLevey)" /> : null}

          <line
            x1={margenGrafico.izquierdo}
            x2={margenGrafico.izquierdo + anchoAreaDatos}
            y1={baseDelGrafico}
            y2={baseDelGrafico}
            stroke="#cfd3d8"
            strokeWidth="1"
          />

          {puntosGraficados.length > 1 ? (
            <polyline
              points={puntosDeLinea}
              fill="none"
              stroke={colorResultado}
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}

          {puntoSeleccionado ? (
            <line
              x1={puntoSeleccionado.x}
              x2={puntoSeleccionado.x}
              y1={margenGrafico.superior}
              y2={baseDelGrafico}
              stroke={colorResultado}
              strokeWidth="1.5"
              opacity="0.65"
            />
          ) : null}

          {puntosGraficados.map((punto, indice) => {
            const estadoDelPunto = obtenerEstadoDelPunto(punto.puntajeZ);
            const estaSeleccionado = indice === indicePuntoSeleccionado;
            return (
              <g
                key={`punto-${punto.numeroCorrida}`}
                tabIndex="0"
                role="button"
                aria-label={`Corrida ${punto.numeroCorrida}: ${punto.valor} ${unidad}, realizada ${obtenerFechaCompleta(punto.registro?.fechaIngreso, punto.registro?.horaUltimaModificacion)} por ${punto.registro?.nombreResponsable ?? "responsable no informado"}, control ${nombreControl}, lote ${loteControl}`}
                onMouseEnter={() => establecerIndicePuntoSeleccionado(indice)}
                onFocus={() => establecerIndicePuntoSeleccionado(indice)}
                className="cursor-pointer outline-none"
              >
                <circle cx={punto.x} cy={punto.y} r="13" fill={estadoDelPunto.color} opacity={estaSeleccionado ? "0.14" : "0"} />
                <circle
                  cx={punto.x}
                  cy={punto.y}
                  r={estaSeleccionado ? "7" : "5.8"}
                  fill="#ffffff"
                  stroke={estadoDelPunto.color}
                  strokeWidth="3"
                />
                <text
                  x={punto.x}
                  y={baseDelGrafico + 23}
                  textAnchor="middle"
                  fill="#747a82"
                  fontSize="10.5"
                  fontWeight={estaSeleccionado ? "700" : "500"}
                >
                  {obtenerFechaCorta(punto.registro?.fechaIngreso)}
                </text>
                <text
                  x={punto.x}
                  y={baseDelGrafico + 41}
                  textAnchor="middle"
                  fill="#a1a1a6"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  #{punto.numeroCorrida}
                </text>
              </g>
            );
          })}

          {puntoSeleccionado && estadoPuntoSeleccionado ? (
            <g filter="url(#sombraTarjetaLevey)" pointerEvents="none">
              <rect
                x={posicionTarjetaX}
                y={posicionTarjetaY}
                width={anchoTarjeta}
                height={altoTarjeta}
                rx="12"
                fill="#ffffff"
                stroke="#dfe2e6"
              />
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 28} fill="#1d1d1f" fontSize="12.5" fontWeight="700">
                Corrida {puntoSeleccionado.numeroCorrida}
              </text>
              <rect x={posicionTarjetaX + 260} y={posicionTarjetaY + 13} width="74" height="24" rx="12" fill={estadoPuntoSeleccionado.color} opacity="0.11" />
              <text x={posicionTarjetaX + 297} y={posicionTarjetaY + 29} textAnchor="middle" fill={estadoPuntoSeleccionado.color} fontSize="9.5" fontWeight="700">
                {estadoPuntoSeleccionado.texto}
              </text>
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 58} fill="#8b9097" fontSize="11.5">
                Fecha y hora
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 58} fill="#1d1d1f" fontSize="11.5" fontWeight="700">
                {obtenerFechaCompleta(puntoSeleccionado.registro?.fechaIngreso, puntoSeleccionado.registro?.horaUltimaModificacion)}
              </text>
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 84} fill="#8b9097" fontSize="11.5">
                Resultado
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 84} fill="#1d1d1f" fontSize="11.5" fontWeight="700">
                {puntoSeleccionado.valor} {unidad}
              </text>
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 110} fill="#8b9097" fontSize="11.5">
                Desviación
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 110} fill="#1d1d1f" fontSize="11.5" fontWeight="700">
                {puntoSeleccionado.puntajeZ > 0 ? "+" : ""}{puntoSeleccionado.puntajeZ.toFixed(2)} DE
              </text>
              <line x1={posicionTarjetaX + 18} x2={posicionTarjetaX + 332} y1={posicionTarjetaY + 123} y2={posicionTarjetaY + 123} stroke="#eceef1" />
              <circle cx={posicionTarjetaX + 23} cy={posicionTarjetaY + 141} r="4" fill={colorResultado} />
              <text x={posicionTarjetaX + 35} y={posicionTarjetaY + 145} fill="#6e6e73" fontSize="11">
                Realizado por
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 145} fill="#1d1d1f" fontSize="11" fontWeight="700">
                {puntoSeleccionado.registro?.nombreResponsable ?? "Sin responsable"} · @{puntoSeleccionado.registro?.usuarioResponsable ?? "sin-usuario"}
              </text>
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 170} fill="#8b9097" fontSize="11">
                Control utilizado
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 170} fill="#1d1d1f" fontSize="11" fontWeight="700">
                {nombreControl || "Sin control"}
              </text>
              <text x={posicionTarjetaX + 18} y={posicionTarjetaY + 195} fill="#8b9097" fontSize="11">
                Lote utilizado
              </text>
              <text x={posicionTarjetaX + 112} y={posicionTarjetaY + 195} fill="#1d1d1f" fontSize="11" fontWeight="700">
                {loteControl || "Sin lote"}
              </text>
            </g>
          ) : null}

          <text
            x={margenGrafico.izquierdo + anchoAreaDatos / 2}
            y={altoGrafico - 10}
            textAnchor="middle"
            fill="#6e6e73"
            fontSize="11.5"
            fontWeight="600"
          >
            Número de corrida
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
            Resultado ({unidad})
          </text>
        </svg>
      </div>

      <footer className="grid border-t border-line bg-white sm:grid-cols-3">
        <NotaTecnica titulo="Zona esperada" detalle="Resultados dentro de ±2 DE" color="bg-[#157a70]" />
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

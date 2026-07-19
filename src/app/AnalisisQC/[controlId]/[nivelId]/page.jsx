"use client";

// Detalle de una combinacion control/nivel. Lee el control guardado en
// localStorage, reconstruye su trazabilidad y ofrece la carta Levey-Jennings.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { obtenerAnalitoPorId } from "@/lib/mockData";
import { useControlPorId } from "@/lib/useControlesStore";
import { ESTADOS, evaluateSeries as evaluarSerie } from "@/lib/westgard";
import GraficoLeveyJennings from "../../GraficoLeveyJennings";

// Textos y estilos cuyo objetivo es traducir el resultado tecnico de
// Westgard a un estado visual comprensible para el usuario.
const presentacionPorEstado = {
  [ESTADOS.OK]: { texto: "En control", clase: "bg-status-ok-soft text-status-ok", punto: "bg-status-ok" },
  [ESTADOS.ADVERTENCIA]: { texto: "Alerta", clase: "bg-status-warn-soft text-status-warn", punto: "bg-status-warn" },
  [ESTADOS.RECHAZADO]: { texto: "Fuera de control", clase: "bg-status-alert-soft text-status-alert", punto: "bg-status-alert" },
};

// Responsables ficticios cuyo objetivo es mostrar nombre completo y usuario
// en los registros semilla que todavia no poseen una auditoria real.
const usuariosDeMuestraPorResponsable = {
  "B. Olate": { nombre: "Beatriz Olate", usuario: "bolate" },
  "F. Diaz": { nombre: "Felipe Díaz", usuario: "fdiaz" },
  "M. Vera": { nombre: "María Vera", usuario: "mvera" },
  "R. Soto": { nombre: "Rodrigo Soto", usuario: "rsoto" },
};

function formatearFechaDeMuestra(indice, cantidadRegistros) {
  // Fecha temporal cuyo objetivo es dar contexto a los valores historicos
  // semilla que aun no poseen auditoria propia.
  const fechaDeMuestra = new Date(2026, 6, 19);
  fechaDeMuestra.setDate(fechaDeMuestra.getDate() - (cantidadRegistros - indice - 1));
  return fechaDeMuestra.toLocaleDateString("es-CL");
}

function DatoTrazabilidad({ etiqueta, valor, secundario }) {
  return (
    <div className="min-w-0 border-b border-line p-4 last:border-b-0 sm:border-r sm:[&:nth-child(4n)]:border-r-0">
      <p className="m-0 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{etiqueta}</p>
      <p className="m-0 mt-1.5 truncate text-[12.5px] font-semibold text-ink">{valor || "—"}</p>
      {secundario ? <p className="m-0 mt-0.5 truncate text-[10.5px] text-ink-muted">{secundario}</p> : null}
    </div>
  );
}

function TarjetaMetrica({ etiqueta, valor, unidad, detalle, tono = "neutro" }) {
  const clasesPorTono = {
    neutro: "border-line bg-white",
    correcto: "border-[#cde2d6] bg-[#f6faf8]",
    alerta: "border-[#ead9b8] bg-[#fdf9f1]",
    error: "border-[#ecc9c5] bg-[#fdf5f4]",
  };

  return (
    <div className={`rounded-xl border p-4 ${clasesPorTono[tono]}`}>
      <p className="m-0 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{etiqueta}</p>
      <p className="m-0 mt-2 text-[20px] font-semibold tracking-[-0.025em] tabular-nums text-ink">
        {valor} {unidad ? <span className="text-[10.5px] font-medium tracking-normal text-ink-muted">{unidad}</span> : null}
      </p>
      <p className="m-0 mt-1 text-[10.5px] text-ink-muted">{detalle}</p>
    </div>
  );
}

export default function PaginaDetalleControlAnalisis() {
  const { controlId: identificadorControl, nivelId: identificadorNivel } = useParams();
  const control = useControlPorId(identificadorControl);

  // Vista activa cuyo objetivo es alternar entre la auditoria tabular y la
  // carta de control sin navegar fuera del detalle.
  const [vistaActiva, establecerVistaActiva] = useState("detalle");

  const nivel = control?.niveles.find((nivelDelControl) => nivelDelControl.id === identificadorNivel);
  const analito = obtenerAnalitoPorId(control?.analitoId);

  // Historial cuyo objetivo es unir las corridas semilla con las auditorias
  // creadas al registrar nuevos resultados desde Analisis QC.
  const historialDelNivel = useMemo(() => {
    if (!control || !nivel) return [];

    const auditoriasDelNivel = new Map(
      (control.historialRegistros ?? [])
        .filter((registro) => registro.nivelId === nivel.id)
        .map((registro) => [registro.indiceSerie, registro])
    );

    return nivel.valores.map((valor, indice) => {
      const auditoria = auditoriasDelNivel.get(indice);
      const evaluacionDelRegistro = evaluarSerie(nivel.valores.slice(0, indice + 1), nivel.media, nivel.sd);
      const fechaDeMuestra = formatearFechaDeMuestra(indice, nivel.valores.length);
      const responsableDeMuestra = usuariosDeMuestraPorResponsable[control.responsable] ?? {
        nombre: control.responsable ?? "Sin responsable",
        usuario: "sin-usuario",
      };

      return {
        id: auditoria?.id ?? `MUESTRA-${nivel.id}-${indice}`,
        numeroCorrida: indice + 1,
        fechaIngreso: auditoria?.fechaIngreso ?? fechaDeMuestra,
        fechaUltimaModificacion: auditoria?.fechaUltimaModificacion ?? fechaDeMuestra,
        horaUltimaModificacion: auditoria?.horaUltimaModificacion ?? "08:30",
        valorIngresado: valor,
        usuarioResponsable: auditoria?.usuarioResponsable ?? responsableDeMuestra.usuario,
        nombreResponsable: auditoria?.nombreResponsable ?? responsableDeMuestra.nombre,
        estado: evaluacionDelRegistro.estado,
        reglas: evaluacionDelRegistro.reglas,
      };
    });
  }, [control, nivel]);

  if (!control || !nivel) {
    return (
      <section className="mx-auto flex max-w-[1180px] flex-col items-start gap-4 rounded-xl border border-line bg-white p-8">
        <p className="m-0 text-[13px] text-ink-muted">No se encontró el control o nivel solicitado.</p>
        <Link href="/AnalisisQC" className="text-[12px] font-semibold text-ink underline">Volver a Análisis QC</Link>
      </section>
    );
  }

  const ultimoRegistro = historialDelNivel[historialDelNivel.length - 1];
  const evaluacionActual = evaluarSerie(nivel.valores, nivel.media, nivel.sd);
  const presentacionActual = presentacionPorEstado[evaluacionActual.estado];
  const coeficienteVariacion = nivel.media ? ((nivel.sd / nivel.media) * 100).toFixed(2) : "0.00";
  const fechaIngresoAnalito = control.fechaIngreso ?? control.fechaCalibracion ?? historialDelNivel[0]?.fechaIngreso;
  const reglasActuales = evaluacionActual.reglas.length > 0 ? evaluacionActual.reglas.join(", ") : "Sin violaciones";

  return (
    <section className="mx-auto flex max-w-[1320px] flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Análisis QC / Detalle del control
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[27px]">
              {analito?.nombre ?? "Analito sin nombre"}
            </h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${presentacionActual.clase}`}>
              <span className={`size-1.5 rounded-full ${presentacionActual.punto}`} aria-hidden="true" />
              {presentacionActual.texto}
            </span>
          </div>
          <p className="m-0 mt-2 text-[12.5px] text-ink-muted">
            {control.nombre} · Nivel {nivel.nombre} · Lote {control.lote}
          </p>
        </div>

        <Link
          href="/AnalisisQC"
          className="inline-flex h-9 items-center rounded-md border border-line-strong bg-white px-3.5 text-[11.5px] font-semibold text-ink transition hover:bg-surface-muted"
        >
          ← Volver al registro
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
          <div>
            <h2 className="m-0 text-[13.5px] font-semibold text-ink">Identificación y trazabilidad</h2>
            <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">Información consolidada del analito, control y responsable.</p>
          </div>
          <span className="font-mono text-[9.5px] text-ink-faint">{control.id} / {nivel.id}</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          <DatoTrazabilidad etiqueta="Fecha de ingreso del analito" valor={fechaIngresoAnalito} secundario="Registro inicial" />
          <DatoTrazabilidad etiqueta="Última modificación" valor={ultimoRegistro?.fechaUltimaModificacion} secundario={ultimoRegistro?.horaUltimaModificacion} />
          <DatoTrazabilidad etiqueta="Nombre del analito" valor={analito?.nombre} secundario={analito?.unidad} />
          <DatoTrazabilidad etiqueta="Nivel" valor={nivel.nombre} secundario={`Corrida ${ultimoRegistro?.numeroCorrida ?? "—"}`} />
          <DatoTrazabilidad etiqueta="Persona responsable" valor={ultimoRegistro?.nombreResponsable} secundario={`@${ultimoRegistro?.usuarioResponsable}`} />
          <DatoTrazabilidad etiqueta="Control utilizado" valor={control.nombre} secundario={control.fabricante} />
          <DatoTrazabilidad etiqueta="Lote" valor={control.lote} secundario={control.matriz} />
          <DatoTrazabilidad etiqueta="Fecha de caducidad" valor={control.fechaCaducidad} secundario={control.estado} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <TarjetaMetrica etiqueta="Valor ingresado" valor={ultimoRegistro?.valorIngresado ?? "—"} unidad={nivel.unidad} detalle="Último resultado registrado" />
        <TarjetaMetrica etiqueta="Media" valor={nivel.media} unidad={nivel.unidad} detalle="Valor objetivo del nivel" />
        <TarjetaMetrica etiqueta="Desviación estándar" valor={nivel.sd.toFixed(2)} unidad={nivel.unidad} detalle="Dispersión esperada" />
        <TarjetaMetrica etiqueta="Coeficiente de variación" valor={`${coeficienteVariacion}%`} detalle="DE / media × 100" />
        <TarjetaMetrica
          etiqueta="Violación de reglas de Westgard"
          valor={reglasActuales}
          detalle={evaluacionActual.reglas.length > 0 ? "Requiere revisión" : "Serie sin alertas activas"}
          tono={evaluacionActual.estado === ESTADOS.RECHAZADO ? "error" : evaluacionActual.estado === ESTADOS.ADVERTENCIA ? "alerta" : "correcto"}
        />
      </section>

      <div className="flex w-fit rounded-lg border border-line bg-surface-muted p-1" role="tablist" aria-label="Vistas del detalle del control">
        <button
          type="button"
          role="tab"
          aria-selected={vistaActiva === "detalle"}
          onClick={() => establecerVistaActiva("detalle")}
          className={`rounded-md px-4 py-2 text-[11.5px] font-semibold transition ${vistaActiva === "detalle" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}
        >
          Historial de controles
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vistaActiva === "grafico"}
          onClick={() => establecerVistaActiva("grafico")}
          className={`rounded-md px-4 py-2 text-[11.5px] font-semibold transition ${vistaActiva === "grafico" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}
        >
          Ver gráfica Levey-Jennings
        </button>
      </div>

      {vistaActiva === "detalle" ? (
        <section className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="m-0 text-[14px] font-semibold text-ink">Controles ingresados</h2>
              <p className="m-0 mt-1 text-[11px] text-ink-faint">Historial completo del nivel y evaluación de Westgard por corrida.</p>
            </div>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10.5px] font-semibold text-accent">{historialDelNivel.length} registros</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  <th className="px-4 py-3">Corrida</th>
                  <th className="px-4 py-3">Fecha de ingreso</th>
                  <th className="px-4 py-3">Última modificación</th>
                  <th className="px-4 py-3">Valor ingresado</th>
                  <th className="px-4 py-3">Reglas de Westgard</th>
                  <th className="px-4 py-3">Persona responsable</th>
                </tr>
              </thead>
              <tbody>
                {historialDelNivel.toReversed().map((registro) => {
                  const presentacionRegistro = presentacionPorEstado[registro.estado];
                  return (
                    <tr key={registro.id} className="border-t border-line transition hover:bg-[#fbfbfc]">
                      <td className="px-4 py-3 text-[12px] font-semibold tabular-nums text-ink">#{registro.numeroCorrida}</td>
                      <td className="px-4 py-3 text-[12px] text-ink-muted">{registro.fechaIngreso}</td>
                      <td className="px-4 py-3">
                        <p className="m-0 text-[12px] text-ink">{registro.fechaUltimaModificacion}</p>
                        <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">{registro.horaUltimaModificacion}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-semibold tabular-nums text-ink">{registro.valorIngresado} {nivel.unidad}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${presentacionRegistro.clase}`}>{presentacionRegistro.texto}</span>
                        <p className="m-0 mt-1 text-[10px] text-ink-faint">{registro.reglas.length > 0 ? registro.reglas.join(", ") : "Sin violaciones"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="m-0 text-[12px] font-medium text-ink">{registro.nombreResponsable}</p>
                        <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">@{registro.usuarioResponsable}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-4">
          <GraficoLeveyJennings
            valores={nivel.valores}
            registros={historialDelNivel}
            media={nivel.media}
            desviacionEstandar={nivel.sd}
            unidad={nivel.unidad}
            nombreAnalito={analito?.nombre ?? "Analito sin nombre"}
            nombreNivel={nivel.nombre}
            nombreControl={control.nombre}
            loteControl={control.lote}
          />

          <section className="grid overflow-hidden rounded-xl border border-line bg-white sm:grid-cols-4">
            <DatoTrazabilidad etiqueta="Media" valor={`${nivel.media.toFixed(2)} ${nivel.unidad}`} secundario="Línea central" />
            <DatoTrazabilidad etiqueta="Rango ±1 DE" valor={`${(nivel.media - nivel.sd).toFixed(2)} — ${(nivel.media + nivel.sd).toFixed(2)}`} secundario="Zona esperada" />
            <DatoTrazabilidad etiqueta="Alerta ±2 DE" valor={`${(nivel.media - nivel.sd * 2).toFixed(2)} — ${(nivel.media + nivel.sd * 2).toFixed(2)}`} secundario="Límite de precaución" />
            <DatoTrazabilidad etiqueta="Control ±3 DE" valor={`${(nivel.media - nivel.sd * 3).toFixed(2)} — ${(nivel.media + nivel.sd * 3).toFixed(2)}`} secundario="Límite de rechazo" />
          </section>
        </div>
      )}
    </section>
  );
}

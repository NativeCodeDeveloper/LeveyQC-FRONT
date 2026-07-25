"use client";

// Modulo "Control de Pares": compara el mismo examen leido por dos tecnicos
// distintos (Control 1 / Control 2). Reemplaza la planilla de Google Sheets
// que se llevaba hasta ahora (una hoja por mes) por una pantalla propia.
// Sin backend todavia: useControlDeParesStore persiste en localStorage: el
// dia que exista el API real (Java), ese hook es el unico lugar a cambiar.

import { useMemo, useState } from "react";
import Card from "@/app/components/Card";
import { useRegistrosControlDeParesPorMes, useTodosLosRegistrosControlDePares } from "@/lib/useControlDeParesStore";

const formularioInicial = {
  fecha: "",
  examen: "",
  control1Valor: "",
  control1Tecnico: "",
  control2Valor: "",
  control2Tecnico: "",
  observaciones: "",
};

function formatearEtiquetaMes(mesId) {
  const [anio, mes] = mesId.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, 1);
  const etiqueta = fecha.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  return etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
}

export default function PaginaControlDePares() {
  const todosLosRegistros = useTodosLosRegistrosControlDePares();

  const mesesDisponibles = useMemo(() => {
    const idsUnicos = [...new Set(todosLosRegistros.map((registro) => registro.mesId))];
    return idsUnicos.sort();
  }, [todosLosRegistros]);

  const mesHoy = new Date().toISOString().slice(0, 7);
  const [mesSeleccionado, establecerMesSeleccionado] = useState(
    mesesDisponibles.includes(mesHoy) ? mesHoy : mesesDisponibles[mesesDisponibles.length - 1] ?? mesHoy
  );

  const { registros, agregarRegistro } = useRegistrosControlDeParesPorMes(mesSeleccionado);

  const [formulario, establecerFormulario] = useState(formularioInicial);
  const [mensaje, establecerMensaje] = useState("");
  const [formularioAbierto, establecerFormularioAbierto] = useState(false);

  function actualizarCampo(campo, valor) {
    establecerFormulario((actual) => ({ ...actual, [campo]: valor }));
    establecerMensaje("");
  }

  function guardarRegistro(evento) {
    evento.preventDefault();

    if (!formulario.fecha || !formulario.examen.trim() || !formulario.control1Valor.trim() || !formulario.control2Valor.trim()) {
      establecerMensaje("Completa fecha, examen y el valor de ambos controles.");
      return;
    }

    const mesId = formulario.fecha.slice(0, 7);
    const nuevoRegistro = {
      id: `CP-${formulario.fecha}-${Date.now()}`,
      mesId,
      fecha: formulario.fecha.split("-").reverse().join("-"),
      examen: formulario.examen.trim(),
      control1: { valor: formulario.control1Valor.trim(), tecnico: formulario.control1Tecnico.trim() || "—" },
      control2: { valor: formulario.control2Valor.trim(), tecnico: formulario.control2Tecnico.trim() || "—" },
      observaciones: formulario.observaciones.trim(),
    };

    agregarRegistro(nuevoRegistro);
    establecerMesSeleccionado(mesId);
    establecerFormulario(formularioInicial);
    establecerMensaje(`Registro de "${nuevoRegistro.examen}" guardado.`);
    establecerFormularioAbierto(false);
  }

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Gestión / Control de Pares
          </p>
          <h1 className="m-0 text-[23px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
            Control de Pares
          </h1>
          <p className="m-0 mt-2 max-w-2xl text-[13px] leading-5 text-ink-muted">
            Compara el resultado de un mismo examen leído por dos técnicos distintos, mes a mes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[11.5px] text-ink-muted">
            <span className="size-2 rounded-full bg-status-ok" aria-hidden="true" />
            {todosLosRegistros.length} registros totales
          </div>
          <button
            type="button"
            onClick={() => establecerFormularioAbierto((actual) => !actual)}
            aria-expanded={formularioAbierto}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent-strong px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#27272a]"
          >
            {formularioAbierto ? "Cerrar" : "+ Nuevo registro"}
          </button>
        </div>
      </header>

      {formularioAbierto ? (
      <Card as="form" onSubmit={guardarRegistro}>
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h2 className="m-0 text-[14px] font-semibold text-ink">Nuevo registro</h2>
          <p className="m-0 mt-1 text-[10.5px] text-ink-faint">
            Ingresa el resultado que dio cada técnico para el mismo examen.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-muted">Fecha</span>
            <input
              type="date"
              value={formulario.fecha}
              onChange={(evento) => actualizarCampo("fecha", evento.target.value)}
              required
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
            <span className="text-[11.5px] font-semibold text-ink-muted">
              Examen <span className="text-status-alert">*</span>
            </span>
            <input
              value={formulario.examen}
              onChange={(evento) => actualizarCampo("examen", evento.target.value)}
              placeholder="Ej. Recuento de reticulocitos"
              required
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-muted">Control 1 · Resultado</span>
            <input
              value={formulario.control1Valor}
              onChange={(evento) => actualizarCampo("control1Valor", evento.target.value)}
              placeholder="Ej. 1,40%"
              required
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-muted">Control 1 · TM</span>
            <input
              value={formulario.control1Tecnico}
              onChange={(evento) => actualizarCampo("control1Tecnico", evento.target.value)}
              placeholder="Ej. BOL"
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <div />

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-muted">Control 2 · Resultado</span>
            <input
              value={formulario.control2Valor}
              onChange={(evento) => actualizarCampo("control2Valor", evento.target.value)}
              placeholder="Ej. 1,50%"
              required
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-semibold text-ink-muted">Control 2 · TM</span>
            <input
              value={formulario.control2Tecnico}
              onChange={(evento) => actualizarCampo("control2Tecnico", evento.target.value)}
              placeholder="Ej. FDI"
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <span className="text-[11.5px] font-semibold text-ink-muted">Observaciones</span>
            <textarea
              value={formulario.observaciones}
              onChange={(evento) => actualizarCampo("observaciones", evento.target.value)}
              rows={2}
              placeholder="Opcional: notas sobre la concordancia entre ambos controles."
              className="resize-y rounded-md border border-line-strong bg-white px-3 py-2.5 text-[13px] leading-5 text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-muted/50 px-5 py-4 sm:px-6">
          {mensaje ? <p className="m-0 text-[12.5px] font-semibold text-status-ok">{mensaje}</p> : <span />}
          <button type="submit" className="h-10 rounded-sm bg-accent-strong px-5 text-[12px] font-semibold text-white transition hover:bg-[#27272a]">
            Guardar registro
          </button>
        </div>
      </Card>
      ) : null}

      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Mes de Control de Pares">
        {mesesDisponibles.map((mesId) => (
          <button
            key={mesId}
            type="button"
            role="tab"
            aria-selected={mesSeleccionado === mesId}
            onClick={() => establecerMesSeleccionado(mesId)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
              mesSeleccionado === mesId
                ? "border-accent-strong bg-accent-strong text-white"
                : "border-line-strong bg-white text-ink-muted hover:bg-surface-muted"
            }`}
          >
            {formatearEtiquetaMes(mesId)}
          </button>
        ))}
      </div>

      <Card as="section">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="m-0 text-[14px] font-semibold text-ink">Registros del mes</h2>
            <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Comparación entre Control 1 y Control 2 por examen.</p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold text-accent">{registros.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[23%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Examen</th>
                <th className="px-4 py-3">Control 1</th>
                <th className="px-4 py-3">Control 2</th>
                <th className="px-4 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id} className="border-t border-line align-top transition hover:bg-[#fbfbfc]">
                  <td className="px-4 py-3 font-mono text-[12.5px] font-medium tabular-nums text-ink">{registro.fecha}</td>
                  <td className="px-4 py-3 text-[12.5px] font-semibold text-ink">{registro.examen}</td>
                  <td className="px-4 py-3">
                    <p className="m-0 font-mono text-[12.5px] font-semibold tabular-nums text-ink">{registro.control1.valor}</p>
                    <p className="m-0 mt-1 inline-flex items-center gap-1 rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                      <span className="text-ink-faint">TM</span>
                      <span className="font-mono text-ink">{registro.control1.tecnico}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="m-0 font-mono text-[12.5px] font-semibold tabular-nums text-ink">{registro.control2.valor}</p>
                    <p className="m-0 mt-1 inline-flex items-center gap-1 rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                      <span className="text-ink-faint">TM</span>
                      <span className="font-mono text-ink">{registro.control2.tecnico}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[12px] leading-5 text-ink-muted">{registro.observaciones || "—"}</td>
                </tr>
              ))}
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-ink-faint">
                    No hay registros de Control de Pares para este mes.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

"use client";

// Maqueta funcional para ingresar proveedores. Solo utiliza los campos
// Empresa, Categoria de suministro y Observaciones, sin conexion a backend.

import { useState } from "react";

// Datos iniciales cuyo objetivo es centralizar los tres campos visibles del
// formulario y facilitar su limpieza despues de cada registro.
const formularioProveedorInicial = {
  empresa: "",
  categoriaSuministro: "Reactivos",
  observaciones: "",
};

const categoriasDeSuministro = ["Reactivos", "Insumos", "Equipos", "Calibración", "Servicios", "Transporte"];

export default function PaginaProveedores() {
  // Datos cuyo objetivo es controlar los tres campos del formulario.
  const [datosProveedor, establecerDatosProveedor] = useState(formularioProveedorInicial);

  // Listado temporal cuyo objetivo es mostrar los proveedores ingresados
  // durante la sesion actual de esta maqueta.
  const [proveedoresRegistrados, establecerProveedoresRegistrados] = useState([]);

  // Mensaje cuyo objetivo es comunicar validaciones y registros exitosos.
  const [mensajeFormulario, establecerMensajeFormulario] = useState("");
  const [tipoMensaje, establecerTipoMensaje] = useState("exito");

  function actualizarCampo(nombreCampo, valorCampo) {
    establecerDatosProveedor((datosActuales) => ({ ...datosActuales, [nombreCampo]: valorCampo }));
    establecerMensajeFormulario("");
  }

  function limpiarFormulario() {
    establecerDatosProveedor(formularioProveedorInicial);
    establecerMensajeFormulario("");
  }

  function guardarProveedor(evento) {
    evento.preventDefault();

    if (!datosProveedor.empresa.trim()) {
      establecerTipoMensaje("error");
      establecerMensajeFormulario("Ingresa el nombre de la empresa.");
      return;
    }

    const proveedorNuevo = {
      ...datosProveedor,
      id: `PROV-${Date.now()}`,
    };

    establecerProveedoresRegistrados((proveedoresActuales) => [proveedorNuevo, ...proveedoresActuales]);
    establecerDatosProveedor(formularioProveedorInicial);
    establecerTipoMensaje("exito");
    establecerMensajeFormulario(`Proveedor ${proveedorNuevo.empresa} registrado en la maqueta.`);
  }

  const inicialesEmpresa = (datosProveedor.empresa || "Nueva empresa")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join("");

  return (
    <section className="mx-auto flex max-w-[1120px] flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Abastecimiento / Proveedores</p>
          <h1 className="m-0 text-[23px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">Ingreso de proveedores</h1>
          <p className="m-0 mt-2 max-w-2xl text-[13px] leading-5 text-ink-muted">
            Registra la empresa, su categoría de suministro y las observaciones relevantes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[11.5px] text-ink-muted">
          <span className="size-2 rounded-full bg-status-ok" aria-hidden="true" />
          {proveedoresRegistrados.length} {proveedoresRegistrados.length === 1 ? "proveedor registrado" : "proveedores registrados"}
        </div>
      </header>

      {mensajeFormulario ? (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
            tipoMensaje === "error"
              ? "border-[#ecc9c5] bg-status-alert-soft text-status-alert"
              : "border-[#cde2d6] bg-status-ok-soft text-status-ok"
          }`}
        >
          <p className="m-0 text-[12.5px] font-semibold">{mensajeFormulario}</p>
          <button type="button" onClick={() => establecerMensajeFormulario("")} className="text-[11px] font-semibold hover:underline">Cerrar</button>
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <form onSubmit={guardarProveedor} className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_10px_35px_rgba(31,37,48,0.045)]">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="m-0 text-[14px] font-semibold text-ink">Datos del proveedor</h2>
            <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Completa los tres campos para agregar una empresa.</p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">
                Empresa <span className="text-status-alert">*</span>
              </span>
              <input
                name="empresa"
                value={datosProveedor.empresa}
                onChange={(evento) => actualizarCampo("empresa", evento.target.value)}
                placeholder="Ej. Laboratorios del Sur SpA"
                required
                className="h-11 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">Categoría de suministro</span>
              <select
                name="categoriaSuministro"
                value={datosProveedor.categoriaSuministro}
                onChange={(evento) => actualizarCampo("categoriaSuministro", evento.target.value)}
                className="h-11 rounded-md border border-line-strong bg-white px-3 text-[13px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
              >
                {categoriasDeSuministro.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
              <span className="text-[11.5px] font-semibold text-ink-muted">Observaciones</span>
              <textarea
                name="observaciones"
                value={datosProveedor.observaciones}
                onChange={(evento) => actualizarCampo("observaciones", evento.target.value)}
                rows={6}
                placeholder="Añade información relevante sobre productos, condiciones o atención del proveedor."
                className="resize-y rounded-md border border-line-strong bg-white px-3 py-3 text-[13px] leading-5 text-ink outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line bg-surface-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button type="button" onClick={limpiarFormulario} className="h-10 rounded-sm border border-line-strong bg-white px-4 text-[12px] font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">
              Limpiar
            </button>
            <button type="submit" className="h-10 rounded-sm bg-accent-strong px-5 text-[12px] font-semibold text-white transition hover:bg-[#14181e]">
              Guardar proveedor
            </button>
          </div>
        </form>

        <aside className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_10px_35px_rgba(31,37,48,0.045)]">
          <div className="border-b border-line px-5 py-4">
            <p className="m-0 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Vista previa</p>
            <h2 className="m-0 mt-1 text-[13.5px] font-semibold text-ink">Ficha del proveedor</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 border-b border-line pb-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent-strong text-[13px] font-bold text-white">{inicialesEmpresa || "NE"}</span>
              <div className="min-w-0">
                <p className="m-0 truncate text-[14px] font-semibold text-ink">{datosProveedor.empresa || "Nueva empresa"}</p>
                <span className="mt-1.5 inline-flex rounded-full bg-accent-soft px-2 py-1 text-[9.5px] font-semibold text-accent">{datosProveedor.categoriaSuministro}</span>
              </div>
            </div>
            <div className="pt-5">
              <p className="m-0 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Observaciones</p>
              <p className="m-0 mt-2 min-h-20 whitespace-pre-wrap text-[11.5px] leading-5 text-ink-muted">
                {datosProveedor.observaciones || "Sin observaciones ingresadas."}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="m-0 text-[14px] font-semibold text-ink">Proveedores ingresados</h2>
            <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Registros temporales creados durante esta sesión.</p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold text-accent">{proveedoresRegistrados.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[25%]" />
              <col className="w-[45%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Categoría de suministro</th>
                <th className="px-4 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresRegistrados.map((proveedor) => (
                <tr key={proveedor.id} className="border-t border-line align-top transition hover:bg-[#fbfbfc]">
                  <td className="px-4 py-3 text-[12.5px] font-semibold text-ink">{proveedor.empresa}</td>
                  <td className="px-4 py-3 text-[12px] text-ink-muted">{proveedor.categoriaSuministro}</td>
                  <td className="px-4 py-3 text-[12px] leading-5 text-ink-muted">{proveedor.observaciones || "Sin observaciones"}</td>
                </tr>
              ))}
              {proveedoresRegistrados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-[12.5px] text-ink-faint">Todavía no has ingresado proveedores en esta sesión.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

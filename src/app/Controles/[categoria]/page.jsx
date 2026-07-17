"use client";

// Pantalla "Controles {Categoria}": tabla de controles de la categoria con
// el semaforo de estado QC calculado en vivo con el motor de reglas de
// Westgard (src/lib/westgard.js) a partir de los resultados historicos de
// cada nivel (src/lib/mockData.js).

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { obtenerCategoriaPorId } from "@/lib/mockData";
import { evaluateControl } from "@/lib/westgard";
import { useControlesDeCategoria } from "@/lib/useControlesStore";
import EstadoSemaforo from "../EstadoSemaforo";

export default function ControlesDeCategoriaPage() {
  // useParams() en vez de la prop `params` porque este es un Client
  // Component: en Next 16, `params` como prop solo se puede leer (como
  // Promise) desde Server Components.
  const { categoria: categoriaId } = useParams();
  const categoria = obtenerCategoriaPorId(categoriaId);
  const { controles } = useControlesDeCategoria(categoriaId);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const controlesFiltrados = useMemo(() => {
    const termino = textoBusqueda.trim().toLowerCase();
    if (!termino) {
      return controles;
    }
    return controles.filter((control) => control.nombre.toLowerCase().includes(termino));
  }, [controles, textoBusqueda]);

  if (!categoria) {
    return (
      <section className="mx-auto flex max-w-[1180px] flex-col gap-4">
        <p className="text-sm text-ink-muted">La categoria &quot;{categoriaId}&quot; no existe.</p>
        <Link href="/" className="text-sm font-medium text-ink underline">
          Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
            Analisis QC / Controles
          </p>
          <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
            Controles {categoria.nombre}
          </h1>
        </div>
        <div className="flex gap-2.5">
          <Link
            href={`/Controles/${categoriaId}/analitos`}
            className="inline-flex min-h-[36px] items-center justify-center rounded-md border border-line-strong bg-white px-4 text-[13px] font-medium text-ink transition hover:bg-surface-muted"
          >
            Ver Analitos
          </Link>
          <Link
            href={`/Controles/${categoriaId}/nuevo`}
            className="inline-flex min-h-[36px] items-center justify-center rounded-md bg-accent-strong px-4 text-[13px] font-medium text-white transition hover:bg-[#14181e]"
          >
            Ingresar Control
          </Link>
        </div>
      </div>

      <label className="flex max-w-sm flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-muted">Buscar control</span>
        <input
          type="search"
          value={textoBusqueda}
          onChange={(evento) => setTextoBusqueda(evento.target.value)}
          placeholder="Ej. Hemoglobina"
          className="h-9 rounded-md border border-line-strong px-3 text-[13.5px] outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </label>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[17%]" />
            <col className="w-[17%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">Control</th>
              <th className="px-4 py-3">Calibracion</th>
              <th className="px-4 py-3">Caducidad</th>
              <th className="px-4 py-3">Estado QC</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {controlesFiltrados.map((control) => {
              const { estado, reglas } = evaluateControl(control.niveles);
              return (
                <tr key={control.id} className="border-t border-line align-top hover:bg-surface-muted/60">
                  <td className="px-4 py-3">
                    <p className="m-0 truncate text-[13.5px] font-medium text-ink">{control.nombre}</p>
                    <p className="m-0 mt-0.5 truncate text-[12px] text-ink-muted">Lote {control.lote}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="m-0 truncate text-[13px] text-ink-muted">{control.estadoCalibracion}</p>
                    <p className="m-0 mt-0.5 truncate text-[12px] text-ink-faint">{control.fechaCalibracion}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="m-0 truncate text-[13px] text-ink-muted">{control.fechaCaducidad}</p>
                    <p
                      className={`m-0 mt-0.5 truncate text-[12px] ${
                        control.estado === "Caducado" ? "text-status-alert" : "text-ink-faint"
                      }`}
                    >
                      {control.estado}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoSemaforo estado={estado} reglas={reglas} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="m-0 truncate text-[13.5px] text-ink-muted">{control.stock} un.</p>
                    <p className="m-0 mt-0.5 truncate text-[12px] text-ink-faint">{control.responsable}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/Controles/${categoriaId}/${control.id}`}
                      className="inline-flex min-h-[30px] items-center rounded-md border border-line-strong bg-white px-2.5 text-[12px] font-medium text-ink transition hover:bg-surface-muted"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
            {controlesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-ink-faint">
                  No hay controles para esta busqueda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

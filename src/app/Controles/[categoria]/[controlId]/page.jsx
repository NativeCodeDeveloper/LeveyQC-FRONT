"use client";

// Detalle de un control: muestra sus datos generales y, por cada nivel, la
// media, la SD, el ultimo valor medido y que regla de Westgard se disparo
// (si es que se disparo alguna). Es donde se explica *por que* un control
// quedo en naranja o en rojo en el listado.

import Link from "next/link";
import { useParams } from "next/navigation";
import { obtenerCategoriaPorId } from "@/lib/mockData";
import { evaluateControl } from "@/lib/westgard";
import { useControlPorId } from "@/lib/useControlesStore";
import EstadoSemaforo from "../../EstadoSemaforo";

export default function DetalleControlPage() {
  const { categoria: categoriaId, controlId } = useParams();
  const categoria = obtenerCategoriaPorId(categoriaId);
  const control = useControlPorId(controlId);

  if (!control) {
    return (
      <section className="mx-auto flex max-w-[1180px] flex-col gap-4">
        <p className="text-sm text-ink-muted">No se encontro el control &quot;{controlId}&quot;.</p>
        <Link href={`/Controles/${categoriaId}`} className="text-sm font-semibold text-ink underline">
          Volver al listado
        </Link>
      </section>
    );
  }

  const { estado, reglas, detallePorNivel } = evaluateControl(control.niveles);

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Analisis QC / Controles / {categoria?.nombre ?? categoriaId}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="m-0 text-[20px] font-semibold tracking-tight text-ink sm:text-[24px]">
            {control.nombre}
          </h1>
          <EstadoSemaforo estado={estado} reglas={reglas} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-line p-5 sm:grid-cols-3 lg:grid-cols-4">
        <DatoControl etiqueta="Lote" valor={control.lote} />
        <DatoControl etiqueta="Fabricante" valor={control.fabricante} />
        <DatoControl etiqueta="Matriz" valor={control.matriz} />
        <DatoControl etiqueta="Estado calibracion" valor={control.estadoCalibracion} />
        <DatoControl etiqueta="Fecha calibracion" valor={control.fechaCalibracion} />
        <DatoControl etiqueta="Fecha caducidad" valor={control.fechaCaducidad} />
        <DatoControl etiqueta="Stock" valor={control.stock} />
        <DatoControl etiqueta="Responsable" valor={control.responsable} />
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-ink">Desglose por nivel (reglas de Westgard)</h2>
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[24%]" />
              <col className="w-[20%]" />
              <col className="w-[38%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Media / SD</th>
                <th className="px-4 py-3">Ultimo valor</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {control.niveles.map((nivel) => {
                const detalle = detallePorNivel.find((item) => item.nivelId === nivel.id);
                const ultimoValor = nivel.valores[nivel.valores.length - 1];
                return (
                  <tr key={nivel.id} className="border-t border-line align-top">
                    <td className="px-4 py-3 truncate text-[13.5px] font-medium text-ink">{nivel.nombre}</td>
                    <td className="px-4 py-3 truncate text-[13.5px] text-ink-muted">
                      {nivel.media} {nivel.unidad} / {nivel.sd.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 truncate text-[13.5px] text-ink-muted">
                      {ultimoValor} {nivel.unidad}
                    </td>
                    <td className="px-4 py-3">
                      <EstadoSemaforo estado={detalle?.estado} reglas={detalle?.reglas} />
                      <p className="m-0 mt-1 truncate text-[12px] text-ink-faint">
                        {detalle?.reglas?.length ? `Regla: ${detalle.reglas.join(", ")}` : "Sin reglas disparadas"}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Grafico de Levey-Jennings (visual, con bandas de +/-1SD, 2SD y 3SD): pendiente para la Fase 2.
        </p>
      </div>

      <Link href={`/Controles/${categoriaId}`} className="text-[13px] font-medium text-ink-muted hover:underline">
        Volver al listado
      </Link>
    </section>
  );
}

function DatoControl({ etiqueta, valor }) {
  return (
    <div>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-faint">{etiqueta}</p>
      <p className="m-0 text-[13.5px] font-semibold text-ink">{valor || "-"}</p>
    </div>
  );
}

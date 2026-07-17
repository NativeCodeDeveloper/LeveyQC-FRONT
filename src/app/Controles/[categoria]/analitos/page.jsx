// "Ver Analitos": listado simple de los analitos que se controlan en esta
// categoria. No necesita interactividad, asi que se deja como Server
// Component (a diferencia de las otras pantallas de Controles). En Next 16
// `params` llega como Promise y hay que esperarlo con await.

import Link from "next/link";
import { obtenerAnalitosPorCategoria, obtenerCategoriaPorId } from "@/lib/mockData";

export default async function AnalitosDeCategoriaPage({ params }) {
  const { categoria: categoriaId } = await params;
  const categoria = obtenerCategoriaPorId(categoriaId);
  const analitos = obtenerAnalitosPorCategoria(categoriaId);

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Analisis QC / Controles / {categoria?.nombre ?? categoriaId}
        </p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          Analitos de {categoria?.nombre ?? categoriaId}
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[40%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Analito</th>
              <th className="px-4 py-3">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {analitos.map((analito) => (
              <tr key={analito.id} className="border-t border-line">
                <td className="px-4 py-3 truncate text-[13.5px] text-ink-muted">{analito.id}</td>
                <td className="px-4 py-3 truncate text-[13.5px] font-medium text-ink">{analito.nombre}</td>
                <td className="px-4 py-3 truncate text-[13.5px] text-ink-muted">{analito.unidad}</td>
              </tr>
            ))}
            {analitos.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-ink-faint">
                  Todavia no hay analitos cargados para esta categoria.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Link href={`/Controles/${categoriaId}`} className="text-[13px] font-medium text-ink-muted hover:underline">
        Volver a Controles
      </Link>
    </section>
  );
}

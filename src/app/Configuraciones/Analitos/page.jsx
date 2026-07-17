// "Ingreso Analitos": por ahora, listado de solo lectura de los analitos
// mock agrupados por categoria. El CRUD real (crear/editar/eliminar) queda
// para la Fase 2, cuando haya backend.

import { categorias, obtenerAnalitosPorCategoria } from "@/lib/mockData";

export default function AnalitosConfiguracionPage() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Analisis QC / Configuraciones
        </p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          Ingreso Analitos
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-muted">
          Listado de solo lectura por ahora. El alta/edicion de analitos queda para la Fase 2.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {categorias.map((categoria) => {
          const analitosDeCategoria = obtenerAnalitosPorCategoria(categoria.id);
          return (
            <div key={categoria.id} className="rounded-lg border border-line p-4">
              <h2 className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                {categoria.nombre}
              </h2>
              {analitosDeCategoria.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {analitosDeCategoria.map((analito) => (
                    <li
                      key={analito.id}
                      className="rounded-full border border-line bg-surface-muted px-3 py-1 text-[12px] font-medium text-ink-muted"
                    >
                      {analito.nombre} ({analito.unidad})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-[12px] text-ink-faint">Sin analitos cargados.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

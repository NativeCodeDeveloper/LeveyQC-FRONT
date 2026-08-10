// "Ingreso Analitos": formulario visual y listado de analitos mock
// agrupados por categoria. La persistencia queda para la Fase 2.

import Card from "@/app/components/Card";

export default function AnalitosConfiguracionPage() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Análisis QC / Configuraciones
        </p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          Ingreso de analitos
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-muted">
          Registra un nuevo analito y consulta el catálogo disponible por categoría.
        </p>
      </div>

      <Card as="form" className="p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <h2 className="m-0 text-[16px] font-semibold text-ink">Nuevo analito</h2>
            <p className="mt-1 text-[12.5px] text-ink-muted">Completa los datos generales del analito.</p>
          </div>
          <span className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-[11px] font-medium text-ink-muted">
            Datos mock
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Nombre del analito</span>
            <input
              type="text"
              placeholder="Ej. Proteína C reactiva"
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13.5px] text-ink outline-none placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Abreviación del analito</span>
            <input
              type="text"
              placeholder="Ej. PCR"
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13.5px] uppercase text-ink outline-none placeholder:normal-case placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Unidad de medida del analito</span>
            <input
              type="text"
              placeholder="Ej. mg/L"
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13.5px] text-ink outline-none placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Categoría del analito</span>
            <select
              defaultValue=""
              className="h-10 rounded-md border border-line-strong bg-white px-3 text-[13.5px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              <option value="quimica">Química</option>
              <option value="hematologia">Hematología</option>
              <option value="hormonas">Hormonas</option>
              <option value="microbiologia">Microbiología</option>
              <option value="parasitologia">Parasitología</option>
              <option value="biologia-molecular">Biología molecular</option>
              <option value="banco-de-sangre">Banco de sangre</option>
              <option value="serologia">Serología</option>
            </select>
          </label>
        </div>

        <div className="mt-7 flex justify-end border-t border-line pt-5">
          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-accent-strong px-5 text-[13px] font-medium text-white hover:bg-[#27272a] sm:w-auto"
          >
            Ingresar analito
          </button>
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="m-0 text-[16px] font-semibold text-ink">Analitos disponibles</h2>
          <p className="mt-1 text-[12.5px] text-ink-muted">Catálogo mock agrupado por categoría.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,520px)_minmax(220px,280px)]">
          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Buscar por similitud de nombre</span>
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Ej. hemoglo, glucosa o creatinina"
                className="h-10 w-full rounded-md border border-line-strong bg-white pl-10 pr-3 text-[13.5px] text-ink outline-none placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Filtrar por categoría</span>
            <select
              defaultValue="todas"
              className="h-10 w-full rounded-md border border-line-strong bg-white px-3 text-[13.5px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            >
              <option value="todas">Todas las categorías</option>
              <option value="quimica">Química</option>
              <option value="hematologia">Hematología</option>
              <option value="hormonas">Hormonas</option>
              <option value="microbiologia">Microbiología</option>
              <option value="parasitologia">Parasitología</option>
              <option value="biologia-molecular">Biología molecular</option>
              <option value="banco-de-sangre">Banco de sangre</option>
              <option value="serologia">Serología</option>
            </select>
          </label>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-[13.5px]">
              <thead>
                <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Analito</th>
                  <th className="px-4 py-3">Unidad de medida</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Glucosa</td>
                  <td className="px-4 py-3 text-ink-muted">mg/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Química</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Colesterol total</td>
                  <td className="px-4 py-3 text-ink-muted">mg/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Química</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Creatinina</td>
                  <td className="px-4 py-3 text-ink-muted">mg/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Química</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Hemoglobina</td>
                  <td className="px-4 py-3 text-ink-muted">g/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Hematología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Hematocrito</td>
                  <td className="px-4 py-3 text-ink-muted">%</td>
                  <td className="px-4 py-3 text-ink-muted">Hematología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Leucocitos</td>
                  <td className="px-4 py-3 text-ink-muted">x10^3/uL</td>
                  <td className="px-4 py-3 text-ink-muted">Hematología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">TSH</td>
                  <td className="px-4 py-3 text-ink-muted">uUI/mL</td>
                  <td className="px-4 py-3 text-ink-muted">Hormonas</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">T4 libre</td>
                  <td className="px-4 py-3 text-ink-muted">ng/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Hormonas</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Recuento de colonias</td>
                  <td className="px-4 py-3 text-ink-muted">UFC/mL</td>
                  <td className="px-4 py-3 text-ink-muted">Microbiología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Carga parasitaria</td>
                  <td className="px-4 py-3 text-ink-muted">parásitos/campo</td>
                  <td className="px-4 py-3 text-ink-muted">Parasitología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Carga viral</td>
                  <td className="px-4 py-3 text-ink-muted">copias/mL</td>
                  <td className="px-4 py-3 text-ink-muted">Biología molecular</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Hemoglobina donante</td>
                  <td className="px-4 py-3 text-ink-muted">g/dL</td>
                  <td className="px-4 py-3 text-ink-muted">Banco de sangre</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">Índice de reactividad</td>
                  <td className="px-4 py-3 text-ink-muted">S/CO</td>
                  <td className="px-4 py-3 text-ink-muted">Serología</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted">Seleccionar</button>
                      <button type="button" className="px-2 py-1.5 text-xs font-semibold text-status-alert hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}

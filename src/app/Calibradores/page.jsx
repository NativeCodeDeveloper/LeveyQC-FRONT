// Maqueta visual del registro de calibradores. Se mantiene como Server
// Component porque solo presenta datos temporales y no necesita interactividad.

// Datos de muestra cuyo objetivo es representar la estructura futura del
// listado mientras no exista una fuente de datos real.
const muestraCalibradores = [
  {
    id: "CAL-001",
    nombre: "Calibrador Multical Nivel 1",
    proveedor: "Bio-Rad Laboratories",
    fechaIngresoSistema: "12-03-2026",
    fechaCaducidad: "30-11-2026",
    responsableNombre: "Beatriz Olate",
    responsableUsuario: "bolate",
  },
  {
    id: "CAL-002",
    nombre: "ARCHITECT c System Calibrator",
    proveedor: "Abbott Diagnostics",
    fechaIngresoSistema: "20-04-2026",
    fechaCaducidad: "31-01-2027",
    responsableNombre: "Felipe Díaz",
    responsableUsuario: "fdiaz",
  },
  {
    id: "CAL-003",
    nombre: "CalSet Pro TSH",
    proveedor: "Roche Diagnostics",
    fechaIngresoSistema: "08-05-2026",
    fechaCaducidad: "15-02-2027",
    responsableNombre: "María Vera",
    responsableUsuario: "mvera",
  },
  {
    id: "CAL-004",
    nombre: "XN CAL PF",
    proveedor: "Sysmex Chile",
    fechaIngresoSistema: "17-05-2026",
    fechaCaducidad: "28-02-2027",
    responsableNombre: "Rodrigo Soto",
    responsableUsuario: "rsoto",
  },
  {
    id: "CAL-005",
    nombre: "Dimension CHEM I Calibrator",
    proveedor: "Siemens Healthineers",
    fechaIngresoSistema: "03-06-2026",
    fechaCaducidad: "20-03-2027",
    responsableNombre: "Beatriz Olate",
    responsableUsuario: "bolate",
  },
];

export default function PaginaCalibradores() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Análisis QC / Calibradores
          </p>
          <h1 className="m-0 text-[23px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
            Registro de calibradores
          </h1>
          <p className="m-0 mt-2 max-w-2xl text-[13px] leading-5 text-ink-muted">
            Consulta el origen, vigencia y responsable del ingreso de cada calibrador utilizado en el laboratorio.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[11.5px] text-ink-muted">
          <span className="size-2 rounded-full bg-status-ok" aria-hidden="true" />
          {muestraCalibradores.length} calibradores registrados
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted/60 px-4 py-3">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <p className="m-0 text-[12px] leading-5 text-ink-muted">
          Datos de muestra para validar la interfaz. El listado aún no está conectado a una fuente de datos real.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_10px_35px_rgba(31,37,48,0.045)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="m-0 text-[14px] font-semibold text-ink">Calibradores ingresados</h2>
            <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Trazabilidad de ingreso y caducidad del material de calibración.</p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold text-accent">
            {muestraCalibradores.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[27%]" />
              <col className="w-[21%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-4 py-3">Calibrador</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Fecha de ingreso al sistema</th>
                <th className="px-4 py-3">Fecha de caducidad</th>
                <th className="px-4 py-3">Responsable del ingreso</th>
              </tr>
            </thead>
            <tbody>
              {muestraCalibradores.map((calibrador, indiceCalibrador) => (
                <tr key={calibrador.id} className="border-t border-line transition hover:bg-[#fbfbfc]">
                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-strong text-[10px] font-bold text-white">
                        {String(indiceCalibrador + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 truncate text-[12.5px] font-semibold text-ink">{calibrador.nombre}</p>
                        <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">{calibrador.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12px] font-medium text-ink-muted">{calibrador.proveedor}</td>
                  <td className="px-4 py-4">
                    <p className="m-0 text-[12px] font-semibold tabular-nums text-ink">{calibrador.fechaIngresoSistema}</p>
                    <p className="m-0 mt-1 text-[10px] text-ink-faint">Registro inicial</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="m-0 text-[12px] font-semibold tabular-nums text-ink">{calibrador.fechaCaducidad}</p>
                    <span className="mt-1 inline-flex rounded-full bg-status-ok-soft px-2 py-0.5 text-[9.5px] font-semibold text-status-ok">
                      Vigente
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="m-0 truncate text-[12px] font-semibold text-ink">{calibrador.responsableNombre}</p>
                    <p className="m-0 mt-0.5 text-[10.5px] text-ink-faint">@{calibrador.responsableUsuario}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

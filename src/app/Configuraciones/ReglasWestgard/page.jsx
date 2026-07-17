// "Reglas de Westgard": por ahora, documentacion de solo lectura del set de
// reglas fijo que usa el motor (src/lib/westgard.js) para calcular el
// semaforo de Controles. Poder elegir que reglas aplican por analito/nivel
// queda para la Fase 2.

const REGLAS = [
  { nombre: "1-2s", tipo: "Advertencia", detecta: "-", descripcion: "Un punto fuera de +/-2 SD. No rechaza por si sola, dispara la revision del resto de las reglas." },
  { nombre: "1-3s", tipo: "Rechazo", detecta: "Error aleatorio", descripcion: "Un punto fuera de +/-3 SD." },
  { nombre: "2-2s", tipo: "Rechazo", detecta: "Error sistematico", descripcion: "2 puntos consecutivos fuera de +/-2 SD, del mismo lado de la media." },
  { nombre: "R-4s", tipo: "Rechazo", detecta: "Error aleatorio", descripcion: "La diferencia entre 2 niveles de la misma corrida supera 4 SD." },
  { nombre: "4-1s", tipo: "Rechazo", detecta: "Error sistematico", descripcion: "4 puntos consecutivos fuera de +/-1 SD, del mismo lado de la media." },
  { nombre: "10x", tipo: "Rechazo", detecta: "Error sistematico", descripcion: "10 puntos consecutivos del mismo lado de la media." },
];

export default function ReglasWestgardPage() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Analisis QC / Configuraciones
        </p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          Reglas de Westgard
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-muted">
          Set de reglas fijo que hoy usa el semaforo de Controles. Poder activarlas/desactivarlas por analito o nivel
          queda para la Fase 2.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[18%]" />
            <col className="w-[56%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">Regla</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Detecta</th>
              <th className="px-4 py-3">Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {REGLAS.map((regla) => (
              <tr key={regla.nombre} className="border-t border-line align-top">
                <td className="px-4 py-3 text-[13.5px] font-medium text-ink">{regla.nombre}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      regla.tipo === "Rechazo"
                        ? "bg-status-alert-soft text-status-alert"
                        : "bg-status-warn-soft text-status-warn"
                    }`}
                  >
                    {regla.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13.5px] text-ink-muted">{regla.detecta}</td>
                <td className="px-4 py-3 text-[13.5px] leading-relaxed text-ink-muted">{regla.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

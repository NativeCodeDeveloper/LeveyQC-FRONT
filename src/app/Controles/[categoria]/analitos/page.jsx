// Maqueta visual del seguimiento de analitos. Esta pagina se mantiene como
// Server Component: no usa estados, efectos, eventos ni integraciones reales.

import Link from "next/link";
import { obtenerAnalitosPorCategoria, obtenerCategoriaPorId } from "@/lib/mockData";

// Datos temporales cuyo objetivo es representar los registros diarios y
// mensuales de cada analito mientras no exista una fuente de datos real.
const muestraRegistrosPorAnalito = {
  glucosa: {
    objetivo: "100 ± 4 mg/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "100,8 mg/dL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "98,8 mg/dL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "101,6 mg/dL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "100,4", variacion: "2,1%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "99,8", variacion: "2,4%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "100,6", variacion: "2,0%", aceptacion: "100%" },
    ],
  },
  colesterol: {
    objetivo: "180 ± 6 mg/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "181,2 mg/dL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "178,2 mg/dL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "182,4 mg/dL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "180,6", variacion: "2,3%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "179,5", variacion: "2,7%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "181,1", variacion: "2,5%", aceptacion: "100%" },
    ],
  },
  creatinina: {
    objetivo: "1,10 ± 0,08 mg/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "1,12 mg/dL", desviacion: "+0,3 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "1,08 mg/dL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "1,26 mg/dL", desviacion: "+2,0 DE", estado: "Revisar" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "1,11", variacion: "3,2%", aceptacion: "94,4%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "1,09", variacion: "2,8%", aceptacion: "100%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "1,10", variacion: "3,0%", aceptacion: "96,8%" },
    ],
  },
  hemoglobina: {
    objetivo: "13,0 ± 0,4 g/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "13,08 g/dL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "12,88 g/dL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "13,16 g/dL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "13,02", variacion: "1,8%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "12,96", variacion: "2,0%", aceptacion: "100%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "13,05", variacion: "1,9%", aceptacion: "96,8%" },
    ],
  },
  hematocrito: {
    objetivo: "42,0 ± 1,2%",
    diarios: [
      { fecha: "19 jul 2026", resultado: "42,2%", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "41,6%", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "44,8%", desviacion: "+2,3 DE", estado: "Revisar" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "42,3", variacion: "2,7%", aceptacion: "94,4%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "41,9", variacion: "2,3%", aceptacion: "100%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "42,1", variacion: "2,5%", aceptacion: "96,8%" },
    ],
  },
  leucocitos: {
    objetivo: "7,5 ± 0,5 x10^3/uL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "7,6 x10^3/uL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "7,4 x10^3/uL", desviacion: "-0,2 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "7,7 x10^3/uL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "7,52", variacion: "3,1%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "7,46", variacion: "3,4%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "7,51", variacion: "3,0%", aceptacion: "100%" },
    ],
  },
  tsh: {
    objetivo: "2,50 ± 0,20 uUI/mL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "2,94 uUI/mL", desviacion: "+2,2 DE", estado: "Revisar" },
      { fecha: "18 jul 2026", resultado: "2,48 uUI/mL", desviacion: "-0,1 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "2,54 uUI/mL", desviacion: "+0,2 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "2,55", variacion: "4,8%", aceptacion: "94,4%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "2,49", variacion: "4,1%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "2,51", variacion: "3,9%", aceptacion: "100%" },
    ],
  },
  "t4-libre": {
    objetivo: "1,20 ± 0,10 ng/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "1,22 ng/dL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "1,17 ng/dL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "1,24 ng/dL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "1,21", variacion: "3,0%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "1,19", variacion: "3,3%", aceptacion: "100%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "1,20", variacion: "3,1%", aceptacion: "96,8%" },
    ],
  },
  "recuento-colonias": {
    objetivo: "150 ± 10 UFC/mL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "152 UFC/mL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "147 UFC/mL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "154 UFC/mL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "151", variacion: "4,2%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "149", variacion: "4,6%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "150", variacion: "4,1%", aceptacion: "100%" },
    ],
  },
  "carga-parasitaria": {
    objetivo: "5,0 ± 0,8 parasitos/campo",
    diarios: [
      { fecha: "19 jul 2026", resultado: "5,2 parasitos/campo", desviacion: "+0,3 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "4,8 parasitos/campo", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "5,3 parasitos/campo", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "5,1", variacion: "6,1%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "4,9", variacion: "6,5%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "5,0", variacion: "5,9%", aceptacion: "100%" },
    ],
  },
  "carga-viral": {
    objetivo: "1.000 ± 60 copias/mL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "1.012 copias/mL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "982 copias/mL", desviacion: "-0,3 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "1.024 copias/mL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "1.006", variacion: "3,8%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "994", variacion: "4,0%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "1.003", variacion: "3,6%", aceptacion: "100%" },
    ],
  },
  "hemoglobina-donante": {
    objetivo: "14,0 ± 0,5 g/dL",
    diarios: [
      { fecha: "19 jul 2026", resultado: "14,1 g/dL", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "13,9 g/dL", desviacion: "-0,2 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "14,2 g/dL", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "14,04", variacion: "2,0%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "13,96", variacion: "2,2%", aceptacion: "100%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "14,02", variacion: "2,1%", aceptacion: "96,8%" },
    ],
  },
  "indice-reactividad": {
    objetivo: "0,50 ± 0,05 S/CO",
    diarios: [
      { fecha: "19 jul 2026", resultado: "0,51 S/CO", desviacion: "+0,2 DE", estado: "Aceptado" },
      { fecha: "18 jul 2026", resultado: "0,49 S/CO", desviacion: "-0,2 DE", estado: "Aceptado" },
      { fecha: "17 jul 2026", resultado: "0,52 S/CO", desviacion: "+0,4 DE", estado: "Aceptado" },
    ],
    mensuales: [
      { periodo: "Julio 2026", corridas: "18", promedio: "0,50", variacion: "3,5%", aceptacion: "100%" },
      { periodo: "Junio 2026", corridas: "30", promedio: "0,49", variacion: "3,8%", aceptacion: "96,7%" },
      { periodo: "Mayo 2026", corridas: "31", promedio: "0,50", variacion: "3,4%", aceptacion: "100%" },
    ],
  },
};

// Clases puramente visuales cuyo objetivo es diferenciar una corrida aceptada
// de otra que requiere revision, sin evaluar reglas de negocio en esta maqueta.
const clasesVisualesPorEstado = {
  Aceptado: "bg-status-ok-soft text-status-ok",
  Revisar: "bg-status-warn-soft text-status-warn",
};

export default async function PaginaAnalitosDeCategoria({ params }) {
  // Identificador cuyo objetivo es obtener la categoria indicada en la URL.
  const { categoria: identificadorCategoria } = await params;

  // Datos cuyo objetivo es completar el encabezado y las fichas de la vista.
  const categoria = obtenerCategoriaPorId(identificadorCategoria);
  const analitos = obtenerAnalitosPorCategoria(identificadorCategoria);

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
            Analisis QC / Controles / {categoria?.nombre ?? identificadorCategoria}
          </p>
          <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
            Seguimiento de analitos
          </h1>
          <p className="mb-0 mt-2 max-w-2xl text-[13.5px] leading-5 text-ink-muted">
            Consulta las ultimas corridas del dia y el comportamiento consolidado de cada mes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink-muted">
            Julio 2026
          </span>
          <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[12px] font-semibold text-accent">
            {analitos.length} {analitos.length === 1 ? "analito" : "analitos"}
          </span>
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted/60 px-4 py-3">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <p className="m-0 text-[12.5px] leading-5 text-ink-muted">
          Datos de muestra para validar la interfaz. Las mediciones, promedios y estados aun no estan conectados a una
          fuente real.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {analitos.map((analito, indiceAnalito) => {
          // Registro temporal cuyo objetivo es poblar ambas tablas del analito.
          const registrosDelAnalito = muestraRegistrosPorAnalito[analito.id];

          return (
            <article key={analito.id} className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(29,29,31,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-strong text-[12px] font-semibold text-white">
                    {String(indiceAnalito + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="m-0 truncate text-[15px] font-semibold text-ink">{analito.nombre}</h2>
                    <p className="m-0 mt-0.5 text-[12px] text-ink-muted">
                      {analito.id} · {analito.unidad}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-faint">Objetivo QC</p>
                  <p className="m-0 mt-0.5 text-[13px] font-semibold tabular-nums text-ink">
                    {registrosDelAnalito?.objetivo ?? "Sin objetivo definido"}
                  </p>
                </div>
              </div>

              {registrosDelAnalito ? (
                <div className="grid xl:grid-cols-[1.12fr_0.88fr]">
                  <SeccionRegistrosDiarios registros={registrosDelAnalito.diarios} />
                  <SeccionRegistrosMensuales registros={registrosDelAnalito.mensuales} unidad={analito.unidad} />
                </div>
              ) : (
                <p className="m-0 px-5 py-8 text-center text-[13px] text-ink-faint">
                  Aun no hay registros de muestra para este analito.
                </p>
              )}
            </article>
          );
        })}

        {analitos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line-strong px-5 py-12 text-center">
            <p className="m-0 text-sm font-medium text-ink-muted">Todavia no hay analitos cargados para esta categoria.</p>
          </div>
        ) : null}
      </div>

      <Link href={`/Controles/${identificadorCategoria}`} className="w-fit text-[13px] font-medium text-ink-muted hover:text-ink hover:underline">
        ← Volver a Controles
      </Link>
    </section>
  );
}

function SeccionRegistrosDiarios({ registros }) {
  return (
    <section className="min-w-0 border-b border-line p-5 xl:border-r xl:border-b-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-[13.5px] font-semibold text-ink">Registros diarios</h3>
          <p className="m-0 mt-0.5 text-[11.5px] text-ink-faint">Ultimas tres corridas procesadas</p>
        </div>
        <span className="rounded-md bg-surface-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
          Diario
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[540px] border-collapse">
          <thead>
            <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-3 py-2.5">Fecha</th>
              <th className="px-3 py-2.5">Resultado</th>
              <th className="px-3 py-2.5">Desviacion</th>
              <th className="px-3 py-2.5">Estado</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.fecha} className="border-t border-line">
                <td className="whitespace-nowrap px-3 py-3 text-[12.5px] font-medium text-ink">{registro.fecha}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[12.5px] tabular-nums text-ink-muted">{registro.resultado}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[12.5px] tabular-nums text-ink-muted">{registro.desviacion}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-[10.5px] font-semibold ${clasesVisualesPorEstado[registro.estado]}`}>
                    {registro.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SeccionRegistrosMensuales({ registros, unidad }) {
  return (
    <section className="min-w-0 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-[13.5px] font-semibold text-ink">Registros mensuales</h3>
          <p className="m-0 mt-0.5 text-[11.5px] text-ink-faint">Resumen de los ultimos tres meses</p>
        </div>
        <span className="rounded-md bg-accent-soft px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Mensual
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[510px] border-collapse">
          <thead>
            <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-3 py-2.5">Periodo</th>
              <th className="px-3 py-2.5 text-center">Corridas</th>
              <th className="px-3 py-2.5">Promedio</th>
              <th className="px-3 py-2.5">CV</th>
              <th className="px-3 py-2.5">Aceptacion</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.periodo} className="border-t border-line">
                <td className="whitespace-nowrap px-3 py-3 text-[12.5px] font-medium text-ink">{registro.periodo}</td>
                <td className="px-3 py-3 text-center text-[12.5px] tabular-nums text-ink-muted">{registro.corridas}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[12.5px] tabular-nums text-ink-muted">
                  {registro.promedio} <span className="text-[10px] text-ink-faint">{unidad}</span>
                </td>
                <td className="px-3 py-3 text-[12.5px] tabular-nums text-ink-muted">{registro.variacion}</td>
                <td className="px-3 py-3 text-[12.5px] font-semibold tabular-nums text-status-ok">{registro.aceptacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

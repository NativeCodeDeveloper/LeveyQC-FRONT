// Pantalla minima para que el link del sidebar no quede roto. La pantalla
// completa (analoga a Controles, con semaforo propio) es trabajo de Fase 2.

import Link from "next/link";

export default function CalibradoresPage() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-4">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Analisis QC</p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">Calibradores</h1>
      </div>
      <div className="rounded-lg border border-dashed border-line-strong bg-surface-muted p-8 text-center">
        <p className="m-0 text-[13.5px] text-ink-muted">
          Pantalla en construccion. La gestion completa de calibradores (analoga a Controles, con su propio semaforo
          de estado) queda para la Fase 2.
        </p>
      </div>
      <Link href="/" className="text-[13px] font-medium text-ink-muted hover:underline">
        Volver al inicio
      </Link>
    </section>
  );
}

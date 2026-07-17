// Semaforo de estado QC. No es Client Component por si mismo (no tiene
// estado propio): al importarlo desde una pagina que si es "use client" el
// bundler lo incluye igual en el bundle del cliente.
//
// Verde = en control (ok). Ambar = advertencia (regla 1-2s, hay que
// inspeccionar pero no se rechaza). Rojo = rechazado (alguna regla de
// rechazo de Westgard: 1-3s, 2-2s, R-4s, 4-1s o 10x). Ver src/lib/westgard.js.
//
// Los colores son un tono propio calibrado a mano (no el
// emerald/amber/red-500 por defecto de Tailwind), para que el estado se lea
// serio y no como una plantilla sin personalizar.

import { ESTADOS } from "@/lib/westgard";

const ESTILOS_POR_ESTADO = {
  [ESTADOS.OK]: { color: "bg-status-ok", texto: "En control" },
  [ESTADOS.ADVERTENCIA]: { color: "bg-status-warn", texto: "Advertencia" },
  [ESTADOS.RECHAZADO]: { color: "bg-status-alert", texto: "Rechazado" },
};

export default function EstadoSemaforo({ estado, reglas = [] }) {
  const estilo = ESTILOS_POR_ESTADO[estado] ?? ESTILOS_POR_ESTADO[ESTADOS.OK];
  const titulo = reglas.length > 0 ? `Regla(s) disparada(s): ${reglas.join(", ")}` : "Dentro de parametros";

  return (
    <span className="inline-flex items-center gap-2" title={titulo}>
      <span className={`h-2 w-2 rounded-full ${estilo.color}`} />
      <span className="text-[13px] font-medium text-ink-muted">{estilo.texto}</span>
    </span>
  );
}

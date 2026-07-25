"use client";

// Menu de usuario del topbar: nombre, laboratorio activo y rol, con acciones
// para cambiar de sesion y cerrar sesion. Lee todo de useSesion() (mock por
// ahora, ver src/lib/useSesion.js) para que conectar Clerk despues sea
// cambiar ese hook, no este componente.

import { useState } from "react";
import { cambiarSesion, cerrarSesion, useSesion } from "@/lib/useSesion";

export default function UserMenu() {
  const { usuario, organizacion } = useSesion();
  const [abierto, establecerAbierto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => establecerAbierto((actual) => !actual)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left transition hover:border-line hover:bg-surface-muted"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-strong text-[11px] font-bold text-white">
          {usuario.iniciales}
        </span>
        <span className="hidden sm:block">
          <span className="block text-[13px] font-semibold leading-tight text-ink">{organizacion.rol}</span>
          <span className="block text-[11.5px] leading-tight text-ink-muted">{organizacion.nombre}</span>
        </span>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform ${abierto ? "rotate-180" : ""}`}>
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto ? (
        <>
          <button
            type="button"
            aria-label="Cerrar menu"
            onClick={() => establecerAbierto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div role="menu" className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_35px_rgba(31,37,48,0.12)]">
            <div className="border-b border-line px-4 py-3.5">
              <p className="m-0 text-[13px] font-semibold text-ink">{usuario.nombre}</p>
              <p className="m-0 mt-0.5 text-[11.5px] text-ink-muted">{usuario.correo}</p>
              <p className="m-0 mt-2 inline-flex rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                {organizacion.rol} · {organizacion.nombre}
              </p>
            </div>
            <div className="flex flex-col p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  cambiarSesion();
                  establecerAbierto(false);
                }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-[12.5px] font-medium text-ink transition hover:bg-surface-muted"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7l-3 3 3 3" />
                  <path d="M4 10h12" />
                  <path d="M17 17l3-3-3-3" />
                  <path d="M20 14H8" />
                </svg>
                Cambiar sesión
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  cerrarSesion();
                  establecerAbierto(false);
                }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-[12.5px] font-medium text-status-alert transition hover:bg-status-alert-soft"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

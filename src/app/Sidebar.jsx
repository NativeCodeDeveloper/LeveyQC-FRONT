"use client";

// Sidebar de navegacion. Es Client Component (a diferencia del layout, que
// sigue siendo Server Component) porque necesita: saber la ruta activa real
// (usePathname) y poder expandir/colapsar los grupos con estado (useState).
// Maquetado 100% con Tailwind, con la paleta propia definida en
// globals.css (ink/line/canvas/accent/status-*), no los grises/colores por
// defecto de Tailwind.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categorias } from "@/lib/mockData";

// Estructura de navegacion del bloque "Analisis QC" (lo que pide el
// boceto): el titulo del grupo ahora es en si mismo un link a la pantalla
// resumen (/AnalisisQC), y despues Controles despliega las categorias,
// Calibradores es un link simple, y Configuraciones despliega sus 3
// pantallas.
const analisisQC = {
  titulo: "Analisis QC",
  href: "/AnalisisQC",
  items: [
    {
      etiqueta: "Controles",
      subitems: categorias.map((categoria) => ({
        etiqueta: categoria.nombre,
        href: `/Controles/${categoria.id}`,
      })),
    },
    { etiqueta: "Calibradores", href: "/Calibradores" },
    {
      etiqueta: "Configuraciones",
      subitems: [
        { etiqueta: "Ingreso Analitos", href: "/Configuraciones/Analitos" },
        { etiqueta: "Reglas de Westgard", href: "/Configuraciones/ReglasWestgard" },
        { etiqueta: "Ingreso Categorias", href: "/Configuraciones/Categorias" },
      ],
    },
  ],
};

// El resto del menu se deja tal cual estaba (sin rutas todavia), solo
// migrado de CSS a Tailwind.
const menu = {
  titulo: "Menu",
  items: [
    { etiqueta: "Proveedores" },
    { etiqueta: "Reservas" },
    { etiqueta: "Insumos" },
    { etiqueta: "Ubicacion" },
    { etiqueta: "Configuraciones" },
  ],
};

// Flecha que rota cuando el grupo esta expandido.
function FlechaGrupo({ abierto }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-150 ${
        abierto ? "rotate-90" : ""
      }`}
    >
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ItemDeNavegacion({ item, pathname, grupoAbierto, alternarGrupo }) {
  const tieneSubitems = Array.isArray(item.subitems) && item.subitems.length > 0;

  const claseBase =
    "flex min-h-[40px] w-full items-center rounded-md border px-3 text-[13.5px] font-medium transition";
  const claseInactiva =
    "border-transparent text-ink-muted hover:border-line hover:bg-surface-muted hover:text-ink";
  const claseActiva = "border-line-strong bg-accent-soft text-ink";

  if (tieneSubitems) {
    const abierto = grupoAbierto === item.etiqueta;
    const activo = item.subitems.some((sub) => pathname === sub.href);

    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => alternarGrupo(item.etiqueta)}
          aria-expanded={abierto}
          className={`${claseBase} justify-between ${activo ? claseActiva : claseInactiva}`}
        >
          <span>{item.etiqueta}</span>
          <FlechaGrupo abierto={abierto} />
        </button>

        {abierto ? (
          <div
            className="ml-[18px] flex flex-col gap-[2px] border-l border-line py-0.5 pl-3"
            aria-label={`${item.etiqueta} submenu`}
          >
            {item.subitems.map((sub) => (
              <Link
                key={sub.etiqueta}
                href={sub.href}
                className={`flex min-h-[28px] items-center rounded-md px-2.5 text-[13px] transition hover:bg-surface-muted hover:text-ink ${
                  pathname === sub.href ? "bg-surface-muted font-medium text-ink" : "text-ink-muted"
                }`}
              >
                {sub.etiqueta}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (item.href) {
    const activo = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link href={item.href} className={`${claseBase} ${activo ? claseActiva : claseInactiva}`}>
        {item.etiqueta}
      </Link>
    );
  }

  // Items que todavia no tienen pantalla propia (Proveedores, Reservas, etc):
  // se dejan como boton inerte para no romper la navegacion.
  return <button type="button" className={`${claseBase} text-left ${claseInactiva}`}>{item.etiqueta}</button>;
}

function GrupoDeNavegacion({ grupo, pathname, grupoAbierto, alternarGrupo }) {
  return (
    <nav className="flex flex-col gap-1" aria-label={grupo.titulo}>
      {grupo.href ? (
        <Link
          href={grupo.href}
          className={`mb-1 flex min-h-[38px] items-center rounded-md border px-3 text-[13.5px] font-semibold transition ${
            pathname === grupo.href
              ? "border-line-strong bg-accent-soft text-ink"
              : "border-transparent text-ink-muted hover:border-line hover:bg-surface-muted hover:text-ink"
          }`}
        >
          {grupo.titulo}
        </Link>
      ) : (
        <p className="mb-1.5 ml-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
          {grupo.titulo}
        </p>
      )}
      {grupo.items.map((item) => (
        <ItemDeNavegacion
          key={item.etiqueta}
          item={item}
          pathname={pathname}
          grupoAbierto={grupoAbierto}
          alternarGrupo={alternarGrupo}
        />
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  // Solo un grupo expandible puede estar abierto a la vez por seccion; se
  // guarda el nombre del grupo abierto en vez de un boolean por item.
  const [grupoAbiertoQC, setGrupoAbiertoQC] = useState("Controles");

  function alternarGrupoQC(etiqueta) {
    setGrupoAbiertoQC((actual) => (actual === etiqueta ? null : etiqueta));
  }

  return (
    <aside
      className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-line bg-white px-[16px] pb-5 pt-[26px] max-[860px]:static max-[860px]:h-auto"
      aria-label="Menu principal"
    >
      <div className="flex justify-center pb-6">
        <Image
          src="/logo2.png"
          alt="Levey Quality Control"
          width={248}
          height={99}
          priority
          className="h-auto w-[168px] object-contain"
        />
      </div>

      <div className="flex flex-col gap-5 overflow-y-auto">
        <GrupoDeNavegacion
          grupo={analisisQC}
          pathname={pathname}
          grupoAbierto={grupoAbiertoQC}
          alternarGrupo={alternarGrupoQC}
        />
        <GrupoDeNavegacion grupo={menu} pathname={pathname} grupoAbierto={null} alternarGrupo={() => {}} />
      </div>

      <div className="mt-auto flex items-center gap-2.5 rounded-md border border-line bg-canvas p-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-status-ok" />
        <div>
          <p className="m-0 text-[12.5px] font-semibold leading-tight text-ink">Control interno</p>
          <span className="mt-0.5 block text-[11.5px] text-ink-muted">Panel operativo</span>
        </div>
      </div>
    </aside>
  );
}

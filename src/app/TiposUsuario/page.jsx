import {
  Check,
  ChevronDown,
  LockKeyhole,
  Mail,
  Pencil,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import Card from "@/app/components/Card";

const tiposUsuario = [
  {
    id: "ROL-001",
    nombre: "Administrador",
    descripcion: "Acceso completo a la configuración y operación del laboratorio.",
    usuarios: 3,
    estado: "Activo",
    actualizado: "Hoy, 09:42",
    iniciales: "AD",
    color: "bg-[#1d1d1f]",
  },
  {
    id: "ROL-002",
    nombre: "Supervisor de calidad",
    descripcion: "Supervisa resultados, reglas Westgard y acciones correctivas.",
    usuarios: 8,
    estado: "Activo",
    actualizado: "Ayer, 16:18",
    iniciales: "SC",
    color: "bg-[#5b3ec8]",
  },
  {
    id: "ROL-003",
    nombre: "Tecnólogo clínico",
    descripcion: "Registra controles y consulta el desempeño analítico.",
    usuarios: 24,
    estado: "Activo",
    actualizado: "22 ago 2026",
    iniciales: "TC",
    color: "bg-[#15803d]",
  },
  {
    id: "ROL-004",
    nombre: "Solo lectura",
    descripcion: "Consulta reportes e indicadores sin modificar información.",
    usuarios: 6,
    estado: "Inactivo",
    actualizado: "18 ago 2026",
    iniciales: "SL",
    color: "bg-[#8b929b]",
  },
];

const permisosDisponibles = [
  { nombre: "Gestión de usuarios", detalle: "Crear, editar y desactivar usuarios" },
  { nombre: "Configuración del laboratorio", detalle: "Administrar categorías, analitos y proveedores" },
  { nombre: "Control de calidad", detalle: "Registrar y revisar resultados QC" },
  { nombre: "Reportes y exportaciones", detalle: "Consultar y descargar informes" },
];

export default function TiposUsuarioPage() {
  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="m-0 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Administración / Accesos
          </p>
          <h1 className="m-0 text-[23px] font-semibold tracking-[-0.025em] text-ink sm:text-[28px]">
            Tipos de usuario
          </h1>
          <p className="m-0 mt-2 max-w-2xl text-[13px] leading-5 text-ink-muted">
            Define los niveles de acceso que utiliza tu laboratorio para organizar el trabajo del equipo.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-accent-strong px-4 text-[12px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.14)] transition hover:bg-[#27272a]"
        >
          <span className="text-[17px] font-normal leading-none">+</span>
          Nuevo tipo
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-ink">
              <ShieldCheck className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Configuración</span>
          </div>
          <p className="m-0 mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">{tiposUsuario.length}</p>
          <p className="m-0 mt-1 text-[11.5px] text-ink-muted">Tipos de usuario creados</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
              <Users className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Equipo</span>
          </div>
          <p className="m-0 mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">41</p>
          <p className="m-0 mt-1 text-[11.5px] text-ink-muted">Usuarios asignados a un tipo</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-status-ok-soft text-status-ok">
              <Check className="size-[18px]" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Estado</span>
          </div>
          <p className="m-0 mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">3</p>
          <p className="m-0 mt-1 text-[11.5px] text-ink-muted">Tipos disponibles para asignar</p>
        </Card>
      </div>

      <Card as="section">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="m-0 text-[14px] font-semibold text-ink">Roles disponibles</h2>
            <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Administra los permisos generales para cada grupo.</p>
          </div>

          <label className="flex h-9 w-full items-center gap-2 rounded-md border border-line-strong bg-white px-2.5 text-ink-muted sm:w-[230px]">
            <Search className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">Buscar tipo de usuario</span>
            <input
              type="search"
              placeholder="Buscar tipo..."
              className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-ink-faint"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse">
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-5 py-3 font-semibold">Tipo de usuario</th>
                <th className="px-4 py-3 font-semibold">Usuarios</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Última actualización</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {tiposUsuario.map((tipo) => (
                <tr key={tipo.id} className="border-t border-line align-middle transition hover:bg-[#fbfbfc]">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tipo.color} text-[10px] font-bold text-white`}>
                        {tipo.iniciales}
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 text-[12.5px] font-semibold text-ink">{tipo.nombre}</p>
                        <p className="m-0 mt-1 max-w-[360px] truncate text-[11px] text-ink-muted">{tipo.descripcion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12px] font-medium text-ink-muted">{tipo.usuarios} personas</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${tipo.estado === "Activo" ? "bg-status-ok-soft text-status-ok" : "bg-status-neutral-soft text-status-neutral"}`}>
                      <span className={`size-1.5 rounded-full ${tipo.estado === "Activo" ? "bg-status-ok" : "bg-status-neutral"}`} aria-hidden="true" />
                      {tipo.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[11.5px] text-ink-muted">{tipo.actualizado}</td>
                  <td className="px-4 py-4 text-right">
                    <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-white px-2.5 text-[11px] font-semibold text-ink-muted transition hover:border-ink hover:text-ink">
                      <Pencil className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#101114]/45 p-4 backdrop-blur-[2px] sm:p-6">
        <div role="dialog" aria-modal="true" aria-labelledby="titulo-edicion-tipo" className="my-auto w-full max-w-[570px] overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_80px_rgba(16,17,20,0.24)]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-strong text-white">
                <ShieldCheck className="size-[19px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Editar tipo de usuario</p>
                <h2 id="titulo-edicion-tipo" className="m-0 mt-1 text-[18px] font-semibold tracking-[-0.02em] text-ink">Administrador</h2>
                <p className="m-0 mt-1 text-[11.5px] leading-5 text-ink-muted">Actualiza los datos y permisos asociados a este perfil.</p>
              </div>
            </div>
            <button type="button" aria-label="Cerrar ventana de edición" className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition hover:bg-surface-muted hover:text-ink">
              <X className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-[min(620px,calc(100vh-180px))] overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11.5px] font-semibold text-ink-muted">Nombre del tipo</span>
                <input defaultValue="Administrador" className="h-10 rounded-md border border-line-strong bg-white px-3 text-[12.5px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft" />
              </label>

              <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11.5px] font-semibold text-ink-muted">Descripción</span>
                <textarea defaultValue="Acceso completo a la configuración y operación del laboratorio." rows={3} className="resize-none rounded-md border border-line-strong bg-white px-3 py-2.5 text-[12.5px] leading-5 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft" />
              </label>

              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11.5px] font-semibold text-ink-muted">Estado</span>
                <span className="relative">
                  <select defaultValue="Activo" className="h-10 w-full appearance-none rounded-md border border-line-strong bg-white px-3 pr-9 text-[12.5px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft">
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" strokeWidth={1.8} aria-hidden="true" />
                </span>
              </label>

              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11.5px] font-semibold text-ink-muted">Código interno</span>
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" strokeWidth={1.8} aria-hidden="true" />
                  <input defaultValue="ROL-001" readOnly className="h-10 w-full rounded-md border border-line bg-surface-muted pl-9 pr-3 font-mono text-[11.5px] text-ink-muted outline-none" />
                </span>
              </label>
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="m-0 text-[12.5px] font-semibold text-ink">Permisos del tipo</h3>
                  <p className="m-0 mt-1 text-[10.5px] text-ink-faint">Selecciona los módulos que podrá utilizar este grupo.</p>
                </div>
                <span className="rounded-full bg-accent-soft px-2 py-1 text-[9.5px] font-semibold text-accent">4 permisos</span>
              </div>

              <div className="mt-3 divide-y divide-line overflow-hidden rounded-lg border border-line">
                {permisosDisponibles.map((permiso) => (
                  <label key={permiso.nombre} className="flex cursor-pointer items-center gap-3 px-3.5 py-3 transition hover:bg-surface-muted">
                    <input type="checkbox" defaultChecked className="size-4 accent-[#18181b]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11.5px] font-semibold text-ink">{permiso.nombre}</span>
                      <span className="mt-0.5 block text-[10.5px] leading-4 text-ink-faint">{permiso.detalle}</span>
                    </span>
                    <Mail className="size-3.5 shrink-0 text-ink-faint" strokeWidth={1.7} aria-hidden="true" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line bg-surface-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button type="button" className="h-10 rounded-md border border-line-strong bg-white px-4 text-[12px] font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cancelar</button>
            <button type="button" className="h-10 rounded-md bg-accent-strong px-4 text-[12px] font-semibold text-white transition hover:bg-[#27272a]">Guardar cambios</button>
          </div>
        </div>
      </div>
    </section>
  );
}

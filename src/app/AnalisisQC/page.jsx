"use client";

// Pantalla operativa de Analisis QC. La autenticacion, los resultados y la
// auditoria son ficticios y se guardan unicamente en localStorage.

import Link from "next/link";
import { useMemo, useState } from "react";
import { obtenerAnalitoPorId } from "@/lib/mockData";
import { useRegistrarResultado, useTodosLosControles } from "@/lib/useControlesStore";

// Usuario de muestra cuyo objetivo es habilitar el flujo visual de registro
// sin conectarse a un servicio real de autenticacion.
const usuarioDeMuestra = {
  usuario: "bolate",
  contrasena: "123123",
  nombre: "Beatriz Olate",
  iniciales: "BO",
};

function CampoBusqueda({ etiqueta, valor, alCambiar, marcador, tipo = "text" }) {
  return (
    <label className="flex min-w-[170px] flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-muted">{etiqueta}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        placeholder={marcador}
        className="h-9 rounded-md border border-line-strong bg-white px-3 text-[13px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
      />
    </label>
  );
}

function PanelAutenticacion({ usuarioAutenticado, alAutenticar, alCerrarSesion, mensajeError }) {
  // Credenciales escritas cuyo objetivo es controlar el formulario ficticio.
  const [nombreUsuarioIngresado, establecerNombreUsuarioIngresado] = useState("");
  const [contrasenaIngresada, establecerContrasenaIngresada] = useState("");

  function manejarEnvio(evento) {
    evento.preventDefault();
    alAutenticar(nombreUsuarioIngresado, contrasenaIngresada);
  }

  if (usuarioAutenticado) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#cde2d6] bg-[#f2f8f5] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-status-ok text-[11px] font-bold text-white">
            {usuarioAutenticado.iniciales}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="m-0 text-[13px] font-semibold text-ink">Registro habilitado</p>
              <span className="size-1.5 rounded-full bg-status-ok" aria-hidden="true" />
            </div>
            <p className="m-0 mt-0.5 text-[12px] text-ink-muted">
              {usuarioAutenticado.nombre} · @{usuarioAutenticado.usuario}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={alCerrarSesion}
          className="rounded-md border border-[#bdd6c8] bg-white px-3 py-2 text-[11.5px] font-semibold text-ink-muted transition hover:border-status-ok hover:text-status-ok"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_10px_30px_rgba(31,37,48,0.06)]">
      <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
        <div className="relative overflow-hidden bg-accent-strong p-5 text-white sm:p-6">
          <div className="absolute -right-10 -top-12 size-36 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-16 right-10 size-28 rounded-full bg-white/[0.04]" aria-hidden="true" />
          <span className="mb-7 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" />
              <rect x="5" y="10" width="14" height="10" rx="2.5" />
              <path d="M12 14v2.5" />
            </svg>
          </span>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Trazabilidad QC</p>
          <h2 className="m-0 mt-2 text-[18px] font-semibold tracking-tight">Identificación requerida</h2>
          <p className="m-0 mt-2 max-w-sm text-[12.5px] leading-5 text-white/65">
            Identifícate antes de ingresar resultados. Cada cambio quedará asociado al usuario autenticado.
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="m-0 text-[14px] font-semibold text-ink">Acceso de demostración</h3>
              <p className="m-0 mt-1 text-[11.5px] text-ink-faint">Usa las credenciales indicadas para continuar.</p>
            </div>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10.5px] font-semibold text-accent">Solo maqueta</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">Usuario</span>
              <input
                value={nombreUsuarioIngresado}
                onChange={(evento) => establecerNombreUsuarioIngresado(evento.target.value)}
                autoComplete="username"
                placeholder="bolate"
                className="h-10 rounded-md border border-line-strong px-3 text-[13px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">Contraseña</span>
              <input
                type="password"
                value={contrasenaIngresada}
                onChange={(evento) => establecerContrasenaIngresada(evento.target.value)}
                autoComplete="current-password"
                placeholder="123123"
                className="h-10 rounded-md border border-line-strong px-3 text-[13px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-accent-strong px-5 text-[12px] font-semibold text-white transition hover:bg-[#14181e]"
            >
              Ingresar
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-[11px] text-ink-faint">
              Usuario: <strong className="font-semibold text-ink-muted">bolate</strong> · Contraseña:{" "}
              <strong className="font-semibold text-ink-muted">123123</strong>
            </p>
            <p className="m-0 text-[11px] font-medium text-status-alert" role="alert">
              {mensajeError}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function PaginaAnalisisQC() {
  const controles = useTodosLosControles();
  const registrarResultado = useRegistrarResultado();

  // Estados cuyo objetivo es filtrar la tabla de controles disponibles.
  const [busquedaFecha, establecerBusquedaFecha] = useState("");
  const [busquedaLote, establecerBusquedaLote] = useState("");
  const [nivelSeleccionado, establecerNivelSeleccionado] = useState("todos");
  const [busquedaAnalito, establecerBusquedaAnalito] = useState("");
  const [busquedaControl, establecerBusquedaControl] = useState("");

  // Valores pendientes cuyo objetivo es conservar cada resultado antes de
  // que el usuario autenticado confirme su registro.
  const [valoresPendientes, establecerValoresPendientes] = useState({});

  // Estados de acceso cuyo objetivo es simular la autenticacion y comunicar
  // errores o confirmaciones sin usar un backend.
  const [usuarioAutenticado, establecerUsuarioAutenticado] = useState(null);
  const [mensajeAutenticacion, establecerMensajeAutenticacion] = useState("");
  const [mensajeRegistro, establecerMensajeRegistro] = useState("");

  const nivelesDisponibles = useMemo(() => {
    const nombresDeNiveles = new Set();
    controles.forEach((control) => control.niveles.forEach((nivel) => nombresDeNiveles.add(nivel.nombre)));
    return [...nombresDeNiveles];
  }, [controles]);

  // Filas cuyo objetivo es representar cada combinacion de control y nivel,
  // incluida la trazabilidad de su modificacion mas reciente.
  const filasDeControl = useMemo(() => {
    return controles.flatMap((control) => {
      const analito = obtenerAnalitoPorId(control.analitoId);
      return control.niveles.map((nivel) => ({
        clave: `${control.id}:${nivel.id}`,
        control,
        nivel,
        nombreAnalito: analito?.nombre ?? "Analito sin nombre",
        valorAnterior: nivel.valores[nivel.valores.length - 1],
        coeficienteVariacion: nivel.media ? ((nivel.sd / nivel.media) * 100).toFixed(1) : "-",
        fechaUltimoControl: control.fechaUltimoRegistro ?? "19-07-2026",
        horaUltimoControl: control.horaUltimoRegistro ?? "Registro inicial",
        nombreResponsable: control.nombreUsuarioUltimaModificacion ?? control.responsable ?? "Sin responsable",
        usuarioResponsable: control.usuarioUltimaModificacion ?? "muestra inicial",
      }));
    });
  }, [controles]);

  const filasFiltradas = filasDeControl.filter((fila) => {
    const fechaBuscada = busquedaFecha.split("-").reverse().join("").replace(/\D/g, "");
    const fechaDelControl = fila.fechaUltimoControl.replace(/\D/g, "");

    if (nivelSeleccionado !== "todos" && fila.nivel.nombre !== nivelSeleccionado) return false;
    if (fechaBuscada && fechaBuscada !== fechaDelControl) return false;
    if (busquedaLote && !fila.control.lote.toLowerCase().includes(busquedaLote.toLowerCase())) return false;
    if (busquedaAnalito && !fila.nombreAnalito.toLowerCase().includes(busquedaAnalito.toLowerCase())) return false;
    if (busquedaControl && !fila.control.nombre.toLowerCase().includes(busquedaControl.toLowerCase())) return false;
    return true;
  });

  function autenticarUsuario(nombreUsuario, contrasena) {
    const credencialesValidas = nombreUsuario.trim().toLowerCase() === usuarioDeMuestra.usuario && contrasena === usuarioDeMuestra.contrasena;
    if (!credencialesValidas) {
      establecerMensajeAutenticacion("Usuario o contraseña incorrectos.");
      return;
    }

    establecerUsuarioAutenticado(usuarioDeMuestra);
    establecerMensajeAutenticacion("");
  }

  function cerrarSesion() {
    establecerUsuarioAutenticado(null);
    establecerValoresPendientes({});
    establecerMensajeRegistro("");
  }

  function manejarCambioValor(clave, valor) {
    establecerValoresPendientes((valoresActuales) => ({ ...valoresActuales, [clave]: valor }));
  }

  function guardarResultado(fila) {
    if (!usuarioAutenticado) {
      establecerMensajeAutenticacion("Debes identificarte antes de registrar un resultado.");
      return;
    }

    const valorTexto = valoresPendientes[fila.clave];
    const valorNumerico = Number(valorTexto);
    if (!valorTexto || Number.isNaN(valorNumerico)) {
      establecerMensajeRegistro("Ingresa un valor numérico válido.");
      return;
    }

    registrarResultado(fila.control.id, fila.nivel.id, valorNumerico, usuarioAutenticado);
    establecerValoresPendientes((valoresActuales) => {
      const copiaDeValores = { ...valoresActuales };
      delete copiaDeValores[fila.clave];
      return copiaDeValores;
    });
    establecerMensajeRegistro(
      `Control de ${fila.nombreAnalito} registrado por ${usuarioAutenticado.nombre}.`
    );
  }

  return (
    <section className="mx-auto flex max-w-[1320px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Control de calidad · Operación diaria</p>
          <h1 className="m-0 text-[23px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">Análisis QC</h1>
          <p className="m-0 mt-2 max-w-2xl text-[13px] leading-5 text-ink-muted">
            Registra resultados por analito y nivel con identificación del responsable y trazabilidad de cada cambio.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[11.5px] text-ink-muted">
          <span className="size-2 rounded-full bg-status-ok" aria-hidden="true" />
          {controles.length} controles disponibles
        </div>
      </header>

      <PanelAutenticacion
        usuarioAutenticado={usuarioAutenticado}
        alAutenticar={autenticarUsuario}
        alCerrarSesion={cerrarSesion}
        mensajeError={mensajeAutenticacion}
      />

      {mensajeRegistro ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#cde2d6] bg-[#f2f8f5] px-4 py-3" role="status">
          <p className="m-0 text-[12.5px] font-medium text-status-ok">{mensajeRegistro}</p>
          <button type="button" onClick={() => establecerMensajeRegistro("")} className="text-[11px] font-semibold text-status-ok hover:underline">
            Cerrar
          </button>
        </div>
      ) : null}

      <section className="rounded-xl border border-line bg-white">
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-[14px] font-semibold text-ink">Registro de controles</h2>
              <p className="m-0 mt-1 text-[11.5px] text-ink-faint">Filtra, ingresa un resultado y consulta el historial del nivel.</p>
            </div>
            {!usuarioAutenticado ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-status-warn-soft px-2.5 py-1 text-[10.5px] font-semibold text-status-warn">
                <span className="size-1.5 rounded-full bg-status-warn" aria-hidden="true" />
                Carga bloqueada
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <CampoBusqueda etiqueta="Fecha del control" tipo="date" valor={busquedaFecha} alCambiar={establecerBusquedaFecha} />
            <CampoBusqueda etiqueta="Lote" valor={busquedaLote} alCambiar={establecerBusquedaLote} marcador="Ej. GL0090" />
            <CampoBusqueda etiqueta="Analito" valor={busquedaAnalito} alCambiar={establecerBusquedaAnalito} marcador="Ej. Glucosa" />
            <CampoBusqueda etiqueta="Control" valor={busquedaControl} alCambiar={establecerBusquedaControl} marcador="Ej. BioRad" />
            <label className="flex min-w-[170px] flex-col gap-1.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">Nivel</span>
              <select
                value={nivelSeleccionado}
                onChange={(evento) => establecerNivelSeleccionado(evento.target.value)}
                className="h-9 rounded-md border border-line-strong bg-white px-3 text-[13px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
              >
                <option value="todos">Todos los niveles</option>
                {nivelesDisponibles.map((nombreNivel) => (
                  <option key={nombreNivel} value={nombreNivel}>{nombreNivel}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[22%]" />
              <col className="w-[13%]" />
              <col className="w-[17%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-4 py-3">Analito / nivel</th>
                <th className="px-4 py-3">Ingresar resultado</th>
                <th className="px-4 py-3">Parámetros QC</th>
                <th className="px-4 py-3">Control utilizado</th>
                <th className="px-4 py-3">Último control realizado</th>
                <th className="px-4 py-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filasFiltradas.map((fila) => (
                <tr key={fila.clave} className="border-t border-line align-middle transition hover:bg-[#fbfbfc]">
                  <td className="px-4 py-3.5">
                    <p className="m-0 text-[13px] font-semibold text-ink">{fila.nombreAnalito}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">{fila.nivel.nombre}</span>
                      <span className="text-[11px] text-ink-faint">{fila.nivel.unidad}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={valoresPendientes[fila.clave] ?? ""}
                        onChange={(evento) => manejarCambioValor(fila.clave, evento.target.value)}
                        placeholder={String(fila.valorAnterior)}
                        disabled={!usuarioAutenticado}
                        aria-label={`Nuevo resultado para ${fila.nombreAnalito}, ${fila.nivel.nombre}`}
                        className="h-9 w-24 rounded-sm border border-line-strong px-2.5 text-[12.5px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-faint"
                      />
                      <button
                        type="button"
                        onClick={() => guardarResultado(fila)}
                        disabled={!usuarioAutenticado || !valoresPendientes[fila.clave]}
                        className="h-9 w-[88px] shrink-0 whitespace-nowrap rounded-sm bg-accent-strong px-2 text-[11px] font-semibold text-white transition hover:bg-[#14181e] disabled:cursor-not-allowed disabled:bg-line-strong"
                      >
                        Registrar
                      </button>
                    </div>
                    <p className="m-0 mt-1.5 text-[10.5px] text-ink-faint">Anterior: {fila.valorAnterior} {fila.nivel.unidad}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="m-0 text-[12px] font-medium tabular-nums text-ink">Media {fila.nivel.media}</p>
                    <p className="m-0 mt-1 text-[11px] tabular-nums text-ink-muted">DE {fila.nivel.sd.toFixed(2)} · CV {fila.coeficienteVariacion}%</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="m-0 max-w-[190px] truncate text-[12px] font-medium text-ink">{fila.control.nombre}</p>
                    <p className="m-0 mt-1 text-[11px] text-ink-muted">Lote {fila.control.lote}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="m-0 text-[12px] font-medium text-ink">{fila.fechaUltimoControl}</p>
                    <p className="m-0 mt-1 text-[11px] text-ink-muted">{fila.horaUltimoControl} · {fila.nombreResponsable}</p>
                    <p className="m-0 mt-0.5 text-[10px] text-ink-faint">@{fila.usuarioResponsable}</p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/AnalisisQC/${fila.control.id}/${fila.nivel.id}`}
                      className="inline-flex h-9 w-[88px] items-center justify-center whitespace-nowrap rounded-sm border border-line-strong bg-white px-2 text-[11px] font-semibold text-ink transition hover:border-accent hover:bg-accent-soft"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
              {filasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-ink-faint">No hay controles que coincidan con los filtros.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

"use client";

// Pantalla operativa de Analisis QC. La autenticacion, los resultados y la
// auditoria son ficticios y se guardan unicamente en localStorage.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { obtenerAnalitoPorId } from "@/lib/mockData";
import { useRegistrarResultado, useTodosLosControles } from "@/lib/useControlesStore";
import { COMENTARIOS_SUGERIDOS, NIVELES_VALIDACION, calcularSesgo, clasificarValidacion } from "@/lib/westgard";
import Card from "@/app/components/Card";

// Textos y estilos cuyo objetivo es traducir la clasificacion por puntaje z
// (ver clasificarValidacion en westgard.js) a la columna/badge "Validado":
// verde dentro de 2 DE, amarillo entre 2 y 3 DE, rojo sobre 3 DE.
const presentacionPorValidacion = {
  [NIVELES_VALIDACION.VALIDADO]: { texto: "Validado", clase: "bg-status-ok-soft text-status-ok", punto: "bg-status-ok" },
  [NIVELES_VALIDACION.REVISAR]: { texto: "Revisar", clase: "bg-status-warn-soft text-status-warn", punto: "bg-status-warn" },
  [NIVELES_VALIDACION.RECHAZADO]: { texto: "Rechazado", clase: "bg-status-alert-soft text-status-alert", punto: "bg-status-alert" },
};

// Orden de gravedad cuyo objetivo es elegir, de todos los niveles de un
// control, cual clasificacion mostrar como estado general de la fila
// agrupada (el peor de los niveles manda).
const GRAVEDAD_VALIDACION = {
  [NIVELES_VALIDACION.VALIDADO]: 0,
  [NIVELES_VALIDACION.REVISAR]: 1,
  [NIVELES_VALIDACION.RECHAZADO]: 2,
};

function peorValidacionDelGrupo(filas) {
  return filas.reduce((peor, fila) =>
    GRAVEDAD_VALIDACION[fila.validacion.clasificacion] > GRAVEDAD_VALIDACION[peor.clasificacion] ? fila.validacion : peor,
  filas[0].validacion);
}

// Arma los datos derivados de un nivel puntual (analito + control + nivel):
// valor anterior, sesgo, clasificacion de validacion, etc. Funcion pura,
// sin hooks, para poder reusarla tanto en la fila agrupada de la tabla como
// en las tarjetas del popup de niveles.
function construirFilaDeNivel(control, nivel, nombreAnalito) {
  const valorAnterior = nivel.valores[nivel.valores.length - 1];
  return {
    clave: `${control.id}:${nivel.id}`,
    control,
    nivel,
    nombreAnalito,
    valorAnterior,
    coeficienteVariacion: nivel.media ? ((nivel.sd / nivel.media) * 100).toFixed(1) : "-",
    sesgo: calcularSesgo(valorAnterior, nivel),
    validacion: clasificarValidacion(valorAnterior, nivel),
    fechaUltimoControl: control.fechaUltimoRegistro ?? "19-07-2026",
    horaUltimoControl: control.horaUltimoRegistro ?? "Registro inicial",
    nombreResponsable: control.nombreUsuarioUltimaModificacion ?? control.responsable ?? "Sin responsable",
    usuarioResponsable: control.usuarioUltimaModificacion ?? "muestra inicial",
  };
}

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
    <Card as="section">
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-accent-strong px-5 text-[12px] font-semibold text-white transition hover:bg-[#27272a]"
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
    </Card>
  );
}

// Tarjeta de un nivel puntual dentro del popup: mismo campo de registro,
// parametros QC, badge de validacion y comentario que antes vivian en la
// fila de la tabla, ahora agrupados por analito en vez de amontonados.
function TarjetaDeNivel({ fila, usuarioAutenticado, valorPendiente, alCambiarValor, alRegistrar, comentario, alCambiarComentario }) {
  const presentacion = presentacionPorValidacion[fila.validacion.clasificacion];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-white/80">
            {fila.nivel.nombre}
          </span>
          <span className="text-[11px] text-white/40">{fila.nivel.unidad}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${presentacion.clase}`}>
          <span className={`size-1.5 rounded-full ${presentacion.punto}`} aria-hidden="true" />
          {presentacion.texto}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/5 bg-black/30 p-3 font-mono text-[11px] tabular-nums text-white/70">
        <div>
          <p className="m-0 text-[9px] uppercase tracking-wide text-white/35">Media</p>
          <p className="m-0 mt-0.5 text-white">{fila.nivel.media}</p>
        </div>
        <div>
          <p className="m-0 text-[9px] uppercase tracking-wide text-white/35">DE · CV</p>
          <p className="m-0 mt-0.5 text-white">{fila.nivel.sd.toFixed(2)} · {fila.coeficienteVariacion}%</p>
        </div>
        <div>
          <p className="m-0 text-[9px] uppercase tracking-wide text-white/35">Sesgo · z</p>
          <p className="m-0 mt-0.5 text-white">
            {fila.sesgo > 0 ? "+" : ""}{fila.sesgo.toFixed(1)}% · {fila.validacion.z.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            value={valorPendiente ?? ""}
            onChange={(evento) => alCambiarValor(evento.target.value)}
            placeholder={String(fila.valorAnterior)}
            disabled={!usuarioAutenticado}
            aria-label={`Nuevo resultado para ${fila.nombreAnalito}, ${fila.nivel.nombre}`}
            className="h-9 flex-1 rounded-md border border-white/15 bg-black/40 px-2.5 text-[12.5px] text-white outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <button
            type="button"
            onClick={alRegistrar}
            disabled={!usuarioAutenticado || !valorPendiente}
            className="h-9 shrink-0 whitespace-nowrap rounded-md bg-white px-3 text-[11px] font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/35"
          >
            Registrar
          </button>
        </div>
        <p className="m-0 mt-1.5 text-[10px] text-white/35">Anterior: {fila.valorAnterior} {fila.nivel.unidad}</p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[9.5px] font-semibold uppercase tracking-wide text-white/35">Comentario</span>
        <textarea
          value={comentario}
          onChange={(evento) => alCambiarComentario(evento.target.value)}
          disabled={!usuarioAutenticado}
          rows={2}
          aria-label={`Comentario para ${fila.nombreAnalito}, ${fila.nivel.nombre}`}
          className="w-full resize-none rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 text-[11.5px] leading-4 text-white/85 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </label>

      <Link
        href={`/AnalisisQC/${fila.control.id}/${fila.nivel.id}`}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-white/50 transition hover:text-white"
      >
        Ver detalle completo →
      </Link>
    </div>
  );
}

// Popup "centro de control" que agrupa todos los niveles de un mismo
// analito/control: reemplaza la fila-por-nivel amontonada por una vista
// enfocada que se abre a demanda. Paleta oscura reusando los tokens del
// sidebar (globals.css) para que se sienta parte del mismo sistema, no un
// modal generico.
function PopupNiveles({ grupo, alCerrar, ...propsDeTarjeta }) {
  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.key === "Escape") alCerrar();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [alCerrar]);

  if (!grupo) return null;
  const { control, nombreAnalito, filas } = grupo;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Niveles de ${nombreAnalito}`}
      onClick={alCerrar}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10] text-white shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent px-6 py-5">
          <div>
            <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Analito seleccionado</p>
            <h2 className="m-0 mt-1 text-[20px] font-semibold tracking-tight text-white">{nombreAnalito}</h2>
            <p className="m-0 mt-1.5 text-[12px] text-white/55">
              {control.nombre} · Lote {control.lote} · {filas.length} {filas.length === 1 ? "nivel" : "niveles"}
            </p>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-6 sm:grid-cols-2">
          {filas.map((fila) => (
            <TarjetaDeNivel
              key={fila.clave}
              fila={fila}
              usuarioAutenticado={propsDeTarjeta.usuarioAutenticado}
              valorPendiente={propsDeTarjeta.valoresPendientes[fila.clave]}
              alCambiarValor={(valor) => propsDeTarjeta.manejarCambioValor(fila.clave, valor)}
              alRegistrar={() => propsDeTarjeta.guardarResultado(fila)}
              comentario={propsDeTarjeta.comentarioDeFila(fila)}
              alCambiarComentario={(comentario) => propsDeTarjeta.manejarCambioComentario(fila.clave, comentario)}
            />
          ))}
        </div>
      </div>
    </div>
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

  // Comentarios editados a mano por el usuario, por fila. Mientras una fila
  // no tenga entrada aca se usa el comentario sugerido segun su
  // clasificacion (ver comentarioDeFila mas abajo): el usuario "complementa"
  // la sugerencia en vez de partir de un campo vacio.
  const [comentariosEditados, establecerComentariosEditados] = useState({});

  // Control cuyo popup de niveles esta abierto (o null si esta cerrado).
  const [controlModalAbierto, establecerControlModalAbierto] = useState(null);

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
  // incluida la trazabilidad de su modificacion mas reciente. Es la base
  // tanto de los filtros como de los grupos que arma la tabla.
  const filasDeControl = useMemo(() => {
    return controles.flatMap((control) => {
      const analito = obtenerAnalitoPorId(control.analitoId);
      const nombreAnalito = analito?.nombre ?? "Analito sin nombre";
      return control.niveles.map((nivel) => construirFilaDeNivel(control, nivel, nombreAnalito));
    });
  }, [controles]);

  const filasFiltradas = useMemo(() => {
    return filasDeControl.filter((fila) => {
      const fechaBuscada = busquedaFecha.split("-").reverse().join("").replace(/\D/g, "");
      const fechaDelControl = fila.fechaUltimoControl.replace(/\D/g, "");

      if (nivelSeleccionado !== "todos" && fila.nivel.nombre !== nivelSeleccionado) return false;
      if (fechaBuscada && fechaBuscada !== fechaDelControl) return false;
      if (busquedaLote && !fila.control.lote.toLowerCase().includes(busquedaLote.toLowerCase())) return false;
      if (busquedaAnalito && !fila.nombreAnalito.toLowerCase().includes(busquedaAnalito.toLowerCase())) return false;
      if (busquedaControl && !fila.control.nombre.toLowerCase().includes(busquedaControl.toLowerCase())) return false;
      return true;
    });
  }, [filasDeControl, busquedaFecha, busquedaLote, busquedaAnalito, busquedaControl, nivelSeleccionado]);

  // Un control agrupa todos sus niveles (sus filas siempre viven juntas, ver
  // mockData.js), asi que cada control se muestra en una sola fila de tabla.
  // El grupo siempre trae TODOS sus niveles (no solo los que matchean el
  // filtro de nivel) para que el popup muestre el analito completo.
  const gruposPorControl = useMemo(() => {
    const mapa = new Map();
    filasDeControl.forEach((fila) => {
      if (!mapa.has(fila.control.id)) {
        mapa.set(fila.control.id, { control: fila.control, nombreAnalito: fila.nombreAnalito, filas: [] });
      }
      mapa.get(fila.control.id).filas.push(fila);
    });
    return mapa;
  }, [filasDeControl]);

  const gruposFiltrados = useMemo(() => {
    const idsControlVisibles = new Set(filasFiltradas.map((fila) => fila.control.id));
    return [...gruposPorControl.values()].filter((grupo) => idsControlVisibles.has(grupo.control.id));
  }, [gruposPorControl, filasFiltradas]);

  const grupoModalAbierto = controlModalAbierto ? gruposPorControl.get(controlModalAbierto) ?? null : null;

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

  // Comentario efectivo de una fila: lo que el usuario haya escrito, o si
  // todavia no toco el campo, la sugerencia segun su clasificacion actual
  // (asi la sugerencia se actualiza sola cuando cambia el ultimo valor).
  function comentarioDeFila(fila) {
    return comentariosEditados[fila.clave] ?? COMENTARIOS_SUGERIDOS[fila.validacion.clasificacion];
  }

  function manejarCambioComentario(clave, comentario) {
    establecerComentariosEditados((actuales) => ({ ...actuales, [clave]: comentario }));
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

    registrarResultado(fila.control.id, fila.nivel.id, valorNumerico, usuarioAutenticado, comentarioDeFila(fila));
    establecerValoresPendientes((valoresActuales) => {
      const copiaDeValores = { ...valoresActuales };
      delete copiaDeValores[fila.clave];
      return copiaDeValores;
    });
    establecerComentariosEditados((actuales) => {
      const copiaDeComentarios = { ...actuales };
      delete copiaDeComentarios[fila.clave];
      return copiaDeComentarios;
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

      <Card as="section">
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-[14px] font-semibold text-ink">Registro de controles</h2>
              <p className="m-0 mt-1 text-[11.5px] text-ink-faint">
                Filtra y elige un analito para ver sus niveles, registrar un resultado y consultar el historial.
              </p>
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
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[31%]" />
              <col className="w-[27%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-muted text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <th className="px-4 py-3">Analito</th>
                <th className="px-4 py-3">Control utilizado</th>
                <th className="px-4 py-3">Último control realizado</th>
                <th className="py-3 pl-4 pr-6">Estado</th>
              </tr>
            </thead>
            <tbody>
              {gruposFiltrados.map((grupo) => {
                const validacionDelGrupo = peorValidacionDelGrupo(grupo.filas);
                const presentacion = presentacionPorValidacion[validacionDelGrupo.clasificacion];
                const primeraFila = grupo.filas[0];
                return (
                  <tr key={grupo.control.id} className="border-t border-line align-middle transition hover:bg-[#fbfbfc]">
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => establecerControlModalAbierto(grupo.control.id)}
                        className="text-left"
                      >
                        <p className="m-0 text-[13.5px] font-semibold text-ink underline decoration-line-strong decoration-dotted underline-offset-4 transition hover:text-accent">
                          {grupo.nombreAnalito}
                        </p>
                        <span className="mt-1.5 inline-flex items-center rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                          {grupo.filas.length} {grupo.filas.length === 1 ? "nivel" : "niveles"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="m-0 text-[12.5px] font-medium leading-snug text-ink">{grupo.control.nombre}</p>
                      <p className="m-0 mt-1 text-[11px] text-ink-muted">Lote {grupo.control.lote}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="m-0 text-[12px] font-medium text-ink">{primeraFila.fechaUltimoControl}</p>
                      <p className="m-0 mt-1 text-[11px] text-ink-muted">{primeraFila.horaUltimoControl} · {primeraFila.nombreResponsable}</p>
                      <p className="m-0 mt-0.5 text-[10px] text-ink-faint">@{primeraFila.usuarioResponsable}</p>
                    </td>
                    <td className="py-3.5 pl-4 pr-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${presentacion.clase}`}>
                        <span className={`size-1.5 rounded-full ${presentacion.punto}`} aria-hidden="true" />
                        {presentacion.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {gruposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-ink-faint">No hay controles que coincidan con los filtros.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {grupoModalAbierto ? (
        <PopupNiveles
          grupo={grupoModalAbierto}
          alCerrar={() => establecerControlModalAbierto(null)}
          usuarioAutenticado={usuarioAutenticado}
          valoresPendientes={valoresPendientes}
          manejarCambioValor={manejarCambioValor}
          guardarResultado={guardarResultado}
          comentarioDeFila={comentarioDeFila}
          manejarCambioComentario={manejarCambioComentario}
        />
      ) : null}
    </section>
  );
}

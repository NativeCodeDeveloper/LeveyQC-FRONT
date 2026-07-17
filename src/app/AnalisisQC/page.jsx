"use client";

// Pantalla "Analisis QC": vista transversal (todas las categorias) donde se
// registra el resultado del dia para cada analito/nivel. Es la pantalla de
// uso diario: a diferencia de "Ingreso Controles" (que da de alta un
// control/lote nuevo), aca se carga el valor medido hoy contra un control
// que ya existe, y ese valor pasa a la serie historica que evalua el motor
// de Westgard (src/lib/westgard.js).

import Link from "next/link";
import { useMemo, useState } from "react";
import { obtenerAnalitoPorId } from "@/lib/mockData";
import { useRegistrarResultado, useTodosLosControles } from "@/lib/useControlesStore";

function CampoBusqueda({ etiqueta, valor, onCambio, placeholder, tipo = "text" }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-muted">{etiqueta}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-md border border-line-strong px-3 text-[13.5px] outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
      />
    </label>
  );
}

export default function AnalisisQCPage() {
  const controles = useTodosLosControles();
  const registrarResultado = useRegistrarResultado();

  const [busquedaFecha, setBusquedaFecha] = useState("");
  const [busquedaLote, setBusquedaLote] = useState("");
  const [nivelSeleccionado, setNivelSeleccionado] = useState("todos");
  const [busquedaAnalito, setBusquedaAnalito] = useState("");
  const [busquedaControl, setBusquedaControl] = useState("");

  // Valor que se esta tipeando para cada fila, antes de guardarlo. Clave:
  // "{controlId}:{nivelId}".
  const [valoresPendientes, setValoresPendientes] = useState({});

  // Nombres de nivel que existen realmente en los datos (Normal/Patologico
  // hoy), en vez de hardcodear una lista fija que despues no calce con lo
  // que haya cargado en Ingreso de Control.
  const nivelesDisponibles = useMemo(() => {
    const nombres = new Set();
    controles.forEach((control) => control.niveles.forEach((nivel) => nombres.add(nivel.nombre)));
    return [...nombres];
  }, [controles]);

  // Aplana cada control en una fila por nivel: es lo que se ve en la tabla.
  const filas = useMemo(() => {
    return controles.flatMap((control) => {
      const analito = obtenerAnalitoPorId(control.analitoId);
      return control.niveles.map((nivel) => ({
        key: `${control.id}:${nivel.id}`,
        control,
        nivel,
        analitoNombre: analito?.nombre ?? "-",
        valorPrevio: nivel.valores[nivel.valores.length - 1],
        cv: nivel.media ? ((nivel.sd / nivel.media) * 100).toFixed(1) : "-",
        fechaUltimoControl: control.fechaUltimoRegistro ?? control.fechaCalibracion,
      }));
    });
  }, [controles]);

  const filasFiltradas = filas.filter((fila) => {
    if (nivelSeleccionado !== "todos" && fila.nivel.nombre !== nivelSeleccionado) {
      return false;
    }
    if (busquedaFecha && !fila.fechaUltimoControl?.includes(busquedaFecha)) {
      return false;
    }
    if (busquedaLote && !fila.control.lote.toLowerCase().includes(busquedaLote.toLowerCase())) {
      return false;
    }
    if (busquedaAnalito && !fila.analitoNombre.toLowerCase().includes(busquedaAnalito.toLowerCase())) {
      return false;
    }
    if (busquedaControl && !fila.control.nombre.toLowerCase().includes(busquedaControl.toLowerCase())) {
      return false;
    }
    return true;
  });

  function manejarCambioValor(clave, valor) {
    setValoresPendientes((actual) => ({ ...actual, [clave]: valor }));
  }

  function manejarGuardarValor(fila) {
    const valorTexto = valoresPendientes[fila.key];
    const valorNumerico = Number(valorTexto);
    if (!valorTexto || Number.isNaN(valorNumerico)) {
      return;
    }
    registrarResultado(fila.control.id, fila.nivel.id, valorNumerico);
    setValoresPendientes((actual) => {
      const copia = { ...actual };
      delete copia[fila.key];
      return copia;
    });
  }

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
            Analisis QC
          </p>
          <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">Analisis QC</h1>
        </div>
        <div className="flex gap-2.5">
          <CampoBusqueda etiqueta="Buscar por fecha" tipo="date" valor={busquedaFecha} onCambio={setBusquedaFecha} />
          <CampoBusqueda
            etiqueta="Buscar por lote"
            valor={busquedaLote}
            onCambio={setBusquedaLote}
            placeholder="Ej. GL0090"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-muted">Seleccionar nivel</span>
          <select
            value={nivelSeleccionado}
            onChange={(evento) => setNivelSeleccionado(evento.target.value)}
            className="h-9 rounded-md border border-line-strong px-3 text-[13.5px] outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          >
            <option value="todos">Todos los niveles</option>
            {nivelesDisponibles.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
        <CampoBusqueda
          etiqueta="Buscar analito"
          valor={busquedaAnalito}
          onCambio={setBusquedaAnalito}
          placeholder="Ej. Insulina"
        />
        <CampoBusqueda
          etiqueta="Buscar control"
          valor={busquedaControl}
          onCambio={setBusquedaControl}
          placeholder="Ej. Diagon"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[18%]" />
            <col className="w-[22%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">Analito</th>
              <th className="px-4 py-3">Valor nuevo</th>
              <th className="px-4 py-3">Estadistica</th>
              <th className="px-4 py-3">Control</th>
              <th className="px-4 py-3">Ultima carga</th>
              <th className="px-4 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filasFiltradas.map((fila) => (
              <tr key={fila.key} className="border-t border-line align-top">
                <td className="px-4 py-3">
                  <p className="m-0 truncate text-[13.5px] font-medium text-ink">{fila.analitoNombre}</p>
                  <p className="m-0 mt-0.5 truncate text-[12px] text-ink-muted">{fila.nivel.nombre}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="any"
                      value={valoresPendientes[fila.key] ?? ""}
                      onChange={(evento) => manejarCambioValor(fila.key, evento.target.value)}
                      placeholder={String(fila.valorPrevio)}
                      className="h-8 min-w-0 flex-1 rounded-md border border-line-strong px-2 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                    />
                    <button
                      type="button"
                      onClick={() => manejarGuardarValor(fila)}
                      disabled={!valoresPendientes[fila.key]}
                      className="shrink-0 rounded-md border border-line-strong px-2 py-1.5 text-[11px] font-medium text-ink-muted transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Guardar
                    </button>
                  </div>
                  <p className="m-0 mt-1 truncate text-[12px] text-ink-faint">
                    Anterior: {fila.valorPrevio} {fila.nivel.unidad}
                  </p>
                </td>
                <td className="px-4 py-3 text-[12.5px] text-ink-muted">
                  <p className="m-0 truncate">X̄ {fila.nivel.media}</p>
                  <p className="m-0 mt-0.5 truncate">DS {fila.nivel.sd.toFixed(2)} · CV {fila.cv}%</p>
                </td>
                <td className="px-4 py-3">
                  <p className="m-0 truncate text-[13px] text-ink">{fila.control.nombre}</p>
                  <p className="m-0 mt-0.5 truncate text-[12px] text-ink-muted">Lote {fila.control.lote}</p>
                </td>
                <td className="px-4 py-3 truncate text-[12.5px] text-ink-muted">{fila.fechaUltimoControl}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/Controles/${fila.control.categoriaId}/${fila.control.id}`}
                    className="inline-flex min-h-[30px] items-center rounded-md border border-line-strong bg-white px-2.5 text-[12px] font-medium text-ink transition hover:bg-surface-muted"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {filasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-ink-faint">
                  No hay resultados para estos filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

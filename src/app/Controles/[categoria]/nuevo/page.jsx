"use client";

// Formulario "Ingreso Controles": carga un nuevo control de calidad (lote,
// fabricante, matriz, analitos que controla y sus niveles). Como todavia no
// hay backend, "Guardar" persiste el control en localStorage a traves de
// useControlesStore (ver src/lib/useControlesStore.js) y vuelve al listado.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { categorias, obtenerAnalitosPorCategoria, obtenerControlesPorCategoria } from "@/lib/mockData";
import { useControlesDeCategoria } from "@/lib/useControlesStore";

const MAXIMO_NIVELES = 5;

function CampoTexto({ etiqueta, valor, onCambio, placeholder, tipo = "text", requerido = false }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12.5px] font-medium text-ink-muted">{etiqueta}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        placeholder={placeholder}
        required={requerido}
        className="h-9 rounded-md border border-line-strong px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
      />
    </label>
  );
}

export default function IngresoControlPage() {
  const router = useRouter();
  const { categoria: categoriaId } = useParams();
  const { agregarControl } = useControlesDeCategoria(categoriaId);

  // Datos generales del control
  const [nombreControl, setNombreControl] = useState("");
  const [numeroLote, setNumeroLote] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [matriz, setMatriz] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [estadoCalibracion, setEstadoCalibracion] = useState("Calibrado");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaId);

  // Analitos que controla
  const [busquedaAnalito, setBusquedaAnalito] = useState("");
  const [analitosSeleccionados, setAnalitosSeleccionados] = useState([]);

  // Control previo: solo informativo, para comparar contra un control que ya existe
  const [controlPrevioId, setControlPrevioId] = useState("");

  // Niveles: stepper (max 5) + filas dinamicas Nombre/Valor/Unidad
  const [cantidadNiveles, setCantidadNiveles] = useState(0);
  const [unidadesEnStock, setUnidadesEnStock] = useState(1);
  const [niveles, setNiveles] = useState([]);

  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const analitosDeLaCategoria = obtenerAnalitosPorCategoria(categoriaSeleccionada);
  const resultadosBusquedaAnalito = busquedaAnalito.trim()
    ? analitosDeLaCategoria.filter((analito) =>
        analito.nombre.toLowerCase().includes(busquedaAnalito.trim().toLowerCase())
      )
    : analitosDeLaCategoria;

  const controlesPrevios = obtenerControlesPorCategoria(categoriaSeleccionada);

  function seleccionarAnalito(analito) {
    setAnalitosSeleccionados((actual) =>
      actual.some((seleccionado) => seleccionado.id === analito.id) ? actual : [...actual, analito]
    );
  }

  function eliminarAnalito(analitoId) {
    setAnalitosSeleccionados((actual) => actual.filter((analito) => analito.id !== analitoId));
  }

  // Cambia cuantas filas de nivel hay sin perder lo que ya se cargo en las
  // filas que se mantienen.
  function cambiarCantidadNiveles(nuevaCantidad) {
    const cantidadValida = Math.max(0, Math.min(MAXIMO_NIVELES, nuevaCantidad));
    setCantidadNiveles(cantidadValida);
    setNiveles((actual) => {
      const copia = [...actual];
      while (copia.length < cantidadValida) {
        copia.push({ nombre: "", valor: "", unidad: "" });
      }
      return copia.slice(0, cantidadValida);
    });
  }

  function actualizarNivel(indice, campo, valor) {
    setNiveles((actual) => actual.map((nivel, i) => (i === indice ? { ...nivel, [campo]: valor } : nivel)));
  }

  // "Actualizar" limpia el formulario para cargar otro control; la edicion
  // de un control ya guardado queda para la Fase 2 (cuando haya backend).
  function limpiarFormulario() {
    setNombreControl("");
    setNumeroLote("");
    setFabricante("");
    setMatriz("");
    setFechaCaducidad("");
    setEstadoCalibracion("Calibrado");
    setBusquedaAnalito("");
    setAnalitosSeleccionados([]);
    setControlPrevioId("");
    setCantidadNiveles(0);
    setUnidadesEnStock(1);
    setNiveles([]);
    setMensajeGuardado("");
  }

  function manejarGuardar(evento) {
    evento.preventDefault();

    const nuevoControl = {
      id: `CTL-${categoriaSeleccionada}-${Date.now()}`,
      nombre: nombreControl || "Control sin nombre",
      lote: numeroLote,
      fabricante,
      matriz,
      categoriaId: categoriaSeleccionada,
      analitoId: analitosSeleccionados[0]?.id ?? null,
      fechaCalibracion: new Date().toLocaleDateString("es-CL"),
      fechaCaducidad,
      estadoCalibracion,
      estado: "Activo",
      stock: Number(unidadesEnStock) || 0,
      responsable: "Sin asignar",
      // Un control recien ingresado todavia no tiene corridas registradas, asi
      // que arranca con un solo punto en su propio valor objetivo (z=0, "en
      // control"). La SD real de cada nivel se debe recalcular despues, con
      // las mediciones que exige Westgard/CLSI (minimo ~20 en >=10 dias).
      niveles: niveles.map((nivel, indice) => {
        const media = Number(nivel.valor) || 0;
        const sd = media > 0 ? media * 0.03 : 1;
        return {
          id: nivel.nombre.trim().toLowerCase().replace(/\s+/g, "-") || `nivel-${indice}`,
          nombre: nivel.nombre || `Nivel ${indice + 1}`,
          media,
          sd,
          unidad: nivel.unidad,
          valores: [media],
        };
      }),
    };

    agregarControl(nuevoControl);
    setMensajeGuardado("Control guardado. Volviendo al listado...");
    setTimeout(() => {
      router.push(`/Controles/${categoriaSeleccionada}`);
    }, 600);
  }

  return (
    <section className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">
          Analisis QC / Controles
        </p>
        <h1 className="m-0 text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          Ingreso Controles
        </h1>
      </div>

      <form onSubmit={manejarGuardar} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Columna 1: datos del control */}
        <div className="flex flex-col gap-4">
          <CampoTexto etiqueta="Nombre nuevo control" valor={nombreControl} onCambio={setNombreControl} placeholder="Ej. Diagon-D" requerido />
          <CampoTexto etiqueta="Numero de lote" valor={numeroLote} onCambio={setNumeroLote} placeholder="Ej. 0000LSU6" />
          <CampoTexto etiqueta="Fabricante" valor={fabricante} onCambio={setFabricante} placeholder="Ej. Diagon" />
          <CampoTexto etiqueta="Matriz" valor={matriz} onCambio={setMatriz} placeholder="Ej. Suero" />
          <CampoTexto etiqueta="Fecha de caducidad" tipo="date" valor={fechaCaducidad} onCambio={setFechaCaducidad} />
          <CampoTexto etiqueta="Estado calibracion" valor={estadoCalibracion} onCambio={setEstadoCalibracion} placeholder="Ej. Calibrado" />
        </div>

        {/* Columna 2: categoria + analitos que controla */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Categoria</span>
            <select
              value={categoriaSeleccionada}
              onChange={(evento) => setCategoriaSeleccionada(evento.target.value)}
              className="h-9 rounded-md border border-line-strong px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Analito que controla</span>
            <input
              type="search"
              value={busquedaAnalito}
              onChange={(evento) => setBusquedaAnalito(evento.target.value)}
              placeholder="Buscar..."
              className="h-9 rounded-md border border-line-strong px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          {resultadosBusquedaAnalito.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resultadosBusquedaAnalito.map((analito) => (
                <button
                  key={analito.id}
                  type="button"
                  onClick={() => seleccionarAnalito(analito)}
                  className="rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted"
                >
                  + {analito.nombre}
                </button>
              ))}
            </div>
          ) : null}

          <div>
            <span className="text-[12.5px] font-medium text-ink-muted">Analitos seleccionados</span>
            <div className="mt-2 overflow-hidden rounded-md border border-line">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-muted text-left text-[11px] font-semibold uppercase text-ink-muted">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Analito</th>
                    <th className="px-3 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {analitosSeleccionados.map((analito) => (
                    <tr key={analito.id} className="border-t border-line">
                      <td className="px-3 py-2 text-ink-muted">{analito.id}</td>
                      <td className="px-3 py-2 text-ink">{analito.nombre}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => eliminarAnalito(analito.id)}
                          className="text-xs font-semibold text-status-alert hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {analitosSeleccionados.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-3 text-center text-xs text-ink-faint">
                        Todavia no hay analitos seleccionados.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna 3: control previo + niveles */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[12.5px] font-medium text-ink-muted">Control previo seleccionado</span>
            <select
              value={controlPrevioId}
              onChange={(evento) => setControlPrevioId(evento.target.value)}
              className="h-9 rounded-md border border-line-strong px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            >
              <option value="">Ninguno</option>
              {controlesPrevios.map((control) => (
                <option key={control.id} value={control.id}>
                  {control.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] font-medium text-ink-muted">
                Cantidad de niveles (max {MAXIMO_NIVELES})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cambiarCantidadNiveles(cantidadNiveles - 1)}
                  className="h-9 w-9 rounded-md border border-line-strong text-lg font-bold text-ink-muted hover:bg-surface-muted"
                >
                  -
                </button>
                <span className="w-8 text-center text-[13px] font-medium text-ink">{cantidadNiveles}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidadNiveles(cantidadNiveles + 1)}
                  className="h-9 w-9 rounded-md border border-line-strong text-lg font-bold text-ink-muted hover:bg-surface-muted"
                >
                  +
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[12.5px] font-medium text-ink-muted">Unidades en stock</span>
              <input
                type="number"
                min={0}
                value={unidadesEnStock}
                onChange={(evento) => setUnidadesEnStock(evento.target.value)}
                className="h-10 w-24 rounded-lg border border-line-strong px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </label>
          </div>

          {niveles.length > 0 ? (
            <div className="flex flex-col gap-3">
              <span className="text-[12.5px] font-medium text-ink-muted">Niveles disponibles</span>
              {niveles.map((nivel, indice) => (
                <div key={indice} className="grid grid-cols-3 gap-2 rounded-md border border-line p-3">
                  <input
                    value={nivel.nombre}
                    onChange={(evento) => actualizarNivel(indice, "nombre", evento.target.value)}
                    placeholder="Nombre nivel"
                    className="h-9 rounded-md border border-line-strong px-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={nivel.valor}
                    onChange={(evento) => actualizarNivel(indice, "valor", evento.target.value)}
                    placeholder="Valor"
                    type="number"
                    step="any"
                    className="h-9 rounded-md border border-line-strong px-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={nivel.unidad}
                    onChange={(evento) => actualizarNivel(indice, "unidad", evento.target.value)}
                    placeholder="Unidad"
                    className="h-9 rounded-md border border-line-strong px-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-3">
          <button
            type="button"
            onClick={limpiarFormulario}
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-line-strong bg-white px-4 text-[13px] font-medium text-ink hover:bg-surface-muted"
          >
            Actualizar
          </button>
          <button
            type="submit"
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-accent-strong px-5 text-[13px] font-medium text-white hover:bg-[#14181e]"
          >
            Guardar
          </button>
          <Link href={`/Controles/${categoriaId}`} className="text-[13px] font-medium text-ink-muted hover:underline">
            Cancelar
          </Link>
          {mensajeGuardado ? <span className="text-[13px] font-medium text-status-ok">{mensajeGuardado}</span> : null}
        </div>
      </form>
    </section>
  );
}

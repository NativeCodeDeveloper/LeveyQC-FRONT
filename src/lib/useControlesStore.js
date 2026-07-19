"use client";

// Hook cliente que combina los controles "semilla" (mock, definidos en
// mockData.js) con los cambios que el usuario va haciendo desde la UI:
// crear un control nuevo (Ingreso de Control) o registrar un resultado
// nuevo sobre un control/nivel que ya existe (pantalla Analisis QC).
// Todavia no hay backend: los cambios se persisten en localStorage. El dia
// que haya un API real, este archivo es el unico lugar que hay que cambiar.
//
// Se usa useSyncExternalStore (no useEffect + setState) porque localStorage
// es un store externo al arbol de React: es el hook pensado para esto y
// evita problemas de hidratacion entre servidor y cliente.

import { useCallback, useSyncExternalStore } from "react";
import { controles as controlesSemilla } from "./mockData";

const CLAVE_STORAGE = "leveyqc_controles_guardados";
const listeners = new Set();
const SNAPSHOT_VACIO = [];
let cache = null;

function leerGuardados() {
  try {
    const crudo = window.localStorage.getItem(CLAVE_STORAGE);
    return crudo ? JSON.parse(crudo) : [];
  } catch (error) {
    console.error("No se pudieron leer los controles guardados en localStorage", error);
    return [];
  }
}

// getSnapshot: se cachea para devolver siempre la misma referencia mientras
// no haya cambios (useSyncExternalStore lo exige para no entrar en loop).
function obtenerSnapshot() {
  if (cache === null) {
    cache = leerGuardados();
  }
  return cache;
}

// getServerSnapshot: en el servidor no existe localStorage. Tiene que
// devolver siempre la MISMA referencia (no un array literal nuevo cada
// vez), o React entiende que el snapshot cambio en cada render y entra en
// loop.
function obtenerSnapshotServidor() {
  return SNAPSHOT_VACIO;
}

function suscribirse(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function persistir(controlesGuardados) {
  cache = controlesGuardados;
  window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(controlesGuardados));
  listeners.forEach((listener) => listener());
}

// Mezcla los controles semilla (mock) con los guardados en localStorage: un
// control guardado con el mismo id que uno semilla lo reemplaza (permite
// editar/registrar resultados), y un id que no existia en la semilla se
// agrega (permite crear un control nuevo). Un solo mecanismo para los dos
// casos.
function combinarControles(guardados) {
  const mapa = new Map(controlesSemilla.map((control) => [control.id, control]));
  guardados.forEach((control) => mapa.set(control.id, control));
  return [...mapa.values()];
}

// Todos los controles (de todas las categorias), ya mezclados.
export function useTodosLosControles() {
  const guardados = useSyncExternalStore(suscribirse, obtenerSnapshot, obtenerSnapshotServidor);
  return combinarControles(guardados);
}

// Controles de una categoria puntual + la funcion para crear uno nuevo
// (usada por el formulario de Ingreso de Control).
export function useControlesDeCategoria(categoriaId) {
  const todos = useTodosLosControles();
  const controles = todos.filter((control) => control.categoriaId === categoriaId);

  const agregarControl = useCallback((nuevoControl) => {
    const actual = obtenerSnapshot();
    persistir([...actual.filter((control) => control.id !== nuevoControl.id), nuevoControl]);
  }, []);

  return { controles, agregarControl };
}

// Busca un control puntual (para la pantalla de detalle), ya mezclado.
export function useControlPorId(controlId) {
  const todos = useTodosLosControles();
  return todos.find((control) => control.id === controlId);
}

// Registra un resultado nuevo sobre un nivel puntual de un control: lo
// agrega a su serie historica (para que el motor de Westgard lo evalue) y
// actualiza la fecha del ultimo registro. Funciona tanto si el control es
// semilla como si ya tenia cambios guardados antes.
export function useRegistrarResultado() {
  return useCallback((controlId, nivelId, nuevoValor, usuarioResponsable) => {
    const controlActual = combinarControles(obtenerSnapshot()).find((control) => control.id === controlId);
    if (!controlActual) {
      return;
    }

    // Momento del registro: se guarda una sola vez para que la fecha y la
    // hora sean identicas en la tabla principal y en el historial detallado.
    const momentoDelRegistro = new Date();
    const fechaDelRegistro = momentoDelRegistro.toLocaleDateString("es-CL");
    const horaDelRegistro = momentoDelRegistro.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Nivel modificado: permite guardar el indice exacto del nuevo punto y
    // relacionarlo despues con su posicion en la carta Levey-Jennings.
    const nivelModificado = controlActual.niveles.find((nivel) => nivel.id === nivelId);
    if (!nivelModificado) {
      return;
    }

    // Registro de auditoria ficticio: conserva quien ingreso el resultado,
    // cuando lo hizo y sobre que control/nivel trabajo.
    const nuevoRegistroDeAuditoria = {
      id: `REG-${momentoDelRegistro.getTime()}-${nivelId}`,
      nivelId,
      indiceSerie: nivelModificado.valores.length,
      valorIngresado: nuevoValor,
      fechaIngreso: fechaDelRegistro,
      fechaUltimaModificacion: fechaDelRegistro,
      horaUltimaModificacion: horaDelRegistro,
      usuarioResponsable: usuarioResponsable?.usuario ?? "usuario-demo",
      nombreResponsable: usuarioResponsable?.nombre ?? "Usuario de demostracion",
    };

    const controlActualizado = {
      ...controlActual,
      fechaUltimoRegistro: fechaDelRegistro,
      horaUltimoRegistro: horaDelRegistro,
      usuarioUltimaModificacion: nuevoRegistroDeAuditoria.usuarioResponsable,
      nombreUsuarioUltimaModificacion: nuevoRegistroDeAuditoria.nombreResponsable,
      historialRegistros: [...(controlActual.historialRegistros ?? []), nuevoRegistroDeAuditoria],
      niveles: controlActual.niveles.map((nivel) =>
        nivel.id === nivelId ? { ...nivel, valores: [...nivel.valores, nuevoValor] } : nivel
      ),
    };

    const actual = obtenerSnapshot();
    persistir([...actual.filter((control) => control.id !== controlId), controlActualizado]);
  }, []);
}

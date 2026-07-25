"use client";

// Hook cliente que combina los registros "semilla" de Control de Pares
// (mock, definidos en controlDeParesData.js) con los que el usuario va
// creando desde la UI (formulario "Nuevo registro"). Todavia no hay backend:
// los cambios se persisten en localStorage. El dia que haya un API real
// (Java), este archivo es el unico lugar que hay que cambiar.
//
// Mismo patron que useControlesStore.js: useSyncExternalStore porque
// localStorage es un store externo al arbol de React.

import { useCallback, useSyncExternalStore } from "react";
import { registrosControlDePares as registrosSemilla } from "./controlDeParesData";

const CLAVE_STORAGE = "leveyqc_control_de_pares_guardados";
const listeners = new Set();
const SNAPSHOT_VACIO = [];
let cache = null;

function leerGuardados() {
  try {
    const crudo = window.localStorage.getItem(CLAVE_STORAGE);
    return crudo ? JSON.parse(crudo) : [];
  } catch (error) {
    console.error("No se pudieron leer los registros de Control de Pares en localStorage", error);
    return [];
  }
}

function obtenerSnapshot() {
  if (cache === null) {
    cache = leerGuardados();
  }
  return cache;
}

function obtenerSnapshotServidor() {
  return SNAPSHOT_VACIO;
}

function suscribirse(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function persistir(registrosGuardados) {
  cache = registrosGuardados;
  window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(registrosGuardados));
  listeners.forEach((listener) => listener());
}

// Mezcla los registros semilla con los guardados en localStorage: un
// registro guardado con el mismo id que uno semilla lo reemplaza, y un id
// nuevo se agrega.
function combinarRegistros(guardados) {
  const mapa = new Map(registrosSemilla.map((registro) => [registro.id, registro]));
  guardados.forEach((registro) => mapa.set(registro.id, registro));
  return [...mapa.values()];
}

// Todos los registros de Control de Pares, ya mezclados.
export function useTodosLosRegistrosControlDePares() {
  const guardados = useSyncExternalStore(suscribirse, obtenerSnapshot, obtenerSnapshotServidor);
  return combinarRegistros(guardados);
}

// Registros de un mes puntual + la funcion para crear uno nuevo (usada por
// el formulario "Nuevo registro").
export function useRegistrosControlDeParesPorMes(mesId) {
  const todos = useTodosLosRegistrosControlDePares();
  const registros = todos.filter((registro) => registro.mesId === mesId);

  const agregarRegistro = useCallback((nuevoRegistro) => {
    const actual = obtenerSnapshot();
    persistir([...actual.filter((registro) => registro.id !== nuevoRegistro.id), nuevoRegistro]);
  }, []);

  return { registros, agregarRegistro };
}

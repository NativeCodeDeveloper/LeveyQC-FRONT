"use client";

// Sesion del usuario logueado (nombre, laboratorio, rol) para el menu de
// usuario del topbar. Todavia no hay autenticacion real: devuelve datos
// fijos. El dia que se conecte Clerk, este archivo es el unico lugar que
// hay que cambiar:
//   - usuario  -> viene de useUser() de "@clerk/nextjs"
//   - organizacion (laboratorio + rol) -> viene de useOrganization(), que en
//     Clerk ya modela multi-tenant (organizacion = laboratorio, rol de
//     organizacion = tipo de usuario)
//   - cerrarSesion -> signOut() de "@clerk/nextjs"
//   - cambiarSesion -> Clerk trae listo el flujo multi-sesion (lo expone
//     directamente el componente <UserButton /> si se usa ese en vez de un
//     menu propio)

const usuarioDeMuestra = {
  nombre: "Beatriz Olate",
  iniciales: "BO",
  correo: "bolate@leveyqc.cl",
};

const organizacionDeMuestra = {
  nombre: "Laboratorio Central",
  rol: "Administrador",
};

export function useSesion() {
  return {
    cargando: false,
    usuario: usuarioDeMuestra,
    organizacion: organizacionDeMuestra,
  };
}

export function cerrarSesion() {
  // TODO(clerk): reemplazar por signOut() de "@clerk/nextjs" al conectar la autenticacion real.
  console.info("Cerrar sesión: pendiente de conectar con Clerk.");
}

export function cambiarSesion() {
  // TODO(clerk): reemplazar por el flujo multi-sesion / multi-organizacion de Clerk.
  console.info("Cambiar sesión: pendiente de conectar con Clerk.");
}

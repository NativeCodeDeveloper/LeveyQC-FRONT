import { clerkMiddleware } from "@clerk/nextjs/server";

function esRutaPublica(ruta) {
  return (
    ruta === "/sign-in" ||
    ruta.startsWith("/sign-in/") ||
    ruta === "/__clerk" ||
    ruta.startsWith("/__clerk/")
  );
}

export default clerkMiddleware(async (auth, solicitud) => {
  if (!esRutaPublica(solicitud.nextUrl.pathname)) {
    await auth.protect();
  }
}, {
  signInUrl: "/sign-in",
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};

"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar";

export default function AppShell({ children }) {
  const rutaActual = usePathname();
  const { user } = useUser();
  const { organization } = useOrganization();
  const nombreInstitucion =
    organization?.name ?? user?.publicMetadata?.institucion ?? "Laboratorio Central";
  const nombreUsuario =
    user?.fullName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Usuario";

  if (rutaActual.startsWith("/sign-in")) {
    return children;
  }

  return (
    <div className="grid min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-canvas max-[860px]:grid-cols-1">
      <Sidebar />
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-end gap-3 border-b border-line bg-white px-6">
          <Show when="signed-out">
            <SignInButton>
              <button type="button" className="text-[12.5px] font-semibold text-ink-muted transition hover:text-ink">
                Iniciar sesión
              </button>
            </SignInButton>
            <SignUpButton>
              <button type="button" className="rounded-lg bg-accent-strong px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-accent">
                Crear cuenta
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="m-0 truncate text-[11px] font-medium leading-tight text-ink-muted">
                  {nombreInstitucion}
                </p>
                <p className="m-0 mt-1 truncate text-[13px] font-semibold leading-tight text-ink">
                  {nombreUsuario}
                </p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "!h-11 !w-11",
                  },
                }}
              />
            </div>
          </Show>
        </header>
        <main className="min-w-0 p-9 max-[860px]:p-[24px_18px]">{children}</main>
      </div>
    </div>
  );
}

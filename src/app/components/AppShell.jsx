"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar";

export default function AppShell({ children }) {
  const rutaActual = usePathname();
  const { user } = useUser();
  const { organization } = useOrganization();
  const nombreInstitucion =
    organization?.name ?? user?.publicMetadata?.institucion ?? "Laboratorio Central";
  const logoInstitucion = organization?.imageUrl;
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
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-end gap-3 border-b border-line bg-white px-6">
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
            <div className="flex items-center gap-3 rounded-2xl bg-white p-1.5 pl-2.5">
              <div className="hidden size-13 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted text-ink-muted sm:flex">
                {logoInstitucion ? (
                  <Image
                    src={logoInstitucion}
                    alt="Logo de la institución"
                    width={52}
                    height={52}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="size-5" aria-hidden="true" />
                )}
              </div>
              <div className="hidden min-w-0 max-w-64 pr-1 text-left sm:block">
                <p className="m-0 truncate text-[12px] font-semibold leading-4 text-ink-muted">
                  {nombreInstitucion}
                </p>
                <p className="m-0 mt-0.5 truncate text-[15px] font-semibold leading-5 tracking-[-0.015em] text-ink">
                  {nombreUsuario}
                </p>
              </div>
              <div className="relative shrink-0 rounded-full">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "!h-13 !w-13",
                      userButtonTrigger: "!rounded-full !outline-none focus:!shadow-none",
                    },
                  }}
                />
                <span
                  className="pointer-events-none absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-status-ok"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Show>
        </header>
        <main className="min-w-0 p-9 max-[860px]:p-[24px_18px]">{children}</main>
      </div>
    </div>
  );
}

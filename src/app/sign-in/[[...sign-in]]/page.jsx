import { Auth } from "@/components/ui/auth-form-1";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";

export default function PaginaInicioSesion() {
  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#02040a]">
      <InteractiveNebulaShader disableCenterDimming className="z-0 opacity-90" />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,4,10,0)_0%,rgba(2,4,10,0.18)_38%,rgba(2,4,10,0.92)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]"
      />

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <section className="flex w-full justify-center" aria-label="Acceso a LeveyQC">
          <Auth />
        </section>
      </div>
    </main>
  );
}

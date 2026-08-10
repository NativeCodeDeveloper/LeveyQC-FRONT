import Image from "next/image";
import { Auth } from "@/components/ui/auth-form-1";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";

export default function PaginaInicioSesion() {
  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#02050a]">
      <InteractiveNebulaShader className="z-0" />
      <div className="relative z-10 grid min-h-screen bg-black/15 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative flex min-h-[280px] overflow-hidden bg-black/30 p-6 text-white backdrop-blur-[2px] sm:p-8 lg:min-h-screen lg:p-10">
          <div className="relative z-10 flex w-full flex-col">
            <Image
              src="/leveayqclogo.png"
              alt="LeveyQC"
              width={1600}
              height={696}
              priority
              className="h-auto w-48 object-contain sm:w-52"
            />

            <div className="my-7 h-px w-12 bg-white/20 lg:my-9" aria-hidden="true" />
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
              Plataforma de control de calidad
            </p>
            <h1 className="m-0 mt-3 max-w-lg !text-[28px] !font-semibold !leading-[1.18] !tracking-[-0.025em] !text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] sm:!text-[33px]">
              Ciencia, precisión y confianza en cada resultado.
            </h1>
            <p className="m-0 mt-4 hidden max-w-lg text-[14px] leading-7 text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:block">
              Accede al entorno de registro para mantener la trazabilidad de controles, resultados y responsables.
            </p>
          </div>
        </section>

        <section className="flex min-h-[620px] items-center justify-center bg-black/35 p-6 backdrop-blur-md sm:p-8 lg:min-h-screen lg:px-12 lg:py-10">
          <Auth />
        </section>
      </div>
    </main>
  );
}

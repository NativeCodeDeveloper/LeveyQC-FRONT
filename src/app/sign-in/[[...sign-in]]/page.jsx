import Image from "next/image";
import {
  BellRing as CampanaAlerta,
  CircleCheckBig as Verificacion,
  ClipboardCheck as PortapapelesVerificado,
  ShieldCheck as EscudoVerificado,
} from "lucide-react";
import { Auth } from "@/components/ui/auth-form-1";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";

export default function PaginaInicioSesion() {
  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#02050a]">
      <InteractiveNebulaShader className="z-0" />
      <div className="relative z-10 grid min-h-screen bg-black/15 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative flex min-h-[280px] overflow-hidden bg-black/30 p-6 text-white backdrop-blur-[2px] sm:p-8 lg:min-h-screen lg:p-10">
          <div className="relative z-10 mx-auto flex w-full max-w-[760px] flex-col">
            <Image
              src="/leveayqclogo.png"
              alt="LeveyQC"
              width={1600}
              height={696}
              priority
              className="h-auto w-60 object-contain sm:w-72"
            />

            <p className="m-0 mt-7 w-fit rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[9px] font-medium uppercase leading-none tracking-[0.06em] text-violet-200/75 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
              Plataforma de control de calidad
            </p>

            <h1 className="m-0 mt-10 max-w-[680px] !text-[32px] !font-semibold !leading-[1.08] !tracking-[-0.035em] !text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] sm:!text-[40px] xl:!text-[46px]">
              Ciencia, precisión y confianza en cada{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                resultado.
              </span>
            </h1>
            <p className="m-0 mt-4 max-w-[560px] text-[19px] font-normal leading-7 tracking-[0.005em] text-white/55 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:text-[20px]">
              Inteligencia artificial para una nueva generación de control de laboratorios clínicos.
            </p>

            <div className="mt-7 flex max-w-[520px] flex-col gap-5">
              <div className="flex items-start gap-3">
                <EscudoVerificado
                  aria-hidden="true"
                  className="mt-0.5 size-7 shrink-0 text-violet-400"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="m-0 text-[13px] font-semibold leading-5 text-white/90">
                    Trazabilidad completa
                  </p>
                  <p className="m-0 text-[11px] leading-4 text-white/50">
                    Todo el historial en un solo lugar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Verificacion
                  aria-hidden="true"
                  className="mt-0.5 size-7 shrink-0 text-violet-400"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="m-0 text-[13px] font-semibold leading-5 text-white/90">
                    Menos errores humanos
                  </p>
                  <p className="m-0 text-[11px] leading-4 text-white/50">
                    Automatiza cálculos y registros
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CampanaAlerta
                  aria-hidden="true"
                  className="mt-0.5 size-7 shrink-0 text-violet-400"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="m-0 text-[13px] font-semibold leading-5 text-white/90">
                    Alertas inteligentes
                  </p>
                  <p className="m-0 text-[11px] leading-4 text-white/50">
                    Detecta desviaciones a tiempo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PortapapelesVerificado
                  aria-hidden="true"
                  className="mt-0.5 size-7 shrink-0 text-violet-400"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="m-0 text-[13px] font-semibold leading-5 text-white/90">
                    Auditorías en segundos
                  </p>
                  <p className="m-0 text-[11px] leading-4 text-white/50">
                    Información disponible y ordenada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[620px] items-center justify-center bg-black/35 p-6 backdrop-blur-md sm:p-8 lg:min-h-screen lg:px-12 lg:py-10">
          <Auth />
        </section>
      </div>
    </main>
  );
}

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
              className="h-auto w-60 object-contain sm:w-72"
            />

            <h1 className="m-0 mt-8 max-w-[640px] !text-[32px] !font-semibold !leading-[1.14] !tracking-[-0.03em] !text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] sm:!text-[40px] lg:!text-[42px]">
              Ciencia, precisión y confianza en cada resultado.
            </h1>
            <p className="m-0 mt-4 max-w-[560px] text-[15px] font-normal leading-6 tracking-[0.005em] text-white/55 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:text-[16px]">
              Control de calidad para laboratorios clínicos.
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

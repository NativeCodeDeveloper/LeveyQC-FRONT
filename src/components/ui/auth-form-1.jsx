import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export function Auth() {
  return (
    <div className="flex w-full max-w-[510px] flex-col items-center">
      <div className="relative isolate w-full transform-gpu overflow-hidden rounded-[32px] border border-white/[0.22] bg-white/[0.045] bg-clip-padding p-5 text-sidebar-text shadow-[0_40px_120px_rgba(0,0,0,0.34),0_0_80px_rgba(91,61,196,0.12)] backdrop-blur-xl backdrop-saturate-150 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
        <div className="relative mb-7 flex justify-center">
          <Image
            src="/leveayqclogo.png"
            alt="LeveyQC"
            width={1600}
            height={696}
            priority
            className="h-auto w-52 object-contain drop-shadow-[0_3px_18px_rgba(255,255,255,0.16)] sm:w-60"
          />
        </div>

        <div className="relative mb-7 text-center sm:mb-8">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/65">
            Control calidad Laboratorio
          </p>
          <h1 className="m-0 mt-3 !text-[28px] !font-semibold !leading-tight !tracking-[-0.035em] !text-white sm:!text-[32px]">
            Inicia sesión
          </h1>
          <p className="mx-auto mb-0 mt-2.5 max-w-[340px] text-[13px] leading-5 text-white/50 sm:text-[13.5px]">
            Ingresa tus credenciales para acceder de forma segura a tu laboratorio.
          </p>
        </div>

        <SignIn
          path="/sign-in"
          routing="path"
          fallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
          withSignUp
          appearance={{
            options: {
              elevation: "flush",
              unsafe_disableDevelopmentModeWarnings: true,
            },
            variables: {
              colorPrimary: "#f5f5f7",
              colorPrimaryForeground: "#0b0d10",
              colorNeutral: "#f5f5f7",
              colorForeground: "#f5f5f7",
              colorMutedForeground: "#a1a1a6",
              colorMuted: "#17191f",
              colorBackground: "transparent",
              colorInput: "#17191f",
              colorInputForeground: "#f5f5f7",
              colorBorder: "rgba(255, 255, 255, 0.15)",
              colorRing: "rgba(255, 255, 255, 0.55)",
              borderRadius: "0.5rem",
              fontFamily: "var(--font-geist-sans)",
            },
            elements: {
              rootBox: "!w-full",
              cardBox: "!w-full !shadow-none",
              card: "!w-full !gap-0 !bg-transparent !p-0 !shadow-none",
              header: "!hidden",
              main: "!gap-5",
              form: "!gap-5",
              formFieldRow: "!gap-2",
              formFieldLabel: "!text-[13px] !font-medium !text-white/80",
              formFieldInput: "!h-12 !rounded-xl !border-white/10 !bg-white/[0.07] !px-4 !text-[14px] !text-white !shadow-inner !shadow-black/20 placeholder:!text-white/30 focus:!border-violet-300/50 focus:!ring-4 focus:!ring-violet-400/10",
              formButtonPrimary: "!h-12 !rounded-xl !bg-white !text-[14px] !font-semibold !text-[#080a11] !shadow-[0_12px_34px_rgba(255,255,255,0.14)] transition-all hover:!bg-white/90 hover:!shadow-[0_14px_40px_rgba(255,255,255,0.2)] focus:!ring-4 focus:!ring-white/20",
              socialButtonsBlockButton: "!h-12 !rounded-xl !border-white/10 !bg-white/[0.06] !text-white hover:!bg-white/[0.1]",
              socialButtonsBlockButtonText: "!text-white/85",
              dividerLine: "!bg-white/10",
              dividerText: "!text-white/35",
              identityPreview: "!rounded-xl !border-white/10 !bg-white/[0.06]",
              identityPreviewText: "!text-white/80",
              identityPreviewEditButton: "!text-violet-200",
              formResendCodeLink: "!text-violet-200",
              otpCodeFieldInput: "!border-white/10 !bg-white/[0.07] !text-white",
              alternativeMethodsBlockButton: "!border-white/10 !bg-white/[0.06] !text-white/85",
              footer: "!hidden",
              footerPages: "!hidden",
              badge: "!hidden",
            },
          }}
        />
      </div>

      <div className="mt-6 flex justify-center sm:mt-7">
        <Image
          src="/ncode.png"
          alt="nCode"
          width={2172}
          height={724}
          className="h-14 w-auto opacity-45 sm:h-16"
        />
      </div>
    </div>
  );
}

export default Auth;

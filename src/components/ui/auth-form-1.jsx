import { SignIn } from "@clerk/nextjs";

export function Auth() {
  return (
    <div className="w-full max-w-[450px] rounded-2xl border border-sidebar-border bg-sidebar-bg/85 p-6 text-sidebar-text shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8">
      <div className="mb-7">
        <h2 className="m-0 text-[25px] font-semibold tracking-[-0.025em] text-sidebar-text">
          Inicia sesión
        </h2>
        <p className="m-0 mt-2 max-w-sm text-[12.5px] leading-5 text-sidebar-text-muted">
          Accede con tus credenciales para acceder al control de calidad de tu laboratorio clínico.
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
            rootBox: "w-full",
            cardBox: "w-full",
            card: "w-full",
            header: "hidden",
            socialButtonsBlockButton: "!text-white",
            socialButtonsBlockButtonText: "!text-white",
            formButtonPrimary: "!bg-white !text-sidebar-bg",
          },
        }}
      />

      <p className="m-0 mt-5 text-center text-[10.5px] text-sidebar-text-faint">
        Acceso protegido · Laboratorio Central
      </p>
    </div>
  );
}

export default Auth;

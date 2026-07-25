import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./Sidebar";
import UserMenu from "./components/UserMenu";
import "./globals.css";

// El layout se mantiene como Server Component (puede exportar `metadata`).
// La navegacion interactiva (expandir/colapsar, ruta activa) vive en
// Sidebar.jsx, que si es Client Component.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Levey QC",
  description: "Panel de control de calidad",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="grid min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-canvas max-[860px]:grid-cols-1">
          <Sidebar />
          <div className="flex min-w-0 flex-col">
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-end border-b border-line bg-white px-6">
              <UserMenu />
            </header>
            <main className="min-w-0 p-9 max-[860px]:p-[24px_18px]">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

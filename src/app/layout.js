import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

const menuSections = [
  {
    label: "Controles",
    active: true,
  },
  {
    label: "Categorias",
    items: [
      "Quimica",
      "Hematologia",
      "Hormonas",
      "Microbiologia",
      "Parasitologia",
      "Biologia Molecular",
      "Banco de sangre",
      "Serologia",
    ],
  },
  {
    label: "Proveedores",
  },
  {
    label: "Reservas",
  },
  {
    label: "Insumos",
  },
  {
    label: "Ubicacion",
  },
  {
    label: "Configuraciones",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu principal">
      <div className="brandBlock">
        <Image
          className="brandLogo"
          src="/logo2.png"
          alt="Levey Quality Control"
          width={248}
          height={99}
          priority
        />
      </div>

      <nav className="sidebarNav" aria-label="Secciones">
        <p className="navLabel">Menu</p>
        {menuSections.map((section) => (
          <div className="navGroup" key={section.label}>
            <button
              className={section.active ? "navButton navButtonActive" : "navButton"}
              type="button"
            >
              {section.label}
            </button>

            {section.items ? (
              <div className="navChildren" aria-label={`${section.label} submenu`}>
                {section.items.map((item) => (
                  <button className="navChild" key={item} type="button">
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>

      <div className="sidebarStatus" aria-label="Estado del sistema">
        <span className="statusDot" />
        <div>
          <p>Control interno</p>
          <span>Panel operativo</span>
        </div>
      </div>
    </aside>
  );
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="appShell">
          <Sidebar />
          <main className="contentShell">{children}</main>
        </div>
      </body>
    </html>
  );
}

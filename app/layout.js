import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const fontHeading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bmdev.web.id"),
  title: {
    default: "BMDev. — Fullstack Web Developer & Jasa Pembuatan Website",
    template: "%s | BMDev.",
  },
  description: "Jasa pembuatan website dan aplikasi web modern berbasis Next.js, TypeScript, dan custom ERP oleh BMDev. Berkinerja tinggi, cepat, dan terukur.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#081410] text-[#EAF6EF] dark" suppressHydrationWarning>
        {/* Animated Ambient Background Blobs from contoh.html */}
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        {children}
      </body>
    </html>
  );
}

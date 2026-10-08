import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
// export const instant = false;

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bmdev.web.id"),
  title: {
    default: "BMDev — Fullstack Web Developer",
    template: "%s | BMDev",
  },
  description: "Portofolio dan layanan web development modern berbasis Next.js, TypeScript, dan custom architecture oleh BMDev.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${fontSans.variable} ${fontMono.variable} dark`}>
      <body className="antialiased min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans selection:bg-[#E8452C] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


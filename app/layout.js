import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const fontHeading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  title: "BMDev. — Fullstack Web Developer",
  description: "Headless CMS frontend powered by Cockpit × Material 3 Expressive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}>
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

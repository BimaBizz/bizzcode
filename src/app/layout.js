/**
 * This file is part of BizzCode Website Project.
 *
 * BizzCode Website Project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * BizzCode Website Project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BizzCode Website Project. If not, see <https://www.gnu.org/licenses/>.
 */

import { Poppins } from "next/font/google";
import "./globals.css";

const inter = Poppins({ subsets: ["latin"], weight:["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: {
    template: '%s - BizzCode',
    default: 'Home - BizzCode', 
  },
  description: 'Selamat datang di Bizzcode, portofolio resmi Bima Mahendra, seorang Frontend Web Developer berbakat. Jelajahi karya terbaik saya dalam pengembangan web modern, desain responsif, dan pengalaman pengguna yang luar biasa. Temukan bagaimana saya dapat membantu mewujudkan proyek digital Anda dengan teknologi terkini.',
  generator: 'Next.js',
  applicationName: 'Bizzcode - Bima Mahendra',
  referrer: 'origin-when-cross-origin',
  keywords: ['server action nextjs', 'nextjs server action', 'zod', 'nextjs search param', 'web developer near me', 'front-end web developer', 'remote web developer', 'web developer', 'preline', 'html compiler', 'bizzcode', 'bimabizz', 'Github bimabizz', 'tailwind neon', 'vercel', 'nextjs', 'nextjs project'],
  authors: [{ name: 'Bima Mahendra' }],
  creator: 'Bima Mahendra',
  publisher: 'Bima Mahendra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.bizzcode.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: 'https://www.bizzcode.site',
    siteName: 'Bima Mahendra - Bizzcode',
    images: '/SEO/og-bizzcode.png',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  verification: {
    google: 'zB9tK4pNQpY7dGcRyiUOND9g7129YUr5njd0PFWaams',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1c1d2c] text-white`} >
        {children}</body>
    </html>
  );
}

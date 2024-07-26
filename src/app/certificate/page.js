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

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderPages from "@/components/HeaderPages";
import { Jost } from "next/font/google";
import Certificate from "@/components/Certificates";

const JostFont = Jost({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Certificate",
  description:
    "Discover the certificates I have earned as a web developer, showcasing my skills and expertise in various technologies and frameworks. From front-end development to back-end solutions, these certifications demonstrate my commitment to continuous learning and professional growth. Explore my achievements and see how they contribute to my capability as a web developer",
  keywords:
    "certificate, web development, web development certificate, web developer certificate, certificate web developer, certificate web development, certificate web developers, certificate web developer certificate, web developer certificate collection, web development certificate collection, web developer certificate collection",
  alternates: {
    canonical: "/certificate",
  },
  openGraph: {
    url: "https://www.bizzcode.site/certificate",
    siteName: "Get in touch - Bizzcode",
    images: "/SEO/og-certificate.png",
    type: "website",
  },
};

export async function getData() {
  const res = await fetch(process.env.API_URL + '/content/items/sertifikat?sort={"organisasi":1}', {
    method: "GET",
    headers: {
      "Api-Key": process.env.API_KEY,
    },
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default async function Contact() {
  const data = await getData();

  return (
    <main className="relative overflow-hidden">
      <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <HeaderPages class={JostFont.className} title="My Certificates Collection." subtitle="This is a certification that I have collected to support my hobby as a web developer."></HeaderPages>
      <Certificate data={data} />
      <div className="h-20"></div>
      <Footer />
      <div className="h-20"></div>
    </main>
  );
}

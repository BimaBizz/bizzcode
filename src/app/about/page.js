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
import AboutMe from "@/components/AboutMe";

const JostFont = Jost({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "About Me",
  description: "Get to know more about Bima Mahendra. I am a frontend web developer with a passion for clean code, responsive design, and user-centric interfaces.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "https://www.bizzcode.site/about",
    siteName: "About Me - Bizzcode",
    images: "/SEO/og-aboutme.png",
    type: "website",
  },
};

export async function getData() {
  const res = await fetch(process.env.API_URL + "/content/item/aboutMe?populate=1", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const jsonLd = async () => {
  const data = await getData();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-12-23T12:34:00-05:00",
    dateModified: "2024-12-26T14:53:00-05:00",
    mainEntity: {
      "@type": "Person",
      name: "Bima Mahendra",
      alternateName: "bizzcode",
      identifier: data._id,
      description: data.deskripsi,
      image: "https://admin.bizzcode.site/storage/uploads" + data.image.path,
    },
  };
};

export default async function Page() {
  const data = await getData();

  return (
    <main className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsonLd()) }}></script>
      <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <HeaderPages class={JostFont.className} title="About Me." subtitle="My journey in the world of web development has been driven by a passion for clean code, responsive design, and user-centric interfaces." />
      <AboutMe data={data} />
      <div className="h-20"></div>
      <Footer />
      <div className="h-20"></div>
    </main>
  );
}

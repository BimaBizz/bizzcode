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

import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderPages from "@/components/HeaderPages";
import { Jost } from "next/font/google";
import Link from "next/link";

const JostFont = Jost({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "My Works",
  description:
    "Telusuri berbagai proyek kreatif dan inovatif Bima Mahendra sebagai Frontend Web Developer di Bizzcode. Dapatkan wawasan mendalam tentang bagaimana saya menggunakan JavaScript, React, HTML, dan CSS untuk menciptakan pengalaman web yang menakjubkan dan responsif.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    url: "https://www.bizzcode.site/projects",
    siteName: "My Works - Bizzcode",
    images: "/SEO/og-myworks.png",
    type: "website",
  },
};

export async function getData() {
  const res = await fetch(process.env.API_URL + '/content/items/projects?populate=1&sort={"_created":-1}', {
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
    "@type": "BreadcrumbList",
    itemListElement: data.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://www.bizzcode.site/projects/${item.slug}`,
    })),
  };
};

export default async function Page() {
  const data = await getData();

  return (
    <main className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsonLd()) }}></script>
      <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <HeaderPages class={JostFont.className} title="My Works." subtitle="Some of the works are from my homework and some are on my own time.">
        <p className="font-semibold mt-14 text-base 2xl:text-xl" data-aos="fade-up" data-aos-duration="1500">
          Come and see my{" "}
          <Link href={"https://github.com/BimaBizz"} target="_blank" className="text-white md:text-indigo-500 underline underline-offset-4">
            Github
          </Link>
        </p>
      </HeaderPages>
      <Projects data={data} titile={null} />
      <div className="h-20"></div>
      <Footer />
      <div className="h-20"></div>
    </main>
  );
}

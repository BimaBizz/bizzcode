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
import Blogs from "@/components/Blogs";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/Pagination";

const JostFont = Jost({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

async function fetchData(search = "", page = 1) {
  const limit = 6;
  const skip = (page - 1) * limit;
  const res = await fetch(`${process.env.API_URL}/content/items/bizzblog?filter={"titile":{'$regex':"${search}"}}&skip=${skip}&limit=${limit}&sort={"_created":-1}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export const metadata = {
  title: "Blogs",
  description: "Baca artikel blog Bima Mahendra untuk mendapatkan wawasan tentang pengembangan web, desain, dan teknologi terkini. Dapatkan tips dan trik dari pengalaman seorang Frontend Web Developer berbakat.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    url: "https://www.bizzcode.site/blogs",
    siteName: "Blogs - Bizzcode",
    images: "/SEO/og-blog.png",
    type: "website",
  },
};

export default async function Page({ searchParams }) {
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const data = await fetchData(search, page);
  const posts = data.data;

  return (
    <main className="relative overflow-hidden">
      <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <HeaderPages class={JostFont.className} title="Blog." subtitle="On this blog I share tips and tricks, frameworks, projects, tutorials, etc."></HeaderPages>
      <SearchBar initialSearch={search} initialPage={page} />
      <Blogs data={posts} />
      <Pagination currentPage={page} />
      <div className="h-20"></div>
      <Footer />
      <div className="h-20"></div>
    </main>
  );
}

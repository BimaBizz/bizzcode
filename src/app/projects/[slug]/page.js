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

import { Jost } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SingleProject from '@/components/SingleProject'
import Footer from '@/components/Footer'

const JostFont = Jost({ subsets: ["latin"], weight:["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export async function generateMetadata({ params }) {
  const data = await getData(params)
  const isi = data[0]

  return {
    title: isi.name,
    description: isi.SEO.description,
    keywords: [isi.SEO.keywords],
    alternates: {
      canonical: '/projects/'+isi.slug,
    },
    openGraph: {
      url: 'https://www.bizzcode.site/projects/'+isi.slug,
      siteName: isi.SEO.title+' - Bizzcode',
      images: 'https://admin.bizzcode.site/storage/uploads'+isi.SEO.image.path,
      type: 'website',
    },
  }
}

async function getData({ slug }) {
    // Wait for the playlists
    const res = await fetch(`${process.env.API_URL}/content/items/projects?populate=1&filter={"slug":"${slug}"}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.API_KEY
        },
        cache : 'no-store'
    } 
    )
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }

    return res.json()
  }
   
  export default async function Page({ params }) {
    const data = await getData(params)
    const isi = data[0]
   
    return (
        <main className="relative overflow-hidden">
        <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
        <Navbar />
        <SingleProject data={isi} class={JostFont.className}/>
        <div className="h-20"></div>
        <Footer />
        <div className="h-20"></div>
      </main>
    )
  }
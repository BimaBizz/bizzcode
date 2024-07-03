import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Jost } from "next/font/google";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experient from "@/components/Experient";
import Framework from "@/components/Framework";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";


const JostFont = Jost({ subsets: ["latin"], weight:["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export async function getData() {
  const res = await fetch(process.env.API_URL+'/content/items/projects?populate=1&limit=4', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.API_KEY
    }, 
    cache: 'no-store'
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

const jsonLd = async () => {
  const data = await getData();

  return {
    "@type": "BreadcrumbList",
    "itemListElement": data.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://bizzcode.site/projects/${item.slug}`
    }))
  }
}


export default async function Home() {

  const dataProjects = await getData();

  return (
    <main className="relative overflow-hidden">
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsonLd()) }}
      >
      </script>
      <div className="background-radial-gradient absolute top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <Hero class={JostFont.className}/>
      <Projects data={dataProjects} class={JostFont.className} title="Case Studies."/>
      <Experient class={JostFont.className}/>
      <Framework class={JostFont.className}/>
      <Contact/>
      <Footer/>
      <div className="h-20"></div>
    </main>
  );
}

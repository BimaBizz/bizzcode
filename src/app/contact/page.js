import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderPages from "@/components/HeaderPages";
import { Jost } from "next/font/google";
import GetInTouch from "@/components/GetInTouch";

const JostFont = Jost({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: 'Get in touch',
  description: 'Get in touch with Bima Mahendra. I am always open to new opportunities. Reach out to me if you have any questions about anything, I will be happy to help.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    url: 'https://bizzcode.site/contact',
    siteName: 'Get in touch - Bizzcode',
    images: '/SEO/og-contact.png',
    type: 'website',
  },
}

export default function Contact() {
  return (
    <main className="relative overflow-hidden">
      <div className="background-radial-gradient absolute z-0 top-0 right-0 overflow-hidden h-full w-full hidden lg:block"></div>
      <Navbar />
      <HeaderPages className={JostFont.className} title="Get in touch." subtitle="Contact me if you have any question about anything, I will be happy to help.">
        <p className="font-semibold mt-14" data-aos="fade-up" data-aos-duration="1500">Feel free to reach out to me 👇</p>
      </HeaderPages>
      <GetInTouch />
      <div className="h-20"></div>
      <Footer />
      <div className="h-20"></div>
    </main>
  );
}

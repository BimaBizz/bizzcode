'use client'

import React, { useEffect } from "react"
import Aos from "aos"
import "aos/dist/aos.css"
import Link from "next/link"

export default function Hero(props) {

    useEffect(() => {
        Aos.init({
            once: true,
            useClassNames: true
        })
        Aos.refresh()
    },[])

    return (
        <section className={`${props.class} flex h-[50vh] md:min-h-screen flex-col justify-center w-full mx-auto max-w-5xl p-4 relative`}>
        <div className={"max-w-3xl"}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold" data-aos="fade-right" data-aos-duration="1500">😎 Hey, I&apos;m Bima.</h1>
          <h2 className="text-xl md:text-2xl font-semibold mt-5" data-aos="fade-left" data-aos-duration="1500">FrontEnd Web Developer & SEO Strategist</h2>
          <p className="text-lg my-8" data-aos="fade-up" data-aos-duration="1500"> I specialize in creating attractive and responsive user interfaces. I have in-depth knowledge of web programming languages such as HTML, CSS, and JavaScript.</p>
          <p className="font-semibold" data-aos="fade-up" data-aos-duration="1500">See my work at <Link href={"/projects"} className="text-indigo-500 underline underline-offset-4">this page</Link></p>
        </div>
      </section>
    )
}
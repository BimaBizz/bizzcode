'use client'

import React from 'react'
import Link from 'next/link'

const HeaderPages = (props) => {
  return (
    <section className={`${props.class} flex h-[50vh] flex-col justify-center w-full mx-auto max-w-5xl p-4 relative`}>
        <div className={"max-w-3xl"}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold" data-aos="fade-right" data-aos-duration="1500">{props.title}</h1>
          <h2 className="text-xl md:text-2xl font-semibold mt-5" data-aos="fade-left" data-aos-duration="1500">{props.subtitle}</h2>
          {props.children ? props.children : null}
        </div>
      </section>
  )
}

export default HeaderPages
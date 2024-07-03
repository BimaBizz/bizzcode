'use client'

import React from 'react'
import Image from 'next/image'

const Framework = (props) => {
    return (
        <section className='relative flex gap-5 flex-wrap w-full max-w-5xl mx-auto p-4 justify-center lg:justify-between items-center'>
        <h2 data-aos="fade-up" data-aos-duration="1400" className={`text-xl font-extralight text-slate-300 ${props.class}`}>a few <span>framework & languages</span> I use</h2>
        <div className='flex gap-5 justify-center items-center'>
            <Image src="/html-5-svgrepo-com.svg" alt="HTML 5" width={50} height={50} data-aos="fade-up" data-aos-duration="1500" />
            <Image src="/css-3-svgrepo-com.svg" alt="CSS" width={50} height={50} data-aos="fade-up" data-aos-duration="1700" />
            <Image src="/javascript-logo-svgrepo-com.svg" alt="JavaScript" width={40} height={40} data-aos="fade-up" data-aos-duration="1900" className=''/>
            <Image src="/nextjs-fill-svgrepo-com.svg" alt="Next.js" width={50} height={50} data-aos="fade-up" data-aos-duration="2100" />
            <Image src="/php3-svgrepo-com.svg" alt="PHP" width={50} height={50} data-aos="fade-up" data-aos-duration="2300" />
            <Image src="/reactjs-svgrepo-com.svg" alt="React" width={50} height={50} data-aos="fade-up" data-aos-duration="2500" />
            <Image src="/tailwind-svgrepo-com.svg" alt="Tailwind CSS" width={50} height={50} data-aos="fade-up" data-aos-duration="2700" />
        </div>
    </section>
  )
}

export default Framework

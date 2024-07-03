'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Projects = (props) => {

    const projects = props.data

  return (
    <section className='relative flex flex-col w-full max-w-5xl mx-auto p-4 justify-center items-center min-h-screen'>
        <h1 data-aos="fade-right" data-aos-duration="1500" className={`text-3xl font-bold self-start mb-10 ${props.class}`}>{props.title}</h1>
        <div className='grid md:grid-cols-2 gap-8 w-full p-4' vocab="https://schema.org/" typeof="BreadcrumbList">
        {projects.map((project, index) => (
            <Link href={`/projects/${project.slug}`} className='w-full' key={index} property="itemListElement" typeof="ListItem">
                <div  className='flex flex-col space-y-3 w-full group' data-aos="fade-up" data-aos-duration={1000 +(200 * index)} property="item" typeof="WebPage">
                    <div className='object-cover object-center h-[350px] rounded-xl overflow-hidden md:group-hover:scale-[1.02] md:group-hover:transition-all md:group-hover:duration-500 mb-8 group-hover:shadow-lg group-hover:shadow-indigo-300'>
                        <Image src={`https://admin.bizzcode.site/storage/uploads${project.image.path}`} width={400} height={200} alt={project.image.title} className='h-full w-auto object-cover'priority={true}/>
                    </div>
                    <div className='flex space-x-4'>
                    {project.tags.map((tag, index) => (
                        <div key={index} className='text-sm text-slate-300 uppercase'>
                            <h2>{tag.name}</h2>
                        </div>
                    ))}
                    </div>
                    <h1 className='text-lg font-bold group-hover:text-indigo-500 transition-colors'>{project.name}</h1>
                    <div dangerouslySetInnerHTML={{__html: project.deskripsi.substring(0, 100)+"..."}} className='text-wrap text-slate-300'></div>
                </div>
                <meta property="position" content={index+1}></meta>
            </Link>
        ))}
        </div>
    </section>
  )
}

export default Projects
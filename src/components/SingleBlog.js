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

'use client'

import React from 'react'
import Image from 'next/image'

const SingleBlog = (props) => {

    const blog = props.data

    function fixImageUrls(htmlContent) {
        // Ganti semua kemunculan URL gambar relatif dengan URL absolut dan tambahkan alt pada gambar
        return htmlContent.replace(/src="([^"]*)"/g, (match, src) => {
            const altText = src.split('/').pop().replace(/\.(png|jpg|jpeg|gif)$/i, '');
            return `src="https://admin.bizzcode.site${src}" alt="${altText}"`;
        });
    }
  return (
    <section className='relative'>
        <div className='flex flex-col md:flex-row w-full max-w-5xl justify-center items-center mx-auto p-4 gap-10'>
            <div className='object-center rounded-xl overflow-hidden w-full h-[400px]' data-aos="fade-up" data-aos-duration="1500">
                <Image src={`https://admin.bizzcode.site/storage/uploads${blog.image[0].path}`} width={950} height={800} alt={blog.image[0].title} className='h-full w-full object-cover' priority={true}/>
            </div>
        </div>
        <div className='w-full max-w-5xl mx-auto p-4 mt-5 flex items-center' data-aos="fade-up" data-aos-duration="1800">
            <Image src="/images/bima.png" alt="HTML 5" width={50} height={50} className='rounded-full'/>
            <p className='text-slate-300 text-sm ml-3'>Created by Bima Mahendra <span className='text-slate-300'>| {blog.upload_at}</span></p>
        </div>
        <h1 className='text-3xl font-bold max-w-5xl mx-auto p-4' data-aos="fade-up" data-aos-duration="2000">{blog.titile}</h1>
        <div className='w-full max-w-5xl mx-auto p-4'>
            <hr className='border-slate-400 mb-5' data-aos="fade-up" data-aos-duration="1500"/>
            <div id='post' dangerouslySetInnerHTML={{__html: fixImageUrls(blog.post)}} className='text-wrap text-slate-300 text-justify text-lg' data-aos="fade-up" data-aos-duration="1500"></div>
        </div>

    </section>
  )
}

export default SingleBlog
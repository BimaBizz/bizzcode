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

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SingleBlog = (props) => {
    const blog = props.data

    function fixImageUrls(htmlContent) {
        // Ganti semua kemunculan URL gambar relatif dengan URL absolut dan tambahkan alt pada gambar
        return htmlContent.replace(/src="([^"]*)"/g, (match, src) => {
            const altText = src.split('/').pop().replace(/\.(png|jpg|jpeg|gif)$/i, '');
            return `src="https://admin.bizzcode.site${src}" alt="${altText}"`;
        });
    }

    useEffect(() => {
        const pres = document.querySelectorAll('#post pre');
        pres.forEach((pre, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('relative', 'mb-4');

            const button = document.createElement('button');
            button.innerHTML = 'Copy <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>';
            button.classList.add('absolute', 'top-0', 'right-0', 'mt-3', 'mr-3', 'px-3', 'py-1', 'bg-indigo-500', 'text-white', 'rounded-lg', 'copy-button', 'text-sm');

            button.onclick = () => {
                navigator.clipboard.writeText(pre.textContent).then(() => {
                    button.innerHTML = 'Copied <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                    setTimeout(() => {
                        button.innerHTML = 'Copy <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>';
                    }, 2000);
                });
            };

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(button);
        });
    }, [blog.post]);

    return (
        <section className='relative' itemscope itemtype="https://schema.org/BlogPosting">
            <div className='flex flex-col md:flex-row w-full max-w-5xl justify-center items-center mx-auto p-4 gap-10'>
                <div className='object-center rounded-xl overflow-hidden w-full h-[400px]' data-aos="fade-up" data-aos-duration="1500">
                    <Image src={`https://admin.bizzcode.site/storage/uploads${blog.image[0].path}`} width={950} height={800} alt={blog.image[0].title} className='h-full w-full object-cover' priority={true} itemProp="image" content={`https://admin.bizzcode.site/storage/uploads${blog.image[0].path}`}/>
                </div>
            </div>
            <div className='text-slate-300 max-w-5xl mx-auto text-sm p-4 flex justify-between items-center mt-5' data-aos="fade-up" data-aos-duration="1800">
            <div className='flex items-center' itemprop="author" itemscope itemtype="https://schema.org/Person">
              <Link href='https://bizzcode.site/about' itemProp="url" className='flex items-center'>
                <Image src="/images/bima.png" alt="HTML 5" width={50} height={50} className='rounded-full'/>
                <p className='text-slate-300 text-sm ml-3'itemprop="name">Created by Bima Mahendra</p>
              </Link>
            </div>
            <p className='' itemProp="datePublished" content={blog.upload_at}>Upload at : {blog.upload_at}</p>
            </div>
            <h1 className='text-3xl font-bold max-w-5xl mx-auto p-4' data-aos="fade-up" data-aos-duration="2000" itemprop="headline">{blog.titile}</h1>
            <div className='w-full max-w-5xl mx-auto p-4'>
                <hr className='border-slate-400 mb-5' data-aos="fade-up" data-aos-duration="1500"/>
                <div id='post' dangerouslySetInnerHTML={{__html: fixImageUrls(blog.post)}} className='text-wrap text-slate-300 text-justify text-lg' data-aos="fade-up" data-aos-duration="1500"></div>
            </div>
        </section>
    )
}

export default SingleBlog

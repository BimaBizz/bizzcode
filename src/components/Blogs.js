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

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Blogs = (props) => {
  const data = props.data;

  return (
    <section className="relative max-w-5xl 2xl:max-w-7xl mx-auto p-4 min-h-[70vh] flex items-center justify-center">
      {data && data.length > 0 ? (
        <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 w-full">
          {data.map((blog, index) => (
            <Link href={`/blogs/${blog.slug}`} className="text-lg font-bold group-hover:text-indigo-500 transition-colors" key={index}>
              <div className="flex flex-col space-y-3 w-full group" data-aos="fade-up" data-aos-duration={1000 + 200 * index}>
                <div className="object-cover object-center h-[350px] rounded-xl overflow-hidden group-hover:scale-[1.02] group-hover:transition-all group-hover:duration-500 mb-8">
                  <Image src={"https://admin.bizzcode.site/storage/uploads" + blog.image[0].path} width={400} height={200} alt={blog.image[0].title} className="h-full w-auto object-cover" priority={true} />
                </div>
                <h1 className="text-lg font-bold group-hover:text-indigo-500 transition-colors 2xl:text-xl">{blog.titile}</h1>
                <div dangerouslySetInnerHTML={{ __html: blog.post.substring(0, 100) + "..." }} className="text-wrap text-base 2xl:text-lg font-normal text-slate-300"></div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h1 className="text-center text-3xl font-bold mt-10" data-aos="fade-right" data-aos-duration="1500">
          Not Found
        </h1>
      )}
    </section>
  );
};

export default Blogs;

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

const Projects = (props) => {
  const projects = props.data;

  return (
    <section className="relative flex flex-col w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4 justify-center items-center min-h-screen 2xl:min-h-[50vh]" typeof="BreadcrumbList">
      <h1 data-aos="fade-right" data-aos-duration="1500" className={`text-3xl 2xl:text-4xl font-bold self-start mb-10 ${props.class}`}>
        {props.title}
      </h1>
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 w-full" vocab="https://schema.org/" property="itemListElement" typeof="ListItem">
        {projects.map((project, index) => (
          <Link href={`/projects/${project.slug}`} className="w-full" key={index} property="position" content={index + 1} itemID={`https://admin.bizzcode.site/projects/${project.slug}`}>
            <div className="flex flex-col space-y-3 w-full group" data-aos="fade-up" data-aos-duration={1000 + 200 * index} property="item" typeof="WebPage">
              <div className="object-cover object-center h-[350px] rounded-xl overflow-hidden md:group-hover:scale-[1.02] md:group-hover:transition-all md:group-hover:duration-500 mb-8">
                <Image src={`https://admin.bizzcode.site/storage/uploads${project.image.path}`} width={400} height={200} alt={project.image.title} className="h-full w-auto object-cover" priority={true} />
              </div>
              <div className="flex space-x-4">
                {project.tags.map((tag, index) => (
                  <div key={index} className="text-sm text-slate-300 uppercase">
                    <h2 className="text-base 2xl:text-lg">{tag.name}</h2>
                  </div>
                ))}
              </div>
              <h1 className="text-lg 2xl:text-2xl font-bold group-hover:text-indigo-500 transition-colors" itemProp="name">
                {project.name}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: project.deskripsi.substring(0, 100) + "..." }} className="text-wrap text-slate-300 text-base 2xl:text-lg"></div>
            </div>
            <meta></meta>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Projects;

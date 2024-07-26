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

const SingleProject = (props) => {
  const project = props.data;

  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row w-full max-w-5xl 2xl:max-w-7xl justify-center items-center mx-auto p-4 gap-10">
        <div className="object-center rounded-xl overflow-hidden w-full lg:w-1/2 h-[350px]" data-aos="fade-up" data-aos-duration="1500">
          <Image src={`https://admin.bizzcode.site/storage/uploads${project.image.path}`} width={project.image.width} height={project.image.height} alt={project.image.title} className="h-full w-full object-cover" />
        </div>
        <div className="self-start w-full lg:w-1/2">
          <h1 className={"text-3xl font-bold md:text-4xl lg:text-5xl 2xl:text-6xl mb-4" + props.class} data-aos="fade-right" data-aos-duration="1500">
            {project.name}
          </h1>
          <div className="flex space-x-4 mt-4 bg-indigo-500 rounded-lg py-2 px-4 justify-center items-center w-full md:w-fit" data-aos="fade-right" data-aos-duration="1500">
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M8.64 4.737A7.97 7.97 0 0 1 12 4a7.997 7.997 0 0 1 6.933 4.006h-.738c-.65 0-1.177.25-1.177.9 0 .33 0 2.04-2.026 2.008-1.972 0-1.972-1.732-1.972-2.008 0-1.429-.787-1.65-1.752-1.923-.374-.105-.774-.218-1.166-.411-1.004-.497-1.347-1.183-1.461-1.835ZM6 4a10.06 10.06 0 0 0-2.812 3.27A9.956 9.956 0 0 0 2 12c0 5.289 4.106 9.619 9.304 9.976l.054.004a10.12 10.12 0 0 0 1.155.007h.002a10.024 10.024 0 0 0 1.5-.19 9.925 9.925 0 0 0 2.259-.754 10.041 10.041 0 0 0 4.987-5.263A9.917 9.917 0 0 0 22 12a10.025 10.025 0 0 0-.315-2.5A10.001 10.001 0 0 0 12 2a9.964 9.964 0 0 0-6 2Zm13.372 11.113a2.575 2.575 0 0 0-.75-.112h-.217A3.405 3.405 0 0 0 15 18.405v1.014a8.027 8.027 0 0 0 4.372-4.307ZM12.114 20H12A8 8 0 0 1 5.1 7.95c.95.541 1.421 1.537 1.835 2.415.209.441.403.853.637 1.162.54.712 1.063 1.019 1.591 1.328.52.305 1.047.613 1.6 1.316 1.44 1.825 1.419 4.366 1.35 5.828Z"
                clipRule="evenodd"
              />
            </svg>
            <Link href={project.demo} className="text-md" type="button">
              View Project
            </Link>
          </div>
          <hr className="border-slate-400 my-5" data-aos="fade-up" data-aos-duration="1500" />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-slate-400" data-aos="fade-up" data-aos-duration="1500">
              <thead className="text-xs font-se text-indigo-500 uppercase bg-[#1c1d2c]">
                <tr>
                  <td scope="col" className="px-6 py-3">
                    definition
                  </td>
                  <td scope="col" className="px-6 py-3">
                    value
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-300 whitespace-nowrap">
                    Tech StackTags
                  </th>
                  <td className="px-6 py-4 flex-wrap flex gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag._id} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {tag.name}
                      </span>
                    ))}
                  </td>
                </tr>
                <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-300 whitespace-nowrap">
                    Website Colors
                  </th>
                  <td className="px-6 py-4 flex">
                    {project.image.colors.map((color, index) => (
                      <div key={index} className="h-5 w-5 border rounded-full mr-1" style={{ backgroundColor: color }}></div>
                    ))}
                  </td>
                </tr>
                <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-300 whitespace-nowrap">
                    Website url
                  </th>
                  <td className="px-6 py-4 flex">{project.demo}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4">
        <hr className="border-slate-400 mb-5" data-aos="fade-up" data-aos-duration="1500" />
        <div dangerouslySetInnerHTML={{ __html: project.deskripsi }} className="text-wrap text-slate-300 text-justify text-lg 2xl:text-[20px] leading-normal 2xl:leading-relaxed" data-aos="fade-up" data-aos-duration="1500"></div>
      </div>
    </section>
  );
};

export default SingleProject;

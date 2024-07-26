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

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Using Atom One Dark theme as per your example

const SingleBlog = (props) => {
  const blog = props.data;

  function fixImageUrls(htmlContent) {
    // Ganti semua kemunculan URL gambar relatif dengan URL absolut dan tambahkan alt pada gambar
    return htmlContent.replace(/src="([^"]*)"/g, (match, src) => {
      const altText = src
        .split("/")
        .pop()
        .replace(/\.(png|jpg|jpeg|gif)$/i, "");
      return `src="https://admin.bizzcode.site${src}" alt="${altText}"`;
    });
  }

  useEffect(() => {
    const pres = document.querySelectorAll("#post pre");

    const preElements = Array.from(pres).map((pre) => {
      // Save the original content
      const originalContent = pre.innerHTML;

      // Replace <br> with new lines in <code>
      const codeContent = originalContent.replace(/<br\s*\/?>/gi, "\n");
      pre.innerHTML = `<code>${codeContent}</code>`;
      const code = pre.querySelector("code");

      // Add necessary classes to <pre>
      pre.classList.add("hljs", "theme-atom-one-dark", "shadow-3xl", "text-sm", "relative", "overflow-hidden", "max-w-full", "h-full");

      // Add class to the <code> tag
      code.classList.add("hljs");

      // Set white-space style to pre-wrap to preserve new lines and spaces
      code.style.whiteSpace = "pre-wrap";

      // Apply Highlight.js syntax highlighting to the code element with error handling
      try {
        hljs.highlightElement(code);
      } catch (error) {
        console.error("Error highlighting code:", error);
      }

      // Create the copy button
      const button = document.createElement("button");
      button.innerHTML = `<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/></svg>`;
      button.classList.add("absolute", "top-1", "right-0", "mt-3", "mr-3", "p-2", "bg-indigo-500", "text-white", "rounded-lg", "copy-button", "text-sm");

      button.onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code.textContent).then(() => {
            button.innerHTML = `<svg class="w-4 h-4 inline mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/></svg>Copied!`;
            setTimeout(() => {
              button.innerHTML =
                '<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/></svg>';
            }, 2000);
          });
        } else {
          alert("Clipboard API not available");
        }
      };

      // Append the button to the pre element but outside the code tag
      pre.appendChild(button);
    });
  }, [blog.post]);

  return (
    <section className="relative" itemScope itemType="https://schema.org/BlogPosting">
      <div className="flex flex-col md:flex-row w-full max-w-5xl 2xl:max-w-7xl justify-center items-center mx-auto p-4 gap-10">
        <div className="object-center rounded-xl overflow-hidden w-full h-[400px] 2xl:h-[500px]" data-aos="fade-up" data-aos-duration="1500">
          <Image
            src={`https://admin.bizzcode.site/storage/uploads${blog.image[0].path}`}
            width={950}
            height={800}
            alt={blog.image[0].title}
            className="h-full w-full object-cover"
            priority={true}
            itemProp="image"
            content={`https://admin.bizzcode.site/storage/uploads${blog.image[0].path}`}
          />
        </div>
      </div>
      <div className="text-slate-300 max-w-5xl 2xl:max-w-7xl mx-auto text-sm p-4 flex justify-between items-center mt-5" data-aos="fade-up" data-aos-duration="1800">
        <div className="flex items-center" itemProp="author" itemScope itemType="https://schema.org/Person">
          <Link href="https://bizzcode.site/about" itemProp="url" className="flex items-center">
            <Image src="/images/bima.png" alt="HTML 5" width={50} height={50} className="rounded-full" />
            <p className="text-slate-300 text-sm 2xl:text-lg ml-3" itemProp="name">
              Created by Bima Mahendra
            </p>
          </Link>
        </div>
        <p className="" itemProp="datePublished" content={blog.upload_at}>
          Upload at : {blog.upload_at}
        </p>
      </div>
      <h1 className="text-3xl 2xl:text-5xl font-bold max-w-5xl 2xl:max-w-7xl mx-auto p-4" data-aos="fade-up" data-aos-duration="2000" itemProp="headline">
        {blog.titile}
      </h1>
      <div className="w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4">
        <hr className="border-slate-400 mb-5" data-aos="fade-up" data-aos-duration="1500" />
        <div id="post" dangerouslySetInnerHTML={{ __html: fixImageUrls(blog.post) }} className="text-wrap text-slate-300 text-justify text-lg 2xl:text-[20px] leading-relaxed" data-aos="fade-up" data-aos-duration="1500"></div>
      </div>
    </section>
  );
};

export default SingleBlog;

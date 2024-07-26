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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    Aos.init({
      once: true,
    });
    Aos.refresh();
  }, []);

  const toogler = () => {
    setOpen(!open);
  };

  return (
    <>
      <nav className="flex w-full max-w-5xl items-center justify-between mx-auto px-4 py-14 relative 2xl:max-w-7xl">
        <Link href="/" className="text-3xl font-bold flex items-center" data-aos="fade-right" data-aos-duration="1500">
          <Image src="/iconbg.svg" alt="logo" width={100} height={100} className="mr-2 h-12 w-12 md:h-16 md:w-16 2xl:w-20 2xl:h-20" />
        </Link>
        <button onClick={toogler} className="md:hidden" data-aos="fade-left" data-aos-duration="1500" aria-label="menu">
          <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>
        <ul className="hidden md:flex justify-center space-x-12 items-center md:text-base 2xl:text-xl">
          <li className={`overflow-hidden group ${pathname === "/projects" ? "text-white border-white" : "text-slate-300 hover:text-white"}`} data-aos="fade-up" data-aos-duration="1000">
            <Link href="/projects">Works</Link>
            <hr className={`border-[1.5px] ${pathname === "/projects" ? "border-white translate-x-[1px]" : "border-slate-300 hover:border-white "} -translate-x-[101%] w-[75%] group-hover:translate-x-0 transition-all duration-500`} />
          </li>
          <li className={`overflow-hidden group ${pathname === "/about" ? "text-white border-white" : "text-slate-300 hover:text-white"}`} data-aos="fade-up" data-aos-duration="1500">
            <Link href="/about">About Me</Link>
            <hr className={`border-[1.5px] ${pathname === "/about" ? "border-white translate-x-[1px]" : "border-slate-300 hover:border-white"} -translate-x-[101%] w-[75%] group-hover:translate-x-0 transition-all duration-500`} />
          </li>
          <li className={`overflow-hidden group ${pathname === "/blogs" ? "text-white border-white" : "text-slate-300 hover:text-white"}`} data-aos="fade-up" data-aos-duration="2000">
            <Link href="/blogs">Blogs</Link>
            <hr className={`border-[1.5px] ${pathname === "/blogs" ? "border-white translate-x-[1px]" : "border-slate-300 hover:border-white"} -translate-x-[101%] w-[75%] group-hover:translate-x-0 transition-all duration-500`} />
          </li>
          <li className={`overflow-hidden group ${pathname === "/certificate" ? "text-white border-white" : "text-slate-300 hover:text-white"}`} data-aos="fade-up" data-aos-duration="2500">
            <Link href="/certificate">Certificates</Link>
            <hr className={`border-[1.5px] ${pathname === "/certificate" ? "border-white translate-x-[1px]" : "border-slate-300 hover:border-white"} -translate-x-[101%] w-[75%] group-hover:translate-x-0 transition-all duration-500`} />
          </li>
          <li className={`overflow-hidden group ${pathname === "/contact" ? "text-white border-white" : "text-slate-300 hover:text-white"}`} data-aos="fade-up" data-aos-duration="2500">
            <Link href="/contact">Get in touch</Link>
            <hr className={`border-[1.5px] ${pathname === "/contact" ? "border-white translate-x-[1px]" : "border-slate-300 hover:border-white"} -translate-x-[101%] w-[75%] group-hover:translate-x-0 transition-all duration-500`} />
          </li>
        </ul>
      </nav>
      <div className={`${open ? "" : "hidden"} md:hidden bg-slate-50/80 z-30 backdrop-blur-sm fixed top-0 left-0 w-full h-screen`}>
        <button onClick={toogler} className="flex p-5 justify-center items-center text-center w-full text-indigo-700 font-semibold">
          <svg className="w-6 h-6 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
          </svg>
          Close Menu
        </button>
        <ul className="flex flex-col justify-center space-y-5 items-center h-[80%] text-3xl font-bold text-indigo-700">
          <li className={`hover:underline hover:underline-offset-4 ${pathname === "/projects" ? "text-indigo-500 underline underline-offset-4" : ""}`}>
            <Link href="/projects">Works</Link>
          </li>
          <li className={`hover:underline hover:underline-offset-4 ${pathname === "/about" ? "text-indigo-500 underline underline-offset-4" : ""}`}>
            <Link href="/about">About Me</Link>
          </li>
          <li className={`hover:underline hover:underline-offset-4 ${pathname === "/blogs" ? "text-indigo-500 underline underline-offset-4" : ""}`}>
            <Link href="/blogs">Blogs</Link>
          </li>
          <li className={`hover:underline hover:underline-offset-4 ${pathname === "/certificate" ? "text-indigo-500 underline underline-offset-4" : ""}`}>
            <Link href="/certificate">Certificates</Link>
          </li>
          <li className={`hover:underline hover:underline-offset-4 ${pathname === "/contact" ? "text-indigo-500 underline underline-offset-4" : ""}`}>
            <Link href="/contact">Get in touch</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;

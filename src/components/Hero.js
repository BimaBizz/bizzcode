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
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function Hero(props) {
  useEffect(() => {
    Aos.init({
      once: true,
      useClassNames: true,
    });
    Aos.refresh();
  }, []);

  return (
    <section className={`${props.class} flex h-[50vh] md:min-h-screen 2xl:min-h-[70vh] flex-col justify-center w-full mx-auto max-w-5xl p-4 relative 2xl:max-w-7xl`}>
      <div className={"max-w-3xl 2xl:max-w-4xl"}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold" data-aos="fade-right" data-aos-duration="1500">
          😎 Hey, I&apos;m Bima.
        </h1>
        <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold mt-5" data-aos="fade-left" data-aos-duration="1500">
          FrontEnd Web Developer & SEO Strategist
        </h2>
        <p className="text-lg 2xl:text-2xl my-8" data-aos="fade-up" data-aos-duration="1500">
          {" "}
          I specialize in creating attractive and responsive user interfaces. I have in-depth knowledge of web programming languages such as HTML, CSS, and JavaScript.
        </p>
        <p className="font-semibold 2xl:text-2xl" data-aos="fade-up" data-aos-duration="1500">
          See my work at{" "}
          <Link href={"/projects"} className="text-white md:text-indigo-500 underline underline-offset-4">
            this page
          </Link>
        </p>
      </div>
    </section>
  );
}

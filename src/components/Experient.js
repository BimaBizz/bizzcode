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

import Link from "next/link";
import React from "react";

const Experient = (props) => {
  return (
    <section className="relative flex flex-col w-full max-w-5xl 2xl:max-w-7xl mx-auto p-4 justify-center items-center min-h-screen 2xl:min-h-[70vh]">
      <div className="max-w-3xl 2xl:max-w-4xl self-start">
        <h1 data-aos="fade-right" data-aos-duration="1500" className={`text-3xl 2xl:text-4xl font-bold self-start mb-10 ${props.class}`}>
          🧑‍💻 My Lerning Path.
        </h1>
        <p data-aos="fade-left" data-aos-duration="1500" className="text-base 2xl:text-lg text-slate-300">
          My learning path as a front-end web developer has been both challenging and rewarding. Starting with the basics of HTML and CSS, I quickly advanced to JavaScript and modern frameworks like React and Next.js. Through various
          projects, I&apos;ve gained hands-on experience in responsive design, CSS animations, and API integration.
        </p>
        <div className="mt-16" data-aos="fade-up" data-aos-duration="1500">
          <Link href={"/about"} className="text-indigo-500 underline underline-offset-4 font-bold transition-colors text-base 2xl:text-xl">
            About Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Experient;

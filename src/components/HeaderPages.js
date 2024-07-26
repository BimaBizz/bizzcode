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

const HeaderPages = (props) => {
  return (
    <section className={`${props.class} flex min-h-[70vh] flex-col justify-center w-full mx-auto max-w-5xl 2xl:max-w-7xl p-4 relative 2xl:min-h-[80vh]`}>
      <div className={"max-w-3xl 2xl:max-w-5xl"}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold" data-aos="fade-right" data-aos-duration="1500">
          {props.title}
        </h1>
        <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold mt-5" data-aos="fade-left" data-aos-duration="1500">
          {props.subtitle}
        </h2>
        {props.children ? props.children : null}
      </div>
    </section>
  );
};

export default HeaderPages;

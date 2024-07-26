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

import { useRouter } from "next/navigation";
import Aos from "aos";
import { useEffect } from "react";

export default function Pagination({ currentPage }) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    router.push(`/blogs?page=${newPage}`);
  };

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="relative mx-auto max-w-5xl 2xl:max-w-7xl mt-10 flex items-center justify-between p-4" data-aos="fade-up" data-aos-duration="2000">
      <div className="w-full flex justify-start">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="disabled:opacity-50 bg-indigo-500 px-4 py-2 rounded-lg">
          Previous
        </button>
      </div>
      <p className="min-w-fit">Page {currentPage}</p>
      <div className="w-full flex justify-end">
        <button onClick={() => handlePageChange(currentPage + 1)} className="disabled:opacity-50 bg-indigo-500 px-4 py-2 rounded-lg">
          Next
        </button>
      </div>
    </div>
  );
}

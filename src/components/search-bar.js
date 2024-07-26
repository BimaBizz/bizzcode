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

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ initialSearch }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialSearch);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/blogs?search=${searchInput}`);
  };

  return (
    <div className="mx-auto max-w-5xl 2xl:max-w-7xl p-4 relative">
      <form onSubmit={handleSubmit} className="border text-[#1c1d2c] my-7 border-gray-300 rounded-md p-4 w-full flex items-center bg-white" data-aos="fade-up" data-aos-duration="1500">
        <label htmlFor="search-input" className="block mr-2">
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </label>
        <input id="search-input" type="text" className="w-full outline-none" placeholder="Search..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <button type="submit" className="hidden"></button>
      </form>
    </div>
  );
}

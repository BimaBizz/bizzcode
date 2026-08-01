import { LuChevronRight } from "react-icons/lu";

/**
 * JobTitleComponent
 * 
 * Renders a job title badge with icon.
 * 
 * Data structure:
 * {
 *   title: string - Job title text
 * }
 */

export default function JobTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";

  if (!title) return null;

  return (
    <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold px-5 py-2.5 bg-[#0F3D24] text-[#B9F5D0] rounded-[16px] uppercase tracking-wider my-8">
      <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
      <h3 className="text-xs sm:text-sm font-bold tracking-wider">{title}</h3>
    </div>
  );
}

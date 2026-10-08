/**
 * JobTitleComponent
 * 
 * Renders a job title badge with status indicator.
 */

export default function JobTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";

  if (!title) return null;

  return (
    <div className="inline-flex items-center gap-2.5 text-xs font-mono font-medium px-3.5 py-1.5 bg-[#181818] text-[#FAFAFA] border border-[#27272A] rounded-md my-4">
      <span className="w-2 h-2 rounded-full bg-[#E8452C] animate-pulse" />
      <h3 className="text-xs font-mono font-semibold tracking-wide uppercase">{title}</h3>
    </div>
  );
}

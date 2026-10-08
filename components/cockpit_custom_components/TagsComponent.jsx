/**
 * TagsComponent
 * 
 * Renders technical tags/badges with status indicator.
 */

export default function TagsComponent({ data }) {
  const singleTag = typeof data?.title === "string" ? data.title.trim() : "";
  const tags = Array.isArray(data?.tags)
    ? data.tags.map((entry) => String(entry).trim()).filter(Boolean)
    : singleTag
      ? [singleTag]
      : [];

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {tags.map((tag, index) => (
        <div
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#181818] text-[#FAFAFA] border border-[#27272A]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8452C]" />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
}

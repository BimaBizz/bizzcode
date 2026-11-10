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
          className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#FAF7F0] text-[#111111] border border-[#111111]/15"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E]" />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
}

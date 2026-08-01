/**
 * TagsComponent
 * 
 * Renders tags/badges with pulse indicator.
 * 
 * Data structure:
 * {
 *   title: string      - Single tag text
 *   tags: string[]     - Multiple tags (optional)
 * }
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
    <div className="flex flex-wrap gap-2.5 my-3">
      {tags.map((tag, index) => {
        const variantClass =
          index % 3 === 0
            ? "bg-[#0F3D24] text-[#B9F5D0]"
            : index % 3 === 1
            ? "bg-[#0B3B36] text-[#B0F5EC]"
            : "bg-[#3D3410] text-[#FBEFB8]";

        return (
          <div
            key={`${tag}-${index}`}
            className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-[16px] uppercase tracking-wider ${variantClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{tag}</span>
          </div>
        );
      })}
    </div>
  );
}

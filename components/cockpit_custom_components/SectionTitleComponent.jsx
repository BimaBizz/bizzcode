/**
 * SectionTitleComponent
 * 
 * Renders a section title with optional text highlighting.
 */

export default function SectionTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";
  const highlight = typeof data?.highlight === "string" ? data.highlight.trim() : "";

  if (!title) return null;

  const Tag = data?.as === "h1" || data?.level === 1 || data?.tag === "h1" || data?.isH1 ? "h1" : "h2";

  if (!highlight) {
    return (
      <Tag className="text-3xl md:text-5xl font-bold tracking-tight text-[#FAFAFA]">
        {title}
      </Tag>
    );
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = title.split(regex);

  return (
    <Tag className="text-3xl md:text-5xl font-bold tracking-tight text-[#FAFAFA]">
      {parts.map((part, index) => (
        part.toLowerCase() === highlight.toLowerCase() ? (
          <em key={`${part}-${index}`} className="text-[#E8452C] not-italic font-semibold">
            {part}
          </em>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      ))}
    </Tag>
  );
}

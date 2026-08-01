/**
 * SectionTitleComponent
 * 
 * Renders a section title with optional text highlighting.
 * 
 * Data structure:
 * {
 *   title: string      - Main heading text
 *   highlight: string  - Text to highlight (optional)
 * }
 */

export default function SectionTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";
  const highlight = typeof data?.highlight === "string" ? data.highlight.trim() : "";

  if (!title) return null;

  if (!highlight) {
    return <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold font-heading tracking-tight text-[#EAF6EF]">{title}</h2>;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = title.split(regex);

  return (
    <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold font-heading tracking-tight text-[#EAF6EF]">
      {parts.map((part, index) => (
        part.toLowerCase() === highlight.toLowerCase() ? (
          <em key={`${part}-${index}`} className="italic font-normal text-[#4ADE80] not-italic">
            {part}
          </em>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      ))}
    </h2>
  );
}

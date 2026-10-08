import Link from "next/link";

export default function CardTagsComponent({ data }) {
  if (!data) return null;

  const title = typeof data.title === "string" ? data.title : "";
  const subTitle = typeof data.subTitle === "string" ? data.subTitle : "";
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const cta = data.cta || {};

  return (
    <article className="w-full h-full bg-[#121212] border border-[#27272A] rounded-xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col mb-5">
          {title && (
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#FAFAFA]">
              {title}
            </h3>
          )}
          {subTitle && (
            <p className="text-[#A1A1AA] text-xs leading-relaxed mt-1 font-normal">
              {subTitle}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            {tags.map((tag, index) => {
              if (typeof tag !== "string" || !tag.trim()) return null;
              return (
                <span
                  key={index}
                  className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] font-mono text-xs px-2.5 py-1 rounded-md"
                >
                  {tag.trim()}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      {cta.caption && (
        <div className="mt-auto pt-4">
          <Link
            href={cta.link || "#"}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E8452C] hover:text-[#d43c24] transition-colors"
          >
            <span>{cta.caption}</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      )}
    </article>
  );
}

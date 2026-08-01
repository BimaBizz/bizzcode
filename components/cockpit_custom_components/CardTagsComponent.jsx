import Link from "next/link";

export default function CardTagsComponent({ data }) {
  if (!data) return null;

  const title = typeof data.title === "string" ? data.title : "";
  const subTitle = typeof data.subTitle === "string" ? data.subTitle : "";
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const cta = data.cta || {};

  return (
    <article className="w-full h-full bg-[#0F221A] border border-[#1E3A2C] rounded-[28px] p-8 md:p-10 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col mb-6">
          {title && (
            <h3 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-[#EAF6EF] mt-2">
              {title}
            </h3>
          )}
          {subTitle && (
            <p className="text-[#8FAB9C] text-sm md:text-[0.95rem] mt-2 font-normal">
              {subTitle}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-6 mb-8">
            {tags.map((tag, index) => {
              if (typeof tag !== "string" || !tag.trim()) return null;
              return (
                <span
                  key={index}
                  className="bg-[#0B3B36] text-[#B0F5EC] border border-[#1E3A2C]/60 font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-[12px] font-medium"
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
            className="inline-flex items-center gap-1.5 text-sm md:text-[0.95rem] font-bold text-[#4ADE80] hover:text-[#5EEAD4] transition-colors duration-200"
          >
            <span>{cta.caption}</span>
            <span className="text-lg leading-none transform translate-y-[0.5px]">→</span>
          </Link>
        </div>
      )}
    </article>
  );
}

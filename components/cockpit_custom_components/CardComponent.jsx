import Image from "next/image";

export default function CardComponent({ data }) {
  const title = typeof data?.title === "string" && data.title.trim() ? data.title.trim() : "";
  const subTitle = typeof data?.subTitle === "string" && data.subTitle.trim() ? data.subTitle.trim() : "";

  const imageData = data?.image && typeof data.image === "object" ? data.image : null;
  const isImageHidden = Boolean(imageData?.hidden);
  const imagePath = imageData?.img?.path || imageData?.img?.url || "";

  return (
    <article className="rounded-xl bg-[#121212] border border-[#27272A] hover:border-[#3F3F46] p-6 md:p-8 shadow-xl transition-colors">
      {!isImageHidden && imagePath ? (
        <Image
          src={imagePath}
          alt={title || "Card image"}
          width={48}
          height={48}
          className="mb-4 h-12 w-12 rounded-lg object-cover"
          unoptimized
        />
      ) : null}

      {title ? <h3 className="text-xl md:text-2xl font-bold text-[#FAFAFA] tracking-tight leading-snug">{title}</h3> : null}
      {subTitle ? <p className="mt-2 text-xs uppercase font-mono font-medium tracking-wider text-[#A1A1AA]">{subTitle}</p> : null}
    </article>
  );
}
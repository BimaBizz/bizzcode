import Image from "next/image";

export default function CardComponent({ data }) {
  const title = typeof data?.title === "string" && data.title.trim() ? data.title.trim() : "";
  const subTitle = typeof data?.subTitle === "string" && data.subTitle.trim() ? data.subTitle.trim() : "";

  const imageData = data?.image && typeof data.image === "object" ? data.image : null;
  const isImageHidden = Boolean(imageData?.hidden);
  const imagePath = imageData?.img?.path || imageData?.img?.url || "";

  return (
    <article className="rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] bg-[#0F221A] border border-[#1E3A2C] p-6 md:p-8 shadow-lg">
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

      {title ? <h3 className="font-heading text-2xl md:text-3xl font-semibold text-[#EAF6EF] tracking-tight leading-snug">{title}</h3> : null}
      {subTitle ? <p className="mt-2 text-xs uppercase font-bold tracking-wider text-[#8FAB9C]">{subTitle}</p> : null}
    </article>
  );
}
export default function DetailContactComponent({ data }) {
  if (!data) return null;

  const iconHtml = typeof data.icon === "string" ? data.icon : "";
  const title = typeof data.title === "string" ? data.title : "";
  const subTitle = typeof data.subTitle === "string" ? data.subTitle : "";

  return (
    <div className="flex items-center gap-4 py-2 select-text">
      <style dangerouslySetInnerHTML={{
        __html: `
        .detail-contact-icon svg {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      `}} />

      {/* Icon Container */}
      {iconHtml && (
        <div
          className="h-12 w-12 flex items-center justify-center p-2.5 rounded-2xl bg-[#0F3D24] text-[#4ADE80] border border-[#1E3A2C] detail-contact-icon"
          dangerouslySetInnerHTML={{ __html: iconHtml }}
        />
      )}

      {/* Text Container */}
      <div className="flex flex-col">
        {title && (
          <span className="text-xs font-bold text-[#4ADE80] font-mono tracking-widest uppercase">
            {title}
          </span>
        )}
        {subTitle && (
          <h4 className="font-heading text-lg md:text-xl font-bold tracking-tight text-[#EAF6EF] mt-1 leading-tight">
            {subTitle}
          </h4>
        )}
      </div>
    </div>
  );
}

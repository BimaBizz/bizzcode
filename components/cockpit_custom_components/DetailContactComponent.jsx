export default function DetailContactComponent({ data }) {
  if (!data) return null;

  const iconHtml = typeof data.icon === "string" ? data.icon : "";
  const title = typeof data.title === "string" ? data.title : "";
  const subTitle = typeof data.subTitle === "string" ? data.subTitle : "";

  return (
    <div className="flex items-center gap-3.5 py-2 select-text">
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
          className="h-10 w-10 shrink-0 flex items-center justify-center p-2 rounded-lg bg-[#111111] text-[#D9541E] border border-[#111111] detail-contact-icon"
          dangerouslySetInnerHTML={{ __html: iconHtml }}
        />
      )}

      {/* Text Container */}
      <div className="flex flex-col">
        {title && (
          <span className="text-[11px] font-semibold text-[#57534E] font-mono tracking-wider uppercase">
            {title}
          </span>
        )}
        {subTitle && (
          <h4 className="text-sm sm:text-base font-semibold tracking-tight text-[#111111] mt-0.5 leading-tight">
            {subTitle}
          </h4>
        )}
      </div>
    </div>
  );
}

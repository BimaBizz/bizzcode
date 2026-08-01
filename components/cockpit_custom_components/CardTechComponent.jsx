import { cn } from "@/lib/utils";



export default function CardTechComponent({ data }) {
  if (!data) return null;

  const header = data.header || {};
  const body = data.body || {};
  const rows = data.body.rows;
  const getColsClass = rows === 1 ? "md:grid-cols-1" : rows === 2 ? "md:grid-cols-2" : rows === 3 ? "md:grid-cols-3" : rows === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  const footerHtml = data.footer || "";

  const headerIcon = typeof header.icon === "string" ? header.icon : "";
  const headerTitle = typeof header.title === "string" ? header.title : "";
  const items = Array.isArray(body.items) ? body.items : [];

  // Parse terminal text from HTML footer
  const renderTerminalContent = (html) => {
    if (!html) return null;

    // Remove pre/code tags and trim
    const cleanText = html
      .replace(/<pre><code>/gi, "")
      .replace(/<\/code><\/pre>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    const lines = cleanText.split("\n");

    return (
      <div className="space-y-1 font-mono text-xs md:text-[0.9rem] leading-relaxed tracking-normal">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          // Command line
          if (trimmed.startsWith("$")) {
            const command = trimmed.substring(1).trim();
            return (
              <div key={index} className="text-[#4ade80]">
                <span className="text-[#a3a3a3] select-none mr-2">$</span>
                {command}
              </div>
            );
          }

          // Line containing checkmark (✓ Hydration)
          if (line.includes("✓ Hydration")) {
            const parts = line.split("✓ Hydration");
            return (
              <div key={index} className="flex flex-wrap items-center">
                <span className="text-[#8c8c8c] mr-2">{parts[0]}</span>
                <span className="text-[#4ade80] flex items-center gap-1 font-semibold">
                  ✓ Hydration
                </span>
                {parts[1] && <span className="text-[#4ade80] ml-1">{parts[1]}</span>}
              </div>
            );
          }

          // Complete / render cycle line
          if (line.includes("complete. Render cycle:")) {
            return (
              <div key={index} className="text-[#4ade80]">
                {line}
              </div>
            );
          }

          // Standard output line
          return (
            <div key={index} className="text-[#8c8c8c]">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <article className="w-full h-full bg-[#0F221A] border border-[#1E3A2C] rounded-[28px] p-8 md:p-10 shadow-xl transition-all duration-300 flex flex-col justify-between">
      <style dangerouslySetInnerHTML={{
        __html: `
        .tech-card-icon svg {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      `}} />
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {headerIcon && (
            <div
              className="h-12 w-12 flex items-center justify-center p-2.5 rounded-2xl bg-[#0F3D24] text-[#4ADE80] border border-[#1E3A2C] tech-card-icon"
              dangerouslySetInnerHTML={{ __html: headerIcon }}
            />
          )}
          {headerTitle && (
            <h3 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-[#EAF6EF]">
              {headerTitle}
            </h3>
          )}
        </div>

        {/* Body Items */}
        {items.length > 0 && (
          <div className={`grid grid-cols-1 ${getColsClass} gap-8 md:gap-4 mb-8 flex-1`}>
            {items.map((item, index) => {
              const num = String(index + 1).padStart(2, "0");
              const itemTitle = typeof item.title === "string" ? item.title : "";
              const itemSubTitle = typeof item.subTitle === "string" ? item.subTitle : "";

              return (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-[#4ADE80] tracking-wider">
                    {num}
                  </span>
                  {itemTitle && (
                    <h4 className="text-lg md:text-xl font-bold text-[#EAF6EF] mt-1.5 tracking-tight font-heading">
                      {itemTitle}
                    </h4>
                  )}
                  {itemSubTitle && (
                    <p className="text-[#8FAB9C] text-xs md:text-sm leading-relaxed mt-2 font-normal">
                      {itemSubTitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Terminal */}
      {footerHtml && (
        <div className="bg-[#04100A] border border-[#1E3A2C] rounded-[20px] p-5 md:p-6 shadow-inner select-text">
          {/* Terminal Window Dots */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>

          {/* Terminal Output */}
          {renderTerminalContent(footerHtml)}
        </div>
      )}
    </article>
  );
}

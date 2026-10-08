export default function CardTechComponent({ data }) {
  if (!data) return null;

  const header = data.header || {};
  const body = data.body || {};
  const rows = data.body?.rows;
  const getColsClass = rows === 1 ? "md:grid-cols-1" : rows === 2 ? "md:grid-cols-2" : rows === 3 ? "md:grid-cols-3" : rows === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  const footerHtml = data.footer || "";

  const headerIcon = typeof header.icon === "string" ? header.icon : "";
  const headerTitle = typeof header.title === "string" ? header.title : "";
  const items = Array.isArray(body.items) ? body.items : [];

  const renderTerminalContent = (html) => {
    if (!html) return null;

    const cleanText = html
      .replace(/<pre><code>/gi, "")
      .replace(/<\/code><\/pre>/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    const lines = cleanText.split("\n");

    return (
      <div className="space-y-1 font-mono text-xs leading-relaxed">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("$")) {
            const command = trimmed.substring(1).trim();
            return (
              <div key={index} className="text-[#FAFAFA]">
                <span className="text-[#E8452C] select-none mr-2 font-bold">$</span>
                {command}
              </div>
            );
          }

          if (line.includes("✓ Hydration") || line.includes("complete.")) {
            return (
              <div key={index} className="text-[#22C55E]">
                {line}
              </div>
            );
          }

          return (
            <div key={index} className="text-[#A1A1AA]">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <article className="w-full h-full bg-[#121212] border border-[#27272A] rounded-xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
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
        <div className="flex items-center gap-3.5 mb-6">
          {headerIcon && (
            <div
              className="h-10 w-10 flex items-center justify-center p-2 rounded-lg bg-[#181818] text-[#FAFAFA] border border-[#27272A] tech-card-icon"
              dangerouslySetInnerHTML={{ __html: headerIcon }}
            />
          )}
          {headerTitle && (
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#FAFAFA]">
              {headerTitle}
            </h3>
          )}
        </div>

        {/* Body Items */}
        {items.length > 0 && (
          <div className={`grid grid-cols-1 ${getColsClass} gap-6 md:gap-4 mb-6 flex-1`}>
            {items.map((item, index) => {
              const num = String(index + 1).padStart(2, "0");
              const itemTitle = typeof item.title === "string" ? item.title : "";
              const itemSubTitle = typeof item.subTitle === "string" ? item.subTitle : "";

              return (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-[#E8452C] tracking-wider">
                    {num}
                  </span>
                  {itemTitle && (
                    <h4 className="text-base font-bold text-[#FAFAFA] mt-1 tracking-tight">
                      {itemTitle}
                    </h4>
                  )}
                  {itemSubTitle && (
                    <p className="text-[#A1A1AA] text-xs leading-relaxed mt-1 font-normal">
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
        <div className="bg-[#080808] border border-[#27272A] rounded-lg p-4 shadow-inner select-text">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3F3F46]" />
            <span className="w-2 h-2 rounded-full bg-[#3F3F46]" />
            <span className="w-2 h-2 rounded-full bg-[#3F3F46]" />
          </div>
          {renderTerminalContent(footerHtml)}
        </div>
      )}
    </article>
  );
}

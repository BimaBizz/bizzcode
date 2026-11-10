import CockpitImage from "@/components/cockpit-image";
import { COCKPIT_API_URL } from "@/config/cockpit";

const toOrigin = (apiUrl) => {
  if (!apiUrl) return "";
  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl.replace(/\/api(?:\/.*)?$/, "").replace(/\/$/, "");
  }
};

const COCKPIT_ORIGIN = toOrigin(COCKPIT_API_URL);

const normalizeAssetPath = (value) => {
  if (!value) return "";
  const path = String(value).trim();
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  const cleanPath = path.replace(/^\/+/, "");
  if (cleanPath.startsWith("storage/")) return `/${cleanPath}`;
  if (cleanPath.startsWith("uploads/")) return `/storage/${cleanPath}`;

  return `/storage/uploads/${cleanPath}`;
};

const asAssetUrl = (path) => {
  if (!path) return "";
  const normalizedPath = normalizeAssetPath(path);
  if (/^https?:\/\//.test(normalizedPath)) return normalizedPath;
  if (!COCKPIT_ORIGIN) return normalizedPath;
  return `${COCKPIT_ORIGIN}${normalizedPath}`;
};

export default function CardDevOpsComponent({ data }) {
  if (!data) return null;

  const header = data.header || {};
  const bodyItems = Array.isArray(data.body) ? data.body : [];
  const image = data.image || null;

  const headerIcon = typeof header.icon === "string" ? header.icon : "";
  const headerTitle = typeof header.title === "string" ? header.title : "";
  const imageAlt = image?.title || image?.altText || "DevOps network image";

  return (
    <article className="w-full h-full bg-[#FAF7F0] border border-[#111111]/15 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
      <style dangerouslySetInnerHTML={{
        __html: `
        .devops-card-icon svg {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      `}} />

      <div>
        {/* Header */}
        <div className="flex flex-col items-start gap-3.5 mb-6">
          {headerIcon && (
            <div
              className="h-10 w-10 flex items-center justify-center p-2 rounded-lg bg-[#111111] text-[#F3EEE3] border border-[#111111] devops-card-icon"
              dangerouslySetInnerHTML={{ __html: headerIcon }}
            />
          )}
          {headerTitle && (
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111]">
              {headerTitle}
            </h3>
          )}
        </div>

        {/* Body Items */}
        {bodyItems.length > 0 && (
          <div className="flex flex-col mb-6">
            {bodyItems.map((item, index) => {
              const title = typeof item.title === "string" ? item.title : "";
              const subTitle = typeof item.subTitle === "string" ? item.subTitle : "";
              const percent = item.percent !== undefined ? item.percent : "";

              return (
                <div
                  key={index}
                  className="flex flex-col border-b border-[#111111]/10 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex justify-between items-baseline">
                    {title && (
                      <h4 className="text-sm font-semibold text-[#111111] tracking-tight">
                        {title}
                      </h4>
                    )}
                    {percent !== "" && (
                      <span className="text-sm font-mono font-bold text-[#D9541E]">
                        {percent}%
                      </span>
                    )}
                  </div>
                  {subTitle && (
                    <p className="text-[#57534E] text-xs mt-1 font-normal">
                      {subTitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Image */}
      {image && (
        <div className="w-full overflow-hidden rounded-lg border border-[#111111]/15 mt-4">
          {image.path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asAssetUrl(image.path)}
              alt={imageAlt}
              className="w-full h-auto object-cover opacity-90 transition-transform duration-300 hover:scale-105"
            />
          ) : image._id ? (
            <CockpitImage
              asset={image}
              alt={imageAlt}
              className="w-full h-auto object-cover opacity-90 transition-transform duration-300 hover:scale-105"
            />
          ) : null}
        </div>
      )}
    </article>
  );
}

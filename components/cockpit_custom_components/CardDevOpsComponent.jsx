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
    <article className="w-full h-full bg-[#0F221A] border border-[#1E3A2C] rounded-[28px] p-8 md:p-10 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
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
        <div className="flex flex-col items-start gap-4 mb-6">
          {headerIcon && (
            <div
              className="h-12 w-12 flex items-center justify-center p-2.5 rounded-2xl bg-[#0F3D24] text-[#4ADE80] border border-[#1E3A2C] devops-card-icon"
              dangerouslySetInnerHTML={{ __html: headerIcon }}
            />
          )}
          {headerTitle && (
            <h3 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-[#EAF6EF] mt-2">
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
                  className="flex flex-col border-b border-[#1E3A2C] pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex justify-between items-baseline">
                    {title && (
                      <h4 className="font-heading text-lg font-bold text-[#EAF6EF] tracking-tight">
                        {title}
                      </h4>
                    )}
                    {percent !== "" && (
                      <span className="text-base md:text-lg font-mono font-bold text-[#4ADE80]">
                        {percent}%
                      </span>
                    )}
                  </div>
                  {subTitle && (
                    <p className="text-[#8FAB9C] text-sm md:text-base mt-1 font-normal">
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
        <div className="w-full overflow-hidden rounded-[20px] border border-[#1E3A2C] mt-4">
          {image.path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asAssetUrl(image.path)}
              alt={imageAlt}
              className="w-full h-auto object-cover opacity-90 transition-transform duration-500 hover:scale-105"
            />
          ) : image._id ? (
            <CockpitImage
              asset={image}
              alt={imageAlt}
              className="w-full h-auto object-cover opacity-90 transition-transform duration-500 hover:scale-105"
            />
          ) : null}
        </div>
      )}
    </article>
  );
}

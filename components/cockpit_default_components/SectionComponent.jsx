import { cn } from "@/lib/utils";

const isTrue = (value) => value === true || value === "true" || value === 1 || value === "1";
const pickString = (...values) => {
  const found = values.find((value) => typeof value === "string" && value.trim());
  return found ? found.trim() : undefined;
};

const normalizeColorValue = (value) => {
  if (!value) return undefined;

  const raw = value.trim();
  const isHexWithoutHash = /^[0-9a-fA-F]{3,4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(raw);
  const formatted = isHexWithoutHash ? `#${raw}` : raw;
  const lower = formatted.toLowerCase();

  // Map legacy dark section backgrounds to transparent so the #F3EEE3 canvas shows through cleanly
  if (
    lower === "#0a0a0a" ||
    lower === "#000000" ||
    lower === "#000" ||
    lower === "#121212" ||
    lower === "#181818" ||
    lower === "#0d0d10"
  ) {
    return "transparent";
  }

  return formatted;
};

export default function SectionComponent({ item, data, nestedComponents, locale, LayoutRenderer }) {
  const meta = item?.meta && typeof item.meta === "object" && !Array.isArray(item.meta)
    ? item.meta
    : data?.meta && typeof data.meta === "object" && !Array.isArray(data.meta)
      ? data.meta
      : {};

  const isFullHeight = isTrue(meta.hScreen);
  const isCentered = isTrue(meta.itemCenter);
  const isGridCentered = isTrue(meta.contentCenter);
  const backgroundColor = normalizeColorValue(
    pickString(
      meta.backgroundColor,
      meta.backgroudColor,
      meta.color,
      data?.backgroundColor,
      data?.backgroudColor,
      data?.color,
    ),
  );

  return (
    <section
      className={cn(
        "py-4 md:py-8 relative z-10",
        isFullHeight && "min-h-screen h-full",
        isCentered && "flex flex-col justify-center h-full",
        isGridCentered && "flex items-center h-full",
        data.class,
      )}
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className={`max-w-7xl px-5 ${isGridCentered ? "flex flex-col items-center text-center" : "mx-auto"}`}>
        <LayoutRenderer components={nestedComponents} locale={locale} />
      </div>
    </section>
  );
}

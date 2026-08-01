import { cn } from "@/lib/utils";

const isTrue = (value) => value === true || value === "true" || value === 1 || value === "1";

const readMeta = (value) => {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;

  if (typeof value === "string") {
    const entries = value.split(",").map((s) => s.trim()).filter(Boolean);
    return entries.reduce((acc, entry) => {
      const colonIdx = entry.indexOf(":");
      if (colonIdx !== -1) {
        const k = entry.slice(0, colonIdx).trim();
        const v = entry.slice(colonIdx + 1).trim();
        return { ...acc, [k]: v };
      } else {
        return { ...acc, [entry]: true };
      }
    }, {});
  }

  if (Array.isArray(value)) {
    return value.reduce((acc, entry) => {
      if (typeof entry === "string") {
        const colonIdx = entry.indexOf(":");
        if (colonIdx !== -1) {
          const k = entry.slice(0, colonIdx).trim();
          const v = entry.slice(colonIdx + 1).trim();
          return { ...acc, [k]: v };
        } else {
          return { ...acc, [entry.trim()]: true };
        }
      }
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        return { ...acc, ...entry };
      }
      return acc;
    }, {});
  }
  return {};
};

const getGridClass = (colWidth) => {
  const width = String(colWidth || "auto");
  if (width === "1") return "md:grid-cols-1";
  if (width === "2") return "md:grid-cols-2";
  if (width === "3") return "md:grid-cols-3";
  if (width === "4") return "md:grid-cols-4";
  if (width === "1-2") return "md:grid-cols-2";
  if (width === "1-3") return "md:grid-cols-3";
  if (width === "1-4") return "md:grid-cols-4";
  return "md:grid-cols-2";
};

const getRowSpanClass = (rowspan) => {
  const span = String(rowspan || "");
  if (span === "1") return "md:row-span-1";
  if (span === "2") return "md:row-span-2";
  if (span === "3") return "md:row-span-3";
  if (span === "4") return "md:row-span-4";
  if (span === "5") return "md:row-span-5";
  if (span === "6") return "md:row-span-6";
  if (span === "full") return "md:row-span-full";
  return "";
};

const getColSpanClass = (colspan) => {
  const span = String(colspan || "");
  if (span === "1") return "md:col-span-1";
  if (span === "2") return "md:col-span-2";
  if (span === "3") return "md:col-span-3";
  if (span === "4") return "md:col-span-4";
  if (span === "5") return "md:col-span-5";
  if (span === "6") return "md:col-span-6";
  if (span === "full") return "md:col-span-full";
  return "";
};

export default function GridComponent({ item, data, locale, LayoutRenderer }) {
  const meta = Object.keys(readMeta(item?.meta)).length ? readMeta(item?.meta) : readMeta(data?.meta);

  const columns = Array.isArray(item.columns) ? item.columns : [];
  const isCentered = isTrue(meta.itemCenter);
  const isGridFullHeight = meta.height === "100%";

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 lg:gap-8",
        getGridClass(data.colWidth),
        isCentered && "items-center",
        isGridFullHeight && "h-full",
        data.class
      )}
      style={isGridFullHeight ? { height: "100%" } : undefined}
    >
      {columns.map((column, index) => {
        const columnMeta = {
          ...readMeta(column?.meta),
          ...readMeta(column?.data?.meta),
          ...readMeta(column?.settings?.meta)
        };
        const columnCentered = isTrue(columnMeta.itemCenter);
        const rowspan = columnMeta.rowspan || columnMeta.rowSpan || columnMeta.row_span;
        const colspan = columnMeta.colspan || columnMeta.colSpan || columnMeta.col_span;
        const isColumnFullHeight = columnMeta.height === "100%" || Boolean(rowspan);
        return (
          <div
            key={`${item.id || "grid"}-${index}`}
            className={cn(
              "space-y-5 flex flex-col h-full",
              columnCentered && "justify-center",
              getRowSpanClass(rowspan),
              getColSpanClass(colspan)
            )}
          >
            <LayoutRenderer
              components={column?.components || []}
              locale={locale}
              className={cn(
                `flex ${columnCentered ? "items-center flex-col" : "flex-col flex-1"} h-full w-full`
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

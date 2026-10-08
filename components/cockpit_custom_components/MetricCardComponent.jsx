import { cn } from "@/lib/utils";

export default function MetricCardComponent({ data, className }) {
  const number = data?.avg?.number !== undefined ? data.avg.number : "";
  const unit = typeof data?.avg?.selections === "string" ? data.avg.selections.trim() : "";
  const subTitle = typeof data?.subTitle === "string" ? data.subTitle.trim() : "";

  if (number === "" && !subTitle) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] p-6 flex flex-col justify-center shadow-lg transition-colors",
        className
      )}
    >
      <div className="flex flex-col justify-center">
        {number !== "" && (
          <div className="flex items-baseline font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
            <span>{number}</span>
            {unit && <span className="ml-1 text-xl sm:text-2xl font-semibold text-[#E8452C]">{unit}</span>}
          </div>
        )}

        {subTitle && (
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mt-1.5 font-medium">
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
}

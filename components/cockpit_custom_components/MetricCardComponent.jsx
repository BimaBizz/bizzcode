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
        "relative overflow-hidden rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] p-6.5 flex flex-col justify-center transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tr-[8px] hover:rounded-bl-[8px] hover:rounded-tl-[28px] hover:rounded-br-[28px]",
        "bg-[#0F3D24] text-[#B9F5D0]",
        className
      )}
    >
      <div className="flex flex-col justify-center">
        {number !== "" && (
          <div className="flex items-baseline font-heading text-4xl font-semibold tracking-tight">
            <span>{number}</span>
            {unit && <span className="ml-1 text-2xl font-bold">{unit}</span>}
          </div>
        )}

        {subTitle && (
          <p className="text-[12px] font-bold uppercase tracking-wider opacity-85 mt-1">
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
}

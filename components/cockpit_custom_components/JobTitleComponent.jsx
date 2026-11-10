/**
 * JobTitleComponent
 * 
 * Renders a technical/editorial job title badge with live status indicator
 * styled for the Cream (#F3EEE3), Charcoal (#111111), and Terracotta (#D9541E) palette.
 */

export default function JobTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title.trim() : "";

  if (!title) return null;

  return (
    <div className="inline-flex items-center gap-3 p-1 pr-4 rounded-full bg-[#FAF7F0] border border-[#111111]/20 shadow-[2px_2px_0px_#111111] hover:border-[#D9541E]/50 hover:shadow-[2px_2px_0px_#D9541E] transition-all duration-200 my-5 group">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] text-[#F3EEE3]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9541E] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9541E]" />
        </span>
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#D9541E]">
          //
        </span>
      </span>

      <h3 className="text-xs font-mono font-bold tracking-[0.1em] uppercase text-[#111111]">
        {title}
      </h3>

      <span
        className="w-1.5 h-3.5 bg-[#D9541E] rounded-[1px] animate-pulse"
        aria-hidden="true"
      />
    </div>
  );
}

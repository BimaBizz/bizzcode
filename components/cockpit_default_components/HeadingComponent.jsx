export default function HeadingComponent({ data }) {
  const level = Math.min(Math.max(Number(data.level || 2), 1), 6);
  const Tag = `h${level}`;
  const sizeByLevel = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  };

  return (
    <Tag className={`${sizeByLevel[level]} font-heading tracking-tight font-semibold text-[#EAF6EF] space-y-5`}>
      {data.text}
    </Tag>
  );
}

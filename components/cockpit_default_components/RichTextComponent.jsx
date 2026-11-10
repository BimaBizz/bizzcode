export default function RichTextComponent({ data }) {
  return <div className="prose prose-neutral max-w-none text-[#111111] prose-headings:font-sans prose-headings:text-[#111111] prose-p:text-[#57534E] prose-li:text-[#57534E] prose-strong:text-[#111111] prose-a:text-[#D9541E]" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
}

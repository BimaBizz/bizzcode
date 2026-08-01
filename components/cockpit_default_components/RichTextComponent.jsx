export default function RichTextComponent({ data }) {
  return <div className="prose prose-invert max-w-none text-[#EAF6EF] prose-headings:font-heading prose-headings:text-[#EAF6EF] prose-p:text-[#8FAB9C] prose-a:text-[#4ADE80]" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
}

export default function RichTextComponent({ data }) {
  return <div className="prose prose-invert max-w-none text-[#FAFAFA] prose-headings:font-sans prose-headings:text-[#FAFAFA] prose-p:text-[#A1A1AA] prose-a:text-[#E8452C]" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
}

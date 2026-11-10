const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInlineMarkdown = (value = "") => {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};

const markdownToHtml = (markdown = "") => {
  const blocks = escapeHtml(markdown)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const headingMatch = block.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const content = renderInlineMarkdown(headingMatch[2]);
        return `<h${level}>${content}</h${level}>`;
      }

      const inline = renderInlineMarkdown(block).replace(/\n/g, "<br />");
      return `<p>${inline}</p>`;
    })
    .join("");
};

export default function MarkdownComponent({ data }) {
  return (
    <div className="prose prose-neutral max-w-none text-[#111111] prose-headings:font-sans prose-headings:text-[#111111] prose-p:text-[#57534E] prose-li:text-[#57534E] prose-strong:text-[#111111] prose-a:text-[#D9541E]" dangerouslySetInnerHTML={{ __html: markdownToHtml(data.markdown || "") }} />
  );
}

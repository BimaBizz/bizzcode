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
    <div className="prose prose-invert max-w-none text-[#EAF6EF] prose-headings:font-heading prose-headings:text-[#EAF6EF] prose-p:text-[#8FAB9C] prose-a:text-[#4ADE80]" dangerouslySetInnerHTML={{ __html: markdownToHtml(data.markdown || "") }} />
  );
}

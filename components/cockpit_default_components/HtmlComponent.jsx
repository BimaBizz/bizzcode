export default function HtmlComponent({ data }) {
  return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
}

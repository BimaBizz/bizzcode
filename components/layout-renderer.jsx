import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  HeadingComponent,
  RichTextComponent,
  HtmlComponent,
  MarkdownComponent,
  ImageComponent,
  LinkComponent,
  ButtonComponent,
  SpacerComponent,
  SectionComponent,
  GridComponent,
  HeroComponent,
} from "@/components/cockpit_default_components";
import CustomComponentRenderer from "@/components/cockpit_custom_components/CustomComponentRenderer";

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

function RenderComponent({ item, locale }) {
  if (!item || !isObject(item)) {
    return null;
  }

  const data = isObject(item.data) ? item.data : {};
  const rawComponent = String(item.component || item.name || item.type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  const nestedComponents = Array.isArray(item.children)
    ? item.children
    : Array.isArray(item.components)
      ? item.components
      : Array.isArray(data.components)
        ? data.components
        : Array.isArray(data.children)
          ? data.children
          : Array.isArray(data.layout)
            ? data.layout
            : [];

  // LayoutComponent: wrapper for nested components
  if (rawComponent === "layoutcomponent" || rawComponent === "layout-component" || rawComponent === "layout-components") {
    return <LayoutRenderer components={nestedComponents} locale={locale} />;
  }

  // Default components
  if (rawComponent === "heading") {
    return <HeadingComponent data={data} />;
  }

  if (rawComponent === "richtext" || rawComponent === "rich-text") {
    return <RichTextComponent data={data} />;
  }

  if (rawComponent === "html") {
    return <HtmlComponent data={data} />;
  }

  if (rawComponent === "markdown") {
    return <MarkdownComponent data={data} />;
  }

  if (rawComponent === "image") {
    return <ImageComponent item={item} data={data} />;
  }

  if (rawComponent === "link") {
    return <LinkComponent data={data} locale={locale} />;
  }

  if (rawComponent === "button") {
    return <ButtonComponent data={data} locale={locale} />;
  }

  if (rawComponent === "spacer") {
    return <SpacerComponent data={data} />;
  }

  if (rawComponent === "section") {
    return <SectionComponent item={item} data={data} nestedComponents={nestedComponents} locale={locale} LayoutRenderer={LayoutRenderer} />;
  }

  if (rawComponent === "grid") {
    return <GridComponent item={item} data={data} locale={locale} LayoutRenderer={LayoutRenderer} />;
  }

  if (rawComponent === "hero") {
    return <HeroComponent data={data} locale={locale} />;
  }

  // Custom components (fallback)
  return <CustomComponentRenderer rawComponent={rawComponent} item={item} data={data} nestedComponents={nestedComponents} locale={locale} LayoutRenderer={LayoutRenderer} />;
}

export default function LayoutRenderer({ components = [], locale, className }) {
  if (!Array.isArray(components) || !components.length) {
    return null;
  }

  return (
    <>
      {components.map((item, index) => (
        <RenderComponent key={item?.id || `${item?.component || "component"}-${index}`} item={item} locale={locale} />
      ))}
    </>
  );
}

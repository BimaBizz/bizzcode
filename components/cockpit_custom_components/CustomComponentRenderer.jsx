/**
 * CustomComponentRenderer
 * 
 * Dispatcher for custom/third-party Cockpit components.
 * Routes to specific component implementations based on rawComponent type.
 * 
 * Add new components:
 * 1. Create component file (e.g., MyCustomComponent.jsx)
 * 2. Import at top of this file
 * 3. Add mapping condition: if (rawComponent === "my-custom") { return <MyCustomComponent data={data} />; }
 */

import SectionTitleComponent from "./SectionTitleComponent";
import TagsComponent from "./TagsComponent";
import JobTitleComponent from "./JobTitleComponent";
import HeroImage from "./HeroImageComponent";
import CardComponent from "./CardComponent";
import TerminalComponent from "./TerminalComponent";
import ProjectsItemsComponent from "./ProjectsItemsComponent";
import MetricCardComponent from "./MetricCardComponent";
import FormComponent from "./FormComponent";
import CustomButtonComponent from "./CustomButtonComponent";
import CardTechComponent from "./CardTechComponent";
import CardDevOpsComponent from "./CardDevOpsComponent";
import CardTagsComponent from "./CardTagsComponent";
import CardImageComponent from "./CardImageComponent";
import DetailContactComponent from "./DetailContactComponent";


export default function CustomComponentRenderer({ rawComponent, item, data, nestedComponents, locale, LayoutRenderer }) {
  const isCollectionPageItems = Array.isArray(data?.items) && data.items.some((entry) => entry && typeof entry === "object" && (entry.item || entry.route));

  if (rawComponent === "sectiontitle") {
    return <SectionTitleComponent data={data} />;
  }

  if (rawComponent === "tags") {
    return <TagsComponent data={data} />;
  }

  if (rawComponent === "jobtitle") {
    return <JobTitleComponent data={data} />;
  }

  if (rawComponent === "heroimage") {
    return <HeroImage data={data} />;
  }

  if (rawComponent === "card" || rawComponent === "cards") {
    return <CardComponent data={data} />;
  }

  if (rawComponent === "terminal") {
    return <TerminalComponent data={data} />;
  }

  if (
    rawComponent === "projects-items" ||
    rawComponent === "projects_items" ||
    rawComponent === "projectsitems" ||
    rawComponent === "portofolioitems" ||
    rawComponent === "portfolioitems" ||
    rawComponent === "portofolio-items" ||
    rawComponent === "portfolio-items" ||
    rawComponent === "collectionpageitems" ||
    rawComponent === "collection-page-items" ||
    rawComponent === "collectionpageitem" ||
    rawComponent === "collection-page-item" ||
    isCollectionPageItems
  ) {
    return <ProjectsItemsComponent data={data} locale={locale} />;
  }

  if (rawComponent === "metric-card" || rawComponent === "metric_card" || rawComponent === "metriccard") {
    return <MetricCardComponent data={data} />;
  }

  if (rawComponent === "form") {
    return <FormComponent data={data} />;
  }

  if (rawComponent === "custombutton" || rawComponent === "custom-button" || rawComponent === "custom_button") {
    return <CustomButtonComponent data={data} locale={locale} />;
  }

  if (rawComponent === "cardtech" || rawComponent === "card-tech" || rawComponent === "card_tech") {
    return <CardTechComponent data={data} />;
  }

  if (rawComponent === "carddevops" || rawComponent === "card-dev-ops" || rawComponent === "card_dev_ops") {
    return <CardDevOpsComponent data={data} />;
  }

  if (rawComponent === "cardtags" || rawComponent === "card-tags" || rawComponent === "card_tags") {
    return <CardTagsComponent data={data} />;
  }

  if (rawComponent === "cardimage" || rawComponent === "card-image" || rawComponent === "card_image") {
    return <CardImageComponent data={data} />;
  }

  if (rawComponent === "detailcontact" || rawComponent === "detail-contact" || rawComponent === "detail_contact") {
    return <DetailContactComponent data={data} />;
  }

  // If component has nested content or HTML, render it as fallback
  if (nestedComponents.length) {
    return <LayoutRenderer components={nestedComponents} locale={locale} />;
  }

  if (typeof data?.html === "string" && data.html.trim()) {
    return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: data.html }} />;
  }

  if (typeof data?.content === "string" && data.content.trim()) {
    return <div className="prose prose-invert max-w-none text-[#EAF6EF] prose-headings:font-heading prose-headings:text-[#EAF6EF] prose-p:text-[#8FAB9C] prose-a:text-[#4ADE80]" dangerouslySetInnerHTML={{ __html: data.content }} />;
  }

  return null;
}

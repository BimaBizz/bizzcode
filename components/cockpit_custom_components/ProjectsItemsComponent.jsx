import Link from "next/link";
import { getItem } from "@/lib/cockpit";
import CockpitImage from "@/components/cockpit-image";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const shortText = (value = "", maxLength = 140) => {
  const text = stripHtml(value);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const getSingleImageAsset = (imageField) => {
  if (!imageField) return null;
  if (Array.isArray(imageField)) {
    return imageField.length > 0 ? imageField[0] : null;
  }
  return imageField;
};

export default async function ProjectsItemsComponent({ data, locale }) {
  const items = Array.isArray(data?.items) ? data.items : [];

  if (!items.length) {
    return null;
  }

  // Fetch all items from Cockpit in parallel using getItem helper
  const fetchedItems = await Promise.all(
    items.map(async (itemRef) => {
      if (!itemRef || !itemRef._id || !itemRef._model) return null;
      try {
        const project = await getItem(itemRef._model, itemRef._id, {
          locale,
          populate: 1, // Resolve linked content items (like projects_type)
        });
        return project;
      } catch (err) {
        console.error(`Failed to fetch Cockpit item ${itemRef._model}/${itemRef._id}:`, err);
        return null;
      }
    })
  );

  const projects = fetchedItems.filter(Boolean);

  if (!projects.length) {
    return null;
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const typeName = project.projects_type?.type_name || project.projects_type?.title || "";
          const excerpt = shortText(project.contents || "");
          const route = project.slug ? localePath(locale, `projects/${project.slug}`) : "";
          const techs = Array.isArray(project.tech) ? project.tech : [];

          const cardContent = (
            <article className="group h-full flex flex-col overflow-hidden rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[10px] rounded-br-[10px] border border-[#1E3A2C] bg-[#0F221A] shadow-lg transition-all duration-450 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tl-[30px] hover:rounded-br-[30px] hover:rounded-tr-[10px] hover:rounded-bl-[10px] hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#081410]">
                {getSingleImageAsset(project.image) ? (
                  <CockpitImage
                    asset={getSingleImageAsset(project.image)}
                    alt={project.title || "Project image"}
                    width={640}
                    height={400}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#081410] text-xs font-semibold text-[#8FAB9C]">
                    No preview image
                  </div>
                )}

                {typeName ? (
                  <div className="absolute right-3 top-3 rounded-[16px] bg-[#0B3B36] text-[#B0F5EC] px-3.5 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md">
                    {typeName}
                  </div>
                ) : null}
              </div>

              {/* Text Container */}
              <div className="flex-1 flex flex-col justify-between p-6 space-y-4">
                <div className="space-y-2.5">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-[#EAF6EF] transition-colors duration-300 group-hover:text-[#4ADE80]">
                    {project.title || "Untitled Project"}
                  </h3>

                  {excerpt ? (
                    <p className="text-xs leading-relaxed text-[#8FAB9C] line-clamp-3 mt-4">
                      {excerpt}
                    </p>
                  ) : null}
                </div>

                {/* Tech Badges */}
                {techs.length ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {techs.map((tech, techIdx) => (
                      <span
                        key={`${tech}-${techIdx}`}
                        className="font-mono text-[10.5px] bg-[#0B3B36] text-[#B0F5EC] px-2.5 py-1 rounded-[6px] uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );

          return route ? (
            <Link
              key={project._id || `project-${index}`}
              href={route}
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {cardContent}
            </Link>
          ) : (
            <div key={project._id || `project-${index}`} className="h-full">
              {cardContent}
            </div>
          );
        })}
      </div>
    </>
  );
}

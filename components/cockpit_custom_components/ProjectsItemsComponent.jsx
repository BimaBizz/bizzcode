import Link from "next/link";
import { getItem } from "@/lib/cockpit";
import CockpitImage from "@/components/cockpit-image";
import { localePath } from "@/lib/i18n";

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

  const fetchedItems = await Promise.all(
    items.map(async (itemRef) => {
      if (!itemRef || !itemRef._id || !itemRef._model) return null;
      try {
        const project = await getItem(itemRef._model, itemRef._id, {
          locale,
          populate: 1,
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const typeName = project.projects_type?.type_name || project.projects_type?.title || "";
        const excerpt = shortText(project.contents || "");
        const route = project.slug ? localePath(locale, `projects/${project.slug}`) : "";
        const techs = Array.isArray(project.tech) ? project.tech : [];

        const cardContent = (
          <article className="group h-full flex flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] shadow-lg transition-colors">
            {/* Image Container */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#0A0A0A]">
              {getSingleImageAsset(project.image) ? (
                <CockpitImage
                  asset={getSingleImageAsset(project.image)}
                  alt={project.title || "Project image"}
                  width={640}
                  height={400}
                  priority={index < 2}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
                  No preview image
                </div>
              )}

              {typeName ? (
                <div className="absolute right-3 top-3 rounded-md bg-[#121212]/90 border border-[#27272A] text-[#FAFAFA] px-2.5 py-1 text-[11px] font-mono backdrop-blur-md">
                  {typeName}
                </div>
              ) : null}
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-between p-5 space-y-3">
              <div className="space-y-2">
                <h3 className="text-lg font-bold tracking-tight text-[#FAFAFA] transition-colors group-hover:text-[#E8452C]">
                  {project.title || "Untitled Project"}
                </h3>

                {excerpt ? (
                  <p className="text-xs leading-relaxed text-[#A1A1AA] line-clamp-3">
                    {excerpt}
                  </p>
                ) : null}
              </div>

              {/* Tech Badges */}
              {techs.length ? (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {techs.map((tech, techIdx) => (
                    <span
                      key={`${tech}-${techIdx}`}
                      className="font-mono text-[10px] bg-[#181818] text-[#FAFAFA] border border-[#27272A] px-2 py-0.5 rounded"
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
            className="group block h-full focus:outline-none"
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
  );
}

import Link from "next/link";
import CockpitImage from "@/components/cockpit-image";
import LayoutRenderer from "@/components/layout-renderer";
import HighlightedHtml from "@/components/highlighted-html";
import { localePath } from "@/lib/i18n";
import { getAssetImageUrl } from "@/lib/cockpit";
import ImageSlider from "@/components/image-slider";

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

export default function CockpitCollectionPage({ page, locale, latestProjects = [] }) {
  if (!page || !page.data) {
    return null;
  }

  const { items, item, layoutList, layoutDetail } = page.data;

  // 1. Render Listing View
  if (items && Array.isArray(items)) {
    const listBefore = layoutList?.before || [];
    const listAfter = layoutList?.after || [];

    return (
      <>
        {/* Layout before listing */}
        {listBefore.length > 0 && (
          <LayoutRenderer components={listBefore} locale={locale} />
        )}

        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
          <div className="w-full">
            {items.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {items.map((entry, index) => {
                  const project = entry.item || {};
                  const route = entry.route
                    ? localePath(locale, entry.route)
                    : project.slug
                      ? localePath(locale, `projects/${project.slug}`)
                      : "#";

                  const typeName =
                    project.projects_type?.type_name ||
                    project.projects_type?.title ||
                    "";
                  const excerpt = shortText(project.contents || "");
                  const techs = Array.isArray(project.tech) ? project.tech : [];

                  const modIndex = index % 4;

                  // CARD 0: Large Featured Card
                  if (modIndex === 0) {
                    const hasLive = !!project.liveUrl;
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");
                    const hasSource = !!sourceUrl;

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 md:col-span-2 rounded-xl overflow-hidden border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] shadow-xl transition-colors flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          {/* Image Container */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0A]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={1200}
                                height={750}
                                priority={index < 2}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-3.5 top-3.5 rounded-md bg-[#121212]/90 border border-[#27272A] px-2.5 py-1 text-[11px] font-mono text-[#FAFAFA] backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="p-6 sm:p-8 pb-3 space-y-4 flex-1 flex flex-col justify-between text-[#FAFAFA]">
                            <div className="space-y-3">
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {techs.map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] px-2.5 py-0.5 text-[10.5px] font-mono rounded"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA] group-hover:text-[#E8452C] transition-colors leading-tight">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Actions */}
                        <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-1 flex flex-wrap gap-2.5">
                          {hasLive ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#E8452C] hover:bg-[#d43c24] text-white font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>View Live</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </a>
                          ) : (
                            <span className="bg-[#181818] text-[#71717A] border border-[#27272A] font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>View Live</span>
                            </span>
                          )}

                          {isSourceLocked ? (
                            <span className="text-[#71717A] border border-[#27272A] bg-[#181818] font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Private Repo</span>
                            </span>
                          ) : hasSource ? (
                            <a
                              href={sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FAFAFA] hover:text-white bg-[#181818] hover:bg-[#202020] border border-[#27272A] font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m8 0h-4" />
                              </svg>
                              <span>Source</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  }

                  // CARD 1: Standard Card
                  if (modIndex === 1) {
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");
                    const linkUrl = sourceUrl || project.liveUrl || "#";

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 rounded-xl overflow-hidden border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] shadow-lg transition-colors flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={600}
                                height={450}
                                priority={index < 2}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-3 top-3 rounded-md bg-[#121212]/90 border border-[#27272A] px-2.5 py-1 text-[11px] font-mono text-[#FAFAFA] backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          <div className="p-5 pb-2 space-y-3 flex-1 flex flex-col justify-between text-[#FAFAFA]">
                            <div className="space-y-2">
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {techs.slice(0, 2).map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] px-2 py-0.5 text-[10.5px] font-mono rounded"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="text-base font-bold tracking-tight text-[#FAFAFA] group-hover:text-[#E8452C] transition-colors">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-xs leading-relaxed text-[#A1A1AA] line-clamp-3">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        <div className="p-5 pt-2">
                          {isSourceLocked ? (
                            <span className="text-[#71717A] font-mono text-xs inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>Private Repo</span>
                            </span>
                          ) : (
                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E8452C] hover:text-[#d43c24] font-medium text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Repository</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // CARD 2: Alternative Card
                  if (modIndex === 2) {
                    const hasLive = !!project.liveUrl;
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 rounded-xl overflow-hidden border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] shadow-lg transition-colors flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={600}
                                height={450}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-3 top-3 rounded-md bg-[#121212]/90 border border-[#27272A] px-2.5 py-1 text-[11px] font-mono text-[#FAFAFA] backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          <div className="p-5 pb-2 space-y-3 flex-1 flex flex-col justify-between text-[#FAFAFA]">
                            <div className="space-y-2">
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {techs.slice(0, 2).map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] px-2 py-0.5 text-[10.5px] font-mono rounded"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="text-base font-bold tracking-tight text-[#FAFAFA] group-hover:text-[#E8452C] transition-colors">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-xs leading-relaxed text-[#A1A1AA] line-clamp-3">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        <div className="p-5 pt-2">
                          {hasLive ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E8452C] hover:text-[#d43c24] font-medium text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Explore</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </a>
                          ) : isSourceLocked ? (
                            <span className="text-[#71717A] font-mono text-xs inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>Private Repo</span>
                            </span>
                          ) : sourceUrl ? (
                            <a
                              href={sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E8452C] hover:text-[#d43c24] font-medium text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Explore</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  }

                  // CARD 3: Wide Split Card
                  return (
                    <Link
                      key={project._id || `project-${index}`}
                      href={route}
                      className="group block col-span-1 md:col-span-2 focus:outline-none"
                    >
                      <article className="w-full h-full flex flex-col-reverse md:flex-row overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] hover:border-[#3F3F46] shadow-lg transition-colors">
                        <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between text-[#FAFAFA] w-full md:w-1/2">
                          <div className="space-y-3">
                            {techs.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {techs.slice(0, 3).map((tech, techIdx) => (
                                  <span
                                    key={`${tech}-${techIdx}`}
                                    className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] px-2.5 py-0.5 text-[10.5px] font-mono rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA] group-hover:text-[#E8452C] transition-colors leading-tight">
                              {project.title || "Untitled Project"}
                            </h3>
                            {excerpt && (
                              <p className="text-xs leading-relaxed text-[#A1A1AA]">
                                {excerpt}
                              </p>
                            )}
                          </div>

                          <div className="pt-2">
                            <span className="bg-[#E8452C] hover:bg-[#d43c24] text-white font-medium text-xs py-2 px-4 rounded-lg inline-block transition-colors">
                              View Case Study
                            </span>
                          </div>
                        </div>

                        <div className="relative w-full md:w-1/2 bg-[#0A0A0A] aspect-[4/3] md:aspect-auto overflow-hidden">
                          {getSingleImageAsset(project.image) ? (
                            <CockpitImage
                              asset={getSingleImageAsset(project.image)}
                              alt={project.title || "Project image"}
                              width={600}
                              height={600}
                              className="h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
                              No preview image
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center rounded-xl border border-[#27272A] bg-[#121212] p-12">
                <p className="text-[#A1A1AA] text-sm font-medium">No projects found.</p>
              </div>
            )}

            {/* Pagination */}
            {page._pagination && page._pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#27272A] pt-6 mt-10 gap-4">
                <div className="text-xs text-[#A1A1AA] font-mono">
                  Showing{" "}
                  <span className="font-bold text-[#FAFAFA]">
                    {Math.min(page._pagination.page * page._pagination.limit, page._pagination.total)}
                  </span>{" "}
                  of <span className="font-bold text-[#FAFAFA]">{page._pagination.total}</span> projects
                </div>

                <div className="flex items-center gap-2">
                  {page._pagination.page > 1 ? (
                    <Link
                      href={`?page=${page._pagination.page - 1}`}
                      className="border border-[#27272A] bg-[#181818] hover:bg-[#202020] text-[#FAFAFA] font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Previous
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="border border-[#27272A]/40 bg-[#121212] text-[#71717A] font-medium text-xs py-2 px-4 rounded-lg cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Previous
                    </button>
                  )}

                  <span className="text-xs font-mono text-[#A1A1AA] px-3 py-1.5 rounded-lg bg-[#121212] border border-[#27272A]">
                    Page {page._pagination.page} of {page._pagination.pages}
                  </span>

                  {page._pagination.page < page._pagination.pages ? (
                    <Link
                      href={`?page=${page._pagination.page + 1}`}
                      className="border border-[#27272A] bg-[#181818] hover:bg-[#202020] text-[#FAFAFA] font-medium text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      Next
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="border border-[#27272A]/40 bg-[#121212] text-[#71717A] font-medium text-xs py-2 px-4 rounded-lg cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                      Next
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {listAfter.length > 0 && (
          <LayoutRenderer components={listAfter} locale={locale} />
        )}
      </>
    );
  }

  // 2. Render Detail View
  if (item) {
    const detailBefore = layoutDetail?.before || [];
    const detailAfter = layoutDetail?.after || [];
    const typeName =
      item.projects_type?.type_name || item.projects_type?.title || "";
    const techs = Array.isArray(item.tech) ? item.tech : [];

    const sourceObj = item.source;
    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");

    const rawImages = Array.isArray(item.image)
      ? item.image
      : item.image
        ? [item.image]
        : [];

    const resolvedImages = rawImages
      .map((img) => {
        if (!img || !img._id) return null;
        const src = getAssetImageUrl(img, {
          width: 1400,
          height: 600,
          quality: 82,
          mode: "bestFit",
          mime: "webp",
        });
        return {
          src,
          alt: img.title || item.title || "Project Image",
        };
      })
      .filter(Boolean);

    return (
      <div className="w-full">
        {detailBefore.length > 0 && (
          <LayoutRenderer components={detailBefore} locale={locale} />
        )}

        <article className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8 min-w-0">
          {/* Back button */}
          <div>
            <Link
              href={localePath(locale, "projects")}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors bg-[#181818] border border-[#27272A] px-3.5 py-1.5 rounded-lg hover:border-[#3F3F46]"
            >
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Hero Header */}
          <div className="space-y-3 min-w-0">
            {typeName && (
              <span className="inline-block rounded border border-[#27272A] bg-[#181818] px-3 py-1 text-xs font-mono uppercase tracking-wider text-[#FAFAFA]">
                {typeName}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FAFAFA] leading-tight break-words">
              {item.title || page.title || "Untitled Project"}
            </h1>
          </div>

          {/* Image Slider */}
          {resolvedImages.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-[#27272A]">
              <ImageSlider images={resolvedImages} />
            </div>
          )}

          {/* Content & Sidebar Breakdown */}
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-3 pt-4 min-w-0">
            {/* Description */}
            <div className="lg:col-span-2 space-y-6 min-w-0 w-full">
              <HighlightedHtml
                className="prose prose-invert max-w-none w-full min-w-0 break-words [overflow-wrap:anywhere] prose-headings:font-bold prose-headings:text-[#FAFAFA] prose-p:leading-relaxed prose-p:text-[#A1A1AA] prose-a:text-[#E8452C] hover:prose-a:text-[#d43c24] prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-[#27272A] prose-img:rounded-xl"
                html={item.contents || ""}
              />
            </div>

            {/* Metadata Sidebar */}
            <div className="space-y-6 min-w-0 w-full">
              <div className="rounded-xl border border-[#27272A] bg-[#121212] p-6 space-y-5 shadow-lg min-w-0">
                <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">
                  Project Information
                </h3>

                <div className="space-y-3.5 text-xs divide-y divide-[#27272A]">
                  {typeName && (
                    <div className="flex flex-col gap-1 pt-3 first:pt-0">
                      <span className="font-mono uppercase tracking-wider text-[#71717A] text-[11px]">
                        Category
                      </span>
                      <span className="font-medium text-[#FAFAFA]">
                        {typeName}
                      </span>
                    </div>
                  )}

                  {item.liveUrl && (
                    <div className="flex flex-col gap-1 pt-3">
                      <span className="font-mono uppercase tracking-wider text-[#71717A] text-[11px]">
                        Live Link
                      </span>
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#E8452C] hover:underline inline-flex items-center gap-1.5"
                      >
                        View Live Site
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  {sourceObj && (
                    <div className="flex flex-col gap-1 pt-3">
                      <span className="font-mono uppercase tracking-wider text-[#71717A] text-[11px]">
                        Source Code
                      </span>
                      {isSourceLocked ? (
                        <span className="font-medium text-[#71717A] inline-flex items-center gap-1.5 cursor-not-allowed">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Private Repository
                        </span>
                      ) : (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#FAFAFA] hover:text-[#E8452C] transition-colors inline-flex items-center gap-1.5 hover:underline"
                        >
                          GitHub Repository
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {techs.length > 0 && (
                    <div className="flex flex-col gap-2 pt-3">
                      <span className="font-mono uppercase tracking-wider text-[#71717A] text-[11px]">
                        Technologies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {techs.map((tech, techIdx) => (
                          <span
                            key={`${tech}-${techIdx}`}
                            className="rounded border border-[#27272A] bg-[#181818] text-[#FAFAFA] px-2.5 py-0.5 text-xs font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Projects Sidebar Widget */}
              {Array.isArray(latestProjects) && latestProjects.length > 0 && (
                <div className="rounded-xl border border-[#27272A] bg-[#121212] p-6 space-y-4 shadow-lg">
                  <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">
                    Latest Projects
                  </h3>

                  <div className="space-y-2">
                    {latestProjects.map((proj, idx) => {
                      const route = proj.slug ? localePath(locale, `projects/${proj.slug}`) : "#";
                      const typeName = proj.projects_type?.type_name || proj.projects_type?.title || "";

                      return (
                        <Link
                          key={proj._id || `latest-${idx}`}
                          href={route}
                          className="group flex gap-3.5 items-center p-2 -mx-2 rounded-lg hover:bg-[#181818] transition-colors"
                        >
                          <div className="relative w-20 h-14 rounded-md overflow-hidden bg-[#0A0A0A] flex-shrink-0 border border-[#27272A]">
                            {getSingleImageAsset(proj.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(proj.image)}
                                alt={proj.title}
                                width={300}
                                height={150}
                                className="w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#0A0A0A]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            {typeName && (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#E8452C]">
                                {typeName}
                              </span>
                            )}
                            <h4 className="text-xs font-semibold text-[#FAFAFA] group-hover:text-[#E8452C] transition-colors truncate">
                              {proj.title}
                            </h4>
                          </div>

                          <div className="text-[#71717A] group-hover:text-[#FAFAFA] transition-colors pr-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {detailAfter.length > 0 && (
          <LayoutRenderer components={detailAfter} locale={locale} />
        )}
      </div>
    );
  }

  return null;
}

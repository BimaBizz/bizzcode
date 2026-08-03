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

        <section className="max-w-7xl mx-auto w-full px-5 py-12">
          {/* Showcase Card Grid wrapper */}
          <div className="w-full">
            {items.length > 0 ? (
              <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
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

                  // CARD 0: Large Featured Card (Material 3 Expressive)
                  if (modIndex === 0) {
                    const hasLive = !!project.liveUrl;
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");
                    const hasSource = !!sourceUrl;

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 md:col-span-2 rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[10px] rounded-br-[10px] overflow-hidden border border-[#1E3A2C] bg-[#0F221A] shadow-xl transition-all duration-450 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tl-[30px] hover:rounded-br-[30px] hover:rounded-tr-[10px] hover:rounded-bl-[10px] hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          {/* Image Container */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#081410]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={1200}
                                height={750}
                                priority={index < 2}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#081410] text-xs font-semibold text-[#8FAB9C]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-4 top-4 rounded-[16px] bg-[#0F3D24] text-[#B9F5D0] border border-[#1E3A2C] px-3.5 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="p-8 sm:p-10 pb-4 space-y-5 flex-1 flex flex-col justify-between text-[#EAF6EF]">
                            <div className="space-y-4">
                              {/* Badges */}
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {techs.map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#0B3B36] text-[#B0F5EC] border border-[#1E3A2C]/60 px-3.5 py-1 text-[10.5px] font-mono rounded-[16px] uppercase font-medium"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#EAF6EF] group-hover:text-[#4ADE80] transition-colors leading-tight">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-sm leading-relaxed text-[#8FAB9C]">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Side-by-side pill buttons */}
                        <div className="px-8 pb-8 sm:px-10 sm:pb-10 pt-2 flex flex-wrap gap-3">
                          {hasLive ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#4ADE80] hover:bg-[#3bc770] !text-[#062011] font-bold text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 transition-all duration-300 shadow-md cursor-pointer"
                            >
                              <span className="!text-[#062011]">View Live</span>
                              <svg
                                className="w-3.5 h-3.5 stroke-[#062011]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </a>
                          ) : (
                            <span className="bg-[#0F3D24]/50 text-[#8FAB9C]/60 font-semibold text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>View Live</span>
                            </span>
                          )}

                          {isSourceLocked ? (
                            <span className="text-[#8FAB9C]/60 border border-[#1E3A2C]/50 bg-[#0F3D24]/30 font-semibold text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 cursor-not-allowed">
                              <svg className="w-3.5 h-3.5 text-[#8FAB9C]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Source is not public</span>
                            </span>
                          ) : hasSource ? (
                            <a
                              href={sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#B9F5D0] hover:text-white bg-[#0F3D24] hover:bg-[#152B21] border border-[#1E3A2C] font-semibold text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 9l3 3-3 3m8 0h-4"
                                />
                              </svg>
                              <span>Source</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  }

                  // CARD 1: Standard Card (Material 3 Expressive Vertical Layout)
                  if (modIndex === 1) {
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");
                    const linkUrl = sourceUrl || project.liveUrl || "#";

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[10px] rounded-br-[10px] overflow-hidden border border-[#1E3A2C] bg-[#0F221A] shadow-lg transition-all duration-450 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tl-[30px] hover:rounded-br-[30px] hover:rounded-tr-[10px] hover:rounded-bl-[10px] hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#081410]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={600}
                                height={450}
                                priority={index < 2}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#081410] text-xs font-semibold text-[#8FAB9C]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-3 top-3 rounded-[16px] bg-[#0F3D24] text-[#B9F5D0] border border-[#1E3A2C] px-3.5 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="p-6 pb-2 space-y-4 flex-1 flex flex-col justify-between text-[#EAF6EF]">
                            <div className="space-y-3">
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {techs.slice(0, 2).map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#0B3B36] text-[#B0F5EC] px-2.5 py-1 text-[10.5px] font-mono rounded-[6px] uppercase font-medium"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="font-heading text-xl font-semibold tracking-tight text-[#EAF6EF] group-hover:text-[#4ADE80] transition-colors">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-xs leading-relaxed text-[#8FAB9C] line-clamp-3">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Repository link */}
                        <div className="p-6 pt-2">
                          {isSourceLocked ? (
                            <span className="text-[#8FAB9C]/60 font-bold text-xs inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>Source is not public</span>
                              <svg
                                className="w-3.5 h-3.5 text-[#8FAB9C]/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </span>
                          ) : (
                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4ADE80] hover:text-[#5EEAD4] font-bold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Repository</span>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // CARD 2: Material 3 Expressive Dark Card
                  if (modIndex === 2) {
                    const hasLive = !!project.liveUrl;
                    const sourceObj = project.source;
                    const isSourceLocked = sourceObj && typeof sourceObj === "object" && sourceObj.locked === true;
                    const sourceUrl = isSourceLocked ? "" : (sourceObj?.sourceUrl || (typeof sourceObj === "string" && sourceObj) || "");

                    return (
                      <div
                        key={project._id || `project-${index}`}
                        className="col-span-1 rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[10px] rounded-br-[10px] overflow-hidden border border-[#1E3A2C] bg-[#0F221A] shadow-lg transition-all duration-450 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tl-[30px] hover:rounded-br-[30px] hover:rounded-tr-[10px] hover:rounded-bl-[10px] hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <Link
                          href={route}
                          className="group block focus:outline-none flex-1 flex flex-col justify-between"
                        >
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#081410]">
                            {getSingleImageAsset(project.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(project.image)}
                                alt={project.title || "Project image"}
                                width={600}
                                height={450}
                                className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#081410] text-xs font-semibold text-[#8FAB9C]">
                                No preview image
                              </div>
                            )}
                            {typeName && (
                              <div className="absolute right-3 top-3 rounded-[16px] bg-[#0F3D24] text-[#B9F5D0] border border-[#1E3A2C] px-3.5 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md">
                                {typeName}
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="p-6 pb-2 space-y-4 flex-1 flex flex-col justify-between text-[#EAF6EF]">
                            <div className="space-y-3">
                              {techs.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {techs.slice(0, 2).map((tech, techIdx) => (
                                    <span
                                      key={`${tech}-${techIdx}`}
                                      className="bg-[#0B3B36] text-[#B0F5EC] px-2.5 py-1 text-[10.5px] font-mono rounded-[6px] uppercase font-medium"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3 className="font-heading text-xl font-semibold tracking-tight text-[#EAF6EF] group-hover:text-[#4ADE80] transition-colors">
                                {project.title || "Untitled Project"}
                              </h3>
                              {excerpt && (
                                <p className="text-xs leading-relaxed text-[#8FAB9C] line-clamp-3">
                                  {excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Explore link */}
                        <div className="p-6 pt-2">
                          {hasLive ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4ADE80] hover:text-[#5EEAD4] font-bold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Explore</span>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </a>
                          ) : isSourceLocked ? (
                            <span className="text-[#8FAB9C]/60 font-bold text-xs inline-flex items-center gap-1.5 cursor-not-allowed">
                              <span>Source is not public</span>
                              <svg
                                className="w-3.5 h-3.5 text-[#8FAB9C]/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </span>
                          ) : sourceUrl ? (
                            <a
                              href={sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4ADE80] hover:text-[#5EEAD4] font-bold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>Explore</span>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  }

                  // CARD 3: Material 3 Expressive Wide Split Card
                  return (
                    <Link
                      key={project._id || `project-${index}`}
                      href={route}
                      className="group block col-span-1 md:col-span-2 focus:outline-none flex"
                    >
                      <article className="w-full h-full flex flex-col-reverse md:flex-row overflow-hidden rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[10px] rounded-br-[10px] border border-[#1E3A2C] bg-[#0F221A] shadow-lg transition-all duration-450 ease-[cubic-bezier(.34,1.56,.64,1)] hover:rounded-tl-[30px] hover:rounded-br-[30px] hover:rounded-tr-[10px] hover:rounded-bl-[10px] hover:-translate-y-1">
                        {/* Left Side: Content Container */}
                        <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between text-[#EAF6EF] w-full md:w-1/2">
                          <div className="space-y-4">
                            {techs.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {techs.slice(0, 3).map((tech, techIdx) => (
                                  <span
                                    key={`${tech}-${techIdx}`}
                                    className="bg-[#0B3B36] text-[#B0F5EC] px-3 py-1 text-[10.5px] font-mono rounded-[16px] uppercase font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            <h3 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#EAF6EF] group-hover:text-[#4ADE80] transition-colors leading-tight">
                              {project.title || "Untitled Project"}
                            </h3>
                            {excerpt && (
                              <p className="text-sm leading-relaxed text-[#8FAB9C]">
                                {excerpt}
                              </p>
                            )}
                          </div>

                          <div className="pt-2">
                            <span className="bg-[#4ADE80] hover:bg-[#3bc770] !text-[#062011] font-bold text-xs py-2.5 px-5 rounded-full inline-block transition-all duration-300">
                              View Case Study
                            </span>
                          </div>
                        </div>

                        {/* Right Side: Image Showcase */}
                        <div className="relative w-full md:w-1/2 bg-[#081410] aspect-[4/3] md:aspect-auto overflow-hidden">
                          {getSingleImageAsset(project.image) ? (
                            <CockpitImage
                              asset={getSingleImageAsset(project.image)}
                              alt={project.title || "Project image"}
                              width={600}
                              height={600}
                              className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#081410] text-xs font-semibold text-[#8FAB9C]">
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
              <div className="text-center rounded-[24px] border border-[#1E3A2C] bg-[#0F221A] p-12">
                <p className="text-[#8FAB9C] font-medium">No projects found.</p>
              </div>
            )}

            {/* Showcase Pagination (Material 3 Expressive) */}
            {page._pagination && page._pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#1E3A2C] pt-6 mt-10 gap-4">
                <div className="text-xs text-[#8FAB9C] font-medium">
                  Showing{" "}
                  <span className="font-bold text-[#EAF6EF]">
                    {Math.min(page._pagination.page * page._pagination.limit, page._pagination.total)}
                  </span>{" "}
                  of <span className="font-bold text-[#EAF6EF]">{page._pagination.total}</span> projects
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  {page._pagination.page > 1 ? (
                    <Link
                      href={`?page=${page._pagination.page - 1}`}
                      className="border border-[#1E3A2C] bg-[#0F221A] hover:bg-[#0F3D24] text-[#EAF6EF] hover:text-[#B9F5D0] font-bold text-xs py-2.5 px-5 rounded-[16px] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Previous
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="border border-[#1E3A2C]/30 bg-[#081410]/50 text-[#8FAB9C]/40 font-bold text-xs py-2.5 px-5 rounded-[16px] cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Previous
                    </button>
                  )}

                  {/* Page Info */}
                  <span className="text-xs font-bold text-[#8FAB9C] px-3.5 py-1.5 rounded-[12px] bg-[#0F221A] border border-[#1E3A2C]/50">
                    Page {page._pagination.page} of {page._pagination.pages}
                  </span>

                  {/* Next Button */}
                  {page._pagination.page < page._pagination.pages ? (
                    <Link
                      href={`?page=${page._pagination.page + 1}`}
                      className="border border-[#1E3A2C] bg-[#0F221A] hover:bg-[#0F3D24] text-[#EAF6EF] hover:text-[#B9F5D0] font-bold text-xs py-2.5 px-5 rounded-[16px] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] inline-flex items-center gap-1.5 shadow-sm"
                    >
                      Next
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="border border-[#1E3A2C]/30 bg-[#081410]/50 text-[#8FAB9C]/40 font-bold text-xs py-2.5 px-5 rounded-[16px] cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                      Next
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Layout after listing */}
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
        {/* Layout before detail */}
        {detailBefore.length > 0 && (
          <LayoutRenderer components={detailBefore} locale={locale} />
        )}

        <article className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 min-w-0">
          {/* Breadcrumb / Back button */}
          <div>
            <Link
              href={localePath(locale, "projects")}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8FAB9C] hover:text-[#4ADE80] transition-all bg-[#0F221A] border border-[#1E3A2C] px-4 py-2 rounded-full hover:border-[#4ADE80]/40"
            >
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Hero Header */}
          <div className="space-y-4 min-w-0">
            {typeName && (
              <span className="inline-block rounded-full border border-[#1E3A2C] bg-[#0F3D24] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#B9F5D0]">
                {typeName}
              </span>
            )}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-medium capitalize tracking-tight text-[#EAF6EF] leading-tight break-words">
              {item.title || page.title || "Untitled Project"}
            </h1>
          </div>

          {/* Main Cover Image / Image Slider */}
          {resolvedImages.length > 0 && (
            <ImageSlider images={resolvedImages} />
          )}

          {/* Two-Column Details Breakdown */}
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-3 pt-4 min-w-0">
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6 min-w-0 w-full">
              <HighlightedHtml
                className="prose prose-invert max-w-none w-full min-w-0 break-words [overflow-wrap:anywhere] prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#EAF6EF] prose-headings:break-words prose-p:leading-relaxed prose-p:text-[#8FAB9C] prose-p:break-words prose-a:text-[#4ADE80] hover:prose-a:text-[#5EEAD4] prose-pre:max-w-full prose-pre:overflow-x-auto prose-img:rounded-2xl"
                html={item.contents || ""}
              />
            </div>

            {/* Right Column: Metadata Sidebar */}
            <div className="space-y-6 min-w-0 w-full">
              <div className="rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#0F221A] p-5 sm:p-8 space-y-6 shadow-lg min-w-0">
                <h3 className="font-heading text-lg font-bold text-[#EAF6EF] tracking-tight">
                  Project Information
                </h3>

                <div className="space-y-4 text-sm divide-y divide-[#1E3A2C]">
                  {typeName && (
                    <div className="flex flex-col gap-1 pt-3 first:pt-0">
                      <span className="text-xs uppercase tracking-wider text-[#8FAB9C] font-bold">
                        Category
                      </span>
                      <span className="font-medium text-[#EAF6EF]">
                        {typeName}
                      </span>
                    </div>
                  )}

                  {item.liveUrl && (
                    <div className="flex flex-col gap-1 pt-3">
                      <span className="text-xs uppercase tracking-wider text-[#8FAB9C] font-bold">
                        Live Link
                      </span>
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#4ADE80] hover:text-[#5EEAD4] transition-colors inline-flex items-center gap-1.5 hover:underline"
                      >
                        View Live Site
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  {sourceObj && (
                    <div className="flex flex-col gap-1 pt-3">
                      <span className="text-xs uppercase tracking-wider text-[#8FAB9C] font-bold">
                        Source Code
                      </span>
                      {isSourceLocked ? (
                        <span className="font-semibold text-[#8FAB9C]/60 inline-flex items-center gap-1.5 cursor-not-allowed">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Source is not public
                        </span>
                      ) : (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#EAF6EF] hover:text-[#4ADE80] transition-colors inline-flex items-center gap-1.5 hover:underline"
                        >
                          GitHub Repository
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {techs.length > 0 && (
                    <div className="flex flex-col gap-2.5 pt-3">
                      <span className="text-xs uppercase tracking-wider text-[#8FAB9C] font-bold">
                        Technologies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {techs.map((tech, techIdx) => (
                          <span
                            key={`${tech}-${techIdx}`}
                            className="rounded-[12px] border border-[#1E3A2C]/60 bg-[#0B3B36] text-[#B0F5EC] px-3 py-1 text-xs font-mono uppercase font-medium"
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
                <div className="rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#0F221A] p-6 sm:p-8 space-y-6 shadow-lg">
                  <h3 className="font-heading text-lg font-bold text-[#EAF6EF] tracking-tight">
                    Latest Projects
                  </h3>

                  <div className="space-y-4">
                    {latestProjects.map((proj, idx) => {
                      const route = proj.slug ? localePath(locale, `projects/${proj.slug}`) : "#";
                      const typeName = proj.projects_type?.type_name || proj.projects_type?.title || "";

                      return (
                        <Link
                          key={proj._id || `latest-${idx}`}
                          href={route}
                          className="group flex gap-4 items-center p-2 -mx-2 rounded-[16px] hover:bg-[#152B21] transition-all duration-300"
                        >
                          {/* Small Thumbnail */}
                          <div className="relative w-24 h-16 rounded-[12px] overflow-hidden bg-[#081410] flex-shrink-0 border border-[#1E3A2C]">
                            {getSingleImageAsset(proj.image) ? (
                              <CockpitImage
                                asset={getSingleImageAsset(proj.image)}
                                alt={proj.title}
                                width={300}
                                height={150}
                                className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#081410]" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1 space-y-0.5">
                            {typeName && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4ADE80]">
                                {typeName}
                              </span>
                            )}
                            <h4 className="text-sm font-semibold text-[#EAF6EF] group-hover:text-[#4ADE80] transition-colors truncate">
                              {proj.title}
                            </h4>
                          </div>

                          {/* Arrow */}
                          <div className="text-[#8FAB9C] group-hover:text-[#4ADE80] transition-colors pr-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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

        {/* Layout after detail */}
        {detailAfter.length > 0 && (
          <LayoutRenderer components={detailAfter} locale={locale} />
        )}
      </div>
    );
  }

  return null;
}

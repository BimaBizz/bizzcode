import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CockpitImage from "@/components/cockpit-image";
import { getLatestPosts } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
// export const instant = false;

export const metadata = {
  title: "Blog",
  description: "Daftar artikel dari Cockpit CMS",
};

export default async function BlogPage({ params }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const posts = await getLatestPosts({ locale, preview, limit: 24 });

  return (
    <section className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-[#FAFAFA]">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] p-5 shadow-lg transition-colors hover:border-[#3F3F46]">
            <CockpitImage
              asset={post.featured_image}
              alt={post.title}
              width={640}
              height={360}
              className="h-44 w-full object-cover rounded-lg"
            />
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA] hover:text-[#E8452C] transition-colors">
                <Link href={localePath(locale, `blog/${post.slug}`)}>{post.title}</Link>
              </h2>
              {post.excerpt ? <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">{post.excerpt}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

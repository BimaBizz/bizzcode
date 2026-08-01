import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CockpitImage from "@/components/cockpit-image";
import { getLatestPosts } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";

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
    <section className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="overflow-hidden rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#0F221A] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CockpitImage
              asset={post.featured_image}
              alt={post.title}
              width={640}
              height={360}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                <Link href={localePath(locale, `blog/${post.slug}`)}>{post.title}</Link>
              </h2>
              {post.excerpt ? <p className="text-sm opacity-80">{post.excerpt}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

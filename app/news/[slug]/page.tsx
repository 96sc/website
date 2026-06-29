import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot, getNewsBySlug } from "@/lib/cms/content";
import { isExternalHref, newsSlug } from "@/lib/cms/links";
import { formatDate } from "@/lib/utils/date";

type NewsPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const snapshot = await getCmsSnapshot();
  return snapshot.news.map((post) => ({ slug: newsSlug(post) }));
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    return {
      title: "News"
    };
  }

  return {
    title: post.title,
    description: post.summary
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">{formatDate(post.date)}</p>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          <div className="button-row">
            <ActionLink href="/news" variant="secondary">
              All news
            </ActionLink>
            {post.href ? (
              <ActionLink href={post.href} external={isExternalHref(post.href)}>
                Related link
              </ActionLink>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section">
        <article className="article-body article-body-narrow">
          <SectionHeading title="Details" />
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </section>

      <ContactStrip />
    </>
  );
}

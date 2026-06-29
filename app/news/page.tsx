import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { newsPath } from "@/lib/cms/links";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "News",
  description: "Town news, notices, and posts from the Town of Ninety Six."
};

export default async function NewsPage() {
  const snapshot = await getCmsSnapshot();
  const posts = [...snapshot.news].sort((firstPost, secondPost) => {
    return new Date(secondPost.date).getTime() - new Date(firstPost.date).getTime();
  });

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">News</p>
          <h1>Latest from Town Hall.</h1>
          <p>News posts published in WordPress appear here and get their own public pages.</p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="News posts" />
        <div className="event-grid">
          {posts.map((post) => (
            <Link className="event-card" href={newsPath(post)} key={post.id}>
              <p className="eyebrow">{formatDate(post.date)}</p>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}

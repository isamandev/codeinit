import Link from "next/link";
import type { Metadata } from "next";
import { readArticles } from "@/shared/lib/articles";
import type { Post } from "@/shared/lib/posts";
import { toJalali } from "@/shared/lib/date";

type Props = {
  params: { postId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await readArticles();
  const post = posts.find((p) => p.id === params.postId);
  if (!post) return { title: "مقاله" };
  return { title: post.title, description: post.description ?? undefined };
}

export default async function PostDetail({ params }: Props) {
  const posts = await readArticles();
  const post = posts.find((p) => p.id === params.postId) as Post | undefined;

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">مطلب پیدا نشد</h1>
        <Link
          href="/posts"
          className="text-sm text-[var(--color-scarlet-rose)] underline"
        >
          بازگشت به لیست مقالات
        </Link>
      </main>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
        <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-3">
          <span>{post.author ?? "نویسنده نامشخص"}</span>
          {post.published && <span>• {toJalali(post.published)}</span>}
        </div>
      </header>

      {post.imageUrl && (
        <div className="mb-6">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-md"
          />
        </div>
      )}

      {post.aiIntro && (
        <p className="mb-4 text-[var(--muted-foreground)]">{post.aiIntro}</p>
      )}

      {post.description ? (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
      ) : (
        <p className="text-[var(--muted-foreground)]">
          متن مقاله در دسترس نیست.
        </p>
      )}

      <footer className="mt-8">
        <Link
          href="/posts"
          className="text-sm text-[var(--color-scarlet-rose)] underline"
        >
          بازگشت به لیست مقالات
        </Link>
      </footer>
    </article>
  );
}

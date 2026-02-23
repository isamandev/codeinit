import Link from "next/link";
import { PostCard } from "@/features/posts/ui/PostCard";
import type { Post } from "@/shared/lib/posts";
import BooksScroller from "@/components/BooksScroller";

export default async function Home() {
  const [booksRes, articlesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/books`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/posts`),
  ]);

  const books: Post[] = booksRes.ok ? await booksRes.json() : [];
  const articles: Post[] = articlesRes.ok ? await articlesRes.json() : [];

  const recentBooks = books
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .slice(0, 8);
  const recentArticles = articles
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .slice(0, 8);

  return (
    <div className="min-h-screen">
      <section className="rounded-lg bg-gradient-to-tr from-[#0ea5a6] to-[#64748b] text-white p-6 sm:p-12 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row items-center gap-6 rtl:text-right px-4 sm:px-0">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold">کد اینیت</h1>
            <p className="mt-3 text-sm sm:text-base text-white/90">
              جامعه‌ای برای یادگیری، به اشتراک‌گذاری و رشدِ برنامه‌نویسان.
              مقاله، کتاب، پروژه و ابزارهای مفید — همه کنار هم.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                href="/books/books"
                className="inline-block bg-white text-[#0f172a] px-4 py-2 rounded-md font-medium"
              >
                مرور منابع
              </Link>

              <Link
                href="/dashboard/posts"
                className="inline-block border border-white/30 text-white px-4 py-2 rounded-md font-medium"
              >
                ورود به داشبورد
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto rtl:text-right">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">آخرین مقالات</h2>
            <Link
              href="/posts"
              className="text-sm text-[var(--muted-foreground)]"
            >
              مشاهده همه
            </Link>
          </div>

          {recentArticles.length === 0 ? (
            <div className="p-6 border rounded text-center">
              هنوز مقاله‌ای اضافه نشده.{" "}
              <Link href="/dashboard/posts/add" className="underline">
                اولین مقاله را ارسال کن
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentArticles.map((p) => (
                <PostCard
                  key={p.id}
                  post={{
                    id: p.id,
                    title: p.title,
                    excerpt: p.description,
                    publishedAt: p.createdAt,
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">آخرین کتاب‌ها</h2>
            <Link
              href="/books/books"
              className="text-sm text-[var(--muted-foreground)]"
            >
              مشاهده همه
            </Link>
          </div>

          {recentBooks.length === 0 ? (
            <div className="p-6 border rounded text-center">
              هنوز کتابی اضافه نشده.{" "}
              <Link href="/dashboard/books/add" className="underline">
                اولین کتاب را اضافه کن
              </Link>
              .
            </div>
          ) : (
            <BooksScroller books={recentBooks} />
          )}
        </section>
      </main>
    </div>
  );
}

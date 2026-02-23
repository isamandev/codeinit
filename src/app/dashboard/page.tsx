import Link from "next/link";

export default function Page() {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        داشبورد مدیریتی با اطلاعات کلی و دسترسی سریع.
      </p>

      <div className="grid gap-3">
        <Link href="/dashboard/books" className="px-4 py-2 border rounded">
          مدیریت کتاب‌ها
        </Link>
        <Link href="/dashboard/books/add" className="px-4 py-2 border rounded">
          افزودن کتاب
        </Link>
        <Link href="/dashboard/posts" className="px-4 py-2 border rounded">
          مقالات
        </Link>
        <Link href="/dashboard/posts/add" className="px-4 py-2 border rounded">
          ارسال مقاله
        </Link>
      </div>
    </section>
  );
}

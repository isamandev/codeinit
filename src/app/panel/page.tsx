import Link from "next/link";

export default function Page() {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Panel</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        پنل ساده برای نمایش لینک‌ها و ابزارها.
      </p>

      <div className="grid gap-3">
        <Link href="/panel/tools" className="px-4 py-2 border rounded">
          ابزارها
        </Link>
        <Link href="/panel/stats" className="px-4 py-2 border rounded">
          آمار
        </Link>
        <Link href="/panel/posts/add" className="px-4 py-2 border rounded">
          افزودن مقاله
        </Link>
        <Link href="/panel/posts" className="px-4 py-2 border rounded">
          مدیریت مقالات
        </Link>
      </div>
    </section>
  );
}

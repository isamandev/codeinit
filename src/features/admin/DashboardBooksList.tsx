"use client";

import Link from "next/link";
import { useBooks } from "@/shared/lib/swr/useBooks";

export default function DashboardBooksList() {
  const {
    books: posts,
    isLoading: loading,
    error: fetchError,
    mutate,
  } = useBooks();
  const error = fetchError
    ? fetchError instanceof Error
      ? fetchError.message
      : String(fetchError)
    : null;

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این کتاب مطمئنی؟")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حذف انجام نشد");
      await mutate();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">مدیریت کتاب‌ها</h2>
        <Link
          href="/dashboard/books/add"
          className="px-3 py-1 bg-sky-600 text-white rounded"
        >
          افزودن کتاب
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="p-4 border rounded">هیچ کتابی پیدا نشد.</div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">عنوان</th>
                <th className="px-3 py-2">نویسنده</th>
                <th className="px-3 py-2">ایجاد شده</th>
                <th className="px-3 py-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.title}</td>
                  <td className="px-3 py-2">{p.author || "-"}</td>
                  <td className="px-3 py-2">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/books/books/${p.id}`}
                        className="text-sky-600"
                      >
                        نمایش
                      </Link>
                      <Link
                        href={`/panel/books/edit/${p.id}`}
                        className="text-amber-600"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => void handleDelete(p.id)}
                        className="text-red-600"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

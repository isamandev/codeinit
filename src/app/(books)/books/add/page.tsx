"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState("");
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("عنوان اجباری است.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          imageUrl,
          description,
          published,
          pages: pages ? Number(pages) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || res.statusText || "خطا در ایجاد پست");
      }
      const created = await res.json();
      // پس از ایجاد، بازگشت به لیست کتاب‌ها
      router.push("/books");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">افزودن کتاب جدید</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">عنوان *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 border rounded-md"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">نویسنده</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">
            تصویر کتاب (آپلود یا آدرس)
          </span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="یا آدرس وارد کنید: /uploads/your-image.jpg"
            className="mt-1 p-2 border rounded-md"
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setError(null);
                try {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = async () => {
                    const data = reader.result as string;
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ filename: file.name, data }),
                    });
                    if (!res.ok) {
                      const d = await res.json().catch(() => ({}));
                      throw new Error(d?.error || res.statusText);
                    }
                    const json = await res.json();
                    setImageUrl(json.url);
                  };
                } catch (err: any) {
                  setError(String(err?.message ?? err));
                } finally {
                  setUploading(false);
                }
              }}
            />
            <div className="text-sm text-gray-600">
              {uploading ? "در حال آپلود..." : "یا فایل انتخاب کنید"}
            </div>
          </div>

          {imageUrl && (
            <div className="mt-3 w-40 h-56 relative border rounded overflow-hidden">
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">توضیحات</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-700">سال انتشار</span>
            <input
              value={published}
              onChange={(e) => setPublished(e.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700">تعداد صفحات</span>
            <input
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </label>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-3">
          <Button type="primary">
            {loading ? "در حال ارسال..." : "ایجاد"}
          </Button>
          <Button type="tertiary" onClick={() => router.back()}>
            انصراف
          </Button>
        </div>
      </form>
    </main>
  );
}

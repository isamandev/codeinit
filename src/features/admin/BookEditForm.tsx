"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { Button } from "@/shared/ui";
import type { Post } from "@/shared/lib/posts";

type Props = {
  initialData: Post;
  redirectAfter?: string;
};

type UpdateBookArg = {
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  aiIntro?: string;
  published: string;
  pages?: number;
};

async function updateBook(url: string, { arg }: { arg: UpdateBookArg }) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || response.statusText || "خطا در بروزرسانی");
  }
  return response.json();
}

export default function BookEditForm({
  initialData,
  redirectAfter = "/panel/books",
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || "");
  const [author, setAuthor] = useState(initialData.author || "");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [aiIntro, setAiIntro] = useState(initialData.aiIntro || "");
  void setAiIntro;
  const [published, setPublished] = useState(initialData.published || "");
  const [pages, setPages] = useState(
    initialData.pages ? String(initialData.pages) : "",
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const {
    trigger,
    isMutating,
    error: mutationError,
  } = useSWRMutation(`/api/books/${initialData.id}`, updateBook);
  const error =
    validationError ??
    (mutationError instanceof Error
      ? mutationError.message
      : mutationError
        ? String(mutationError)
        : null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setValidationError(null);
    if (!title.trim()) {
      setValidationError("عنوان اجباری است.");
      return;
    }
    try {
      await trigger({
        title,
        author,
        imageUrl,
        description,
        aiIntro: aiIntro || undefined,
        published,
        pages: pages ? Number(pages) : undefined,
      });
      await mutate("/api/books");
      router.push(redirectAfter);
    } catch {
      // error state managed by useSWRMutation
    }
  }

  async function handleDelete() {
    if (!confirm("آیا از حذف این کتاب مطمئنی؟")) return;
    try {
      const response = await fetch(`/api/books/${initialData.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "حذف انجام نشد");
      }
      await mutate("/api/books");
      router.push(redirectAfter);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">ویرایش کتاب</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">عنوان *</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 p-2 border rounded-md"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">نویسنده</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">تصویر کتاب (آدرس)</span>
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="یا آدرس وارد کنید: /uploads/your-image.jpg"
            className="mt-1 p-2 border rounded-md"
          />
          {imageUrl && (
            <div className="mt-3 w-40 h-56 relative border rounded overflow-hidden">
              <Image
                src={imageUrl}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">توضیحات</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-700">سال انتشار</span>
            <input
              value={published}
              onChange={(event) => setPublished(event.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700">تعداد صفحات</span>
            <input
              value={pages}
              onChange={(event) => setPages(event.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </label>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-3">
          <Button type="primary">
            {isMutating ? "در حال بروزرسانی..." : "بروزرسانی"}
          </Button>
          <Button
            type="secondary"
            onClick={() => setPreview((isVisible) => !isVisible)}
          >
            {preview ? "بستن پیش‌نمایش" : "پیش‌نمایش"}
          </Button>
          <Button type="tertiary" onClick={() => router.back()}>
            انصراف
          </Button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            className="px-3 py-2 bg-red-600 text-white rounded-md"
          >
            حذف
          </button>
        </div>
      </form>

      {preview && (
        <section className="mt-8 p-4 border rounded-md bg-white">
          <h2 className="text-lg font-semibold mb-2">پیش‌نمایش</h2>
          <div className="flex gap-4">
            {imageUrl ? (
              <div className="w-32 h-48 relative rounded overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-48 flex items-center justify-center border text-sm text-[var(--muted-foreground)]">
                بدون تصویر
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold">{title || "(بدون عنوان)"}</h3>
              <div className="text-sm text-[var(--muted-foreground)]">
                {author || "-"}
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {description || aiIntro || "(بدون توضیح)"}
              </p>
              <div className="mt-3 text-xs text-[var(--muted-foreground)]">
                سال: {published || "-"} • صفحات: {pages || "-"}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

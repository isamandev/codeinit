"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { Button } from "@/shared/ui";

type CreateBookArg = {
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  published: string;
  pages?: number;
};

async function createBook(url: string, { arg }: { arg: CreateBookArg }) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || response.statusText || "خطا در ایجاد کتاب");
  }
  return response.json();
}

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState("");
  const [pages, setPages] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const {
    trigger,
    isMutating,
    error: mutationError,
  } = useSWRMutation("/api/books", createBook);
  const error =
    uploadError ??
    (mutationError instanceof Error
      ? mutationError.message
      : mutationError
        ? String(mutationError)
        : null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setUploadError(null);
    if (!title.trim()) {
      setUploadError("عنوان اجباری است.");
      return;
    }
    try {
      await trigger({
        title,
        author,
        imageUrl,
        description,
        published,
        pages: pages ? Number(pages) : undefined,
      });
      await mutate("/api/books");
      // پس از ایجاد، بازگشت به لیست کتاب‌ها
      router.push("/books");
    } catch {
      // error state managed by useSWRMutation
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
          <span className="text-sm text-gray-700">
            تصویر کتاب (آپلود یا آدرس)
          </span>
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="یا آدرس وارد کنید: /uploads/your-image.jpg"
            className="mt-1 p-2 border rounded-md"
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setUploadError(null);
                try {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = async () => {
                    const data = reader.result as string;
                    const uploadResponse = await fetch("/api/upload", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ filename: file.name, data }),
                    });
                    if (!uploadResponse.ok) {
                      const uploadErrorData = await uploadResponse
                        .json()
                        .catch(() => ({}));
                      throw new Error(
                        uploadErrorData?.error || uploadResponse.statusText,
                      );
                    }
                    const uploadResult = await uploadResponse.json();
                    setImageUrl(uploadResult.url);
                  };
                } catch (error) {
                  setUploadError(
                    String(error instanceof Error ? error.message : error),
                  );
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
            {isMutating ? "در حال ارسال..." : "ایجاد"}
          </Button>
          <Button type="tertiary" onClick={() => router.back()}>
            انصراف
          </Button>
        </div>
      </form>
    </main>
  );
}

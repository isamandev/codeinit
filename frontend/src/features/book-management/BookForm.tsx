"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { Button } from "@/shared/ui";

type Props = {
  redirectAfter?: string;
};

type CreateBookArg = {
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  aiIntro?: string;
  tags?: string[];
  categories?: string[];
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
    throw new Error(data?.error || response.statusText || "خطا در ایجاد پست");
  }
  return response.json();
}

export default function AdminBookForm({ redirectAfter = "/books" }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [aiIntro, setAiIntro] = useState("");
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [aiCategories, setAiCategories] = useState<string[]>([]);
  const [published, setPublished] = useState("");
  const [pages, setPages] = useState("");
  const [generatingIntro, setGeneratingIntro] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    trigger,
    isMutating,
    error: mutationError,
  } = useSWRMutation("/api/books", createBook);
  const displayError =
    error ??
    (mutationError instanceof Error
      ? mutationError.message
      : mutationError
        ? String(mutationError)
        : null);

  async function handleGenerateIntro() {
    setError(null);
    if (!title.trim()) {
      setError("برای تولید معرفی خودکار، عنوان کتاب را وارد کنید.");
      return;
    }

    setGeneratingIntro(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, description }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "خطا در تولید معرفی با AI");
      }

      const text = typeof data?.text === "string" ? data.text : "";
      if (text) {
        setAiIntro(text);
        if (!description.trim()) setDescription(text);
      }
      if (Array.isArray(data?.tags)) {
        setAiTags(
          data.tags
            .map((tag: unknown) => (typeof tag === "string" ? tag.trim() : ""))
            .filter(Boolean),
        );
      }
      if (Array.isArray(data?.categories)) {
        setAiCategories(
          data.categories
            .map((category: unknown) =>
              typeof category === "string" ? category.trim() : "",
            )
            .filter(Boolean),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setGeneratingIntro(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("عنوان اجباری است.");
      return;
    }
    try {
      await trigger({
        title,
        author,
        imageUrl,
        description,
        aiIntro: aiIntro || undefined,
        tags: aiTags.length ? aiTags : undefined,
        categories: aiCategories.length ? aiCategories : undefined,
        published,
        pages: pages ? Number(pages) : undefined,
      });
      await mutate("/api/books");
      router.push(redirectAfter);
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
                setError(null);
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
                    const json = await uploadResponse.json();
                    setImageUrl(json.url);
                  };
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : String(error);
                  setError(message);
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

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">معرفی کتاب (AI)</span>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                void handleGenerateIntro();
              }}
              className="min-h-full p-2 border-2 rounded-2xl font-semibold drop-shadow-xs hover:drop-shadow-md transition-all duration-200 btn-secondary"
            >
              {generatingIntro ? "در حال تولید معرفی..." : "تولید معرفی با AI"}
            </button>
          </div>
          {(aiTags.length > 0 || aiCategories.length > 0) && (
            <div className="mt-2 text-sm text-gray-700">
              {aiCategories.length > 0 && (
                <div>دسته‌بندی‌ها: {aiCategories.join("، ")}</div>
              )}
              {aiTags.length > 0 && <div>تگ‌ها: {aiTags.join("، ")}</div>}
            </div>
          )}
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

        {displayError && <div className="text-red-600">{displayError}</div>}

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

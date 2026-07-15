"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { Button } from "@/shared/ui";

type Props = {
  redirectAfter?: string;
};

type CreatePostArg = {
  title: string;
  description: string;
  author: string;
  imageUrl: string;
};

async function createPost(url: string, { arg }: { arg: CreatePostArg }) {
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

export default function PostForm({ redirectAfter = "/posts" }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    trigger,
    isMutating,
    error: mutationError,
  } = useSWRMutation("/api/posts", createPost);
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
      await trigger({ title, description, author, imageUrl });
      router.push(redirectAfter);
    } catch {
      // error state managed by useSWRMutation
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">ارسال مقاله جدید</h1>
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
          <span className="text-sm text-gray-700">تصویر (آدرس)</span>
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/uploads/your-image.jpg"
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">محتوا / توضیحات</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="mt-1 p-2 border rounded-md"
          />
        </label>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-3">
          <Button type="primary">
            {isMutating ? "در حال ارسال..." : "ارسال"}
          </Button>
          <Button type="tertiary" onClick={() => router.back()}>
            انصراف
          </Button>
        </div>
      </form>
    </main>
  );
}

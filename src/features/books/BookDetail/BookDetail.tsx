"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import type { Post } from "@/shared/lib/posts";

type Review = {
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  replies?: { name: string; comment: string; createdAt: string }[];
};

type Props = {
  id: string;
  title: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  aiIntro?: string;
  published?: string;
  pages?: number;
  publisher?: string;
  isbn?: string;
  price?: number | string;
  tags?: string[];
  categories?: string[];
  recommendations?: Post[];
};

export default function BookDetail({
  id,
  title,
  author,
  imageUrl = "/harry-potter-book.jpg",
  description,
  aiIntro,
  published,
  pages,
  publisher,
  isbn,
  price,
  tags = [],
  categories = [],
  recommendations = [],
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [aiText, setAiText] = useState<string | null>(aiIntro ?? null);
  const [aiTags, setAiTags] = useState<string[]>(tags);
  const [aiCategories, setAiCategories] = useState<string[]>(categories);
  const [generating, setGenerating] = useState(false);
  const descRef = useRef<HTMLDivElement | null>(null);

  const storageKey = `book-reviews-${id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setReviews(JSON.parse(raw) as Review[]);
    } catch (error) {
      console.warn("failed reading reviews from storage", error);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (error) {
      console.warn("failed saving reviews to storage", error);
    }
  }, [reviews, storageKey]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      Math.round(
        (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
      ) / 10
    );
  }, [reviews]);

  function handleAddReview(event: React.FormEvent) {
    event.preventDefault();
    const newReview: Review = {
      name: name || "ناشناس",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((previousReviews) => [newReview, ...previousReviews]);
    setName("");
    setRating(5);
    setComment("");
  }

  function generateFakeReviews() {
    const now = Date.now();
    const samples: Review[] = [
      {
        name: "الهام",
        rating: 5,
        comment:
          "کتاب بسیار ارزشمندی بود؛ ساختار روشن و مثال‌های کاربردی داشت.",
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
      {
        name: "سید",
        rating: 4,
        comment: "مطالب خوب ولی بعضی بخش‌ها نیاز به توضیح بیشتر داشتند.",
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
      },
      {
        name: "مریم",
        rating: 3,
        comment: "برای تازه‌کارها مناسب است اما انتظار بیشتری داشتم.",
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
        replies: [
          {
            name: "علی",
            comment: "نکته‌ی خوبی گفتی!",
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 29).toISOString(),
          },
        ],
      },
    ];
    setReviews(samples);
  }

  function startReply(idx: number) {
    setReplyTarget(idx);
    setReplyName("");
    setReplyComment("");
  }

  function cancelReply() {
    setReplyTarget(null);
    setReplyName("");
    setReplyComment("");
  }

  function handleSubmitReply(event: React.FormEvent) {
    event.preventDefault();
    if (replyTarget === null) return;
    const reply = {
      name: replyName || "ناشناس",
      comment: replyComment,
      createdAt: new Date().toISOString(),
    };
    setReviews((previousReviews) => {
      const updatedReviews = [...previousReviews];
      const targetReview = updatedReviews[replyTarget];
      if (!targetReview.replies) targetReview.replies = [];
      targetReview.replies = [reply, ...targetReview.replies];
      return updatedReviews;
    });
    cancelReply();
  }

  const { data: aiData } = useSWR<{
    text?: string;
    tags?: string[];
    categories?: string[];
  }>(`/api/ai/intro?id=${encodeURIComponent(id)}`, {
    shouldRetryOnError: false,
    onErrorRetry: () => {},
  });

  useEffect(() => {
    if (!aiData) return;
    if (aiData.text) setAiText(aiData.text);
    if (Array.isArray(aiData.tags)) setAiTags(aiData.tags.filter(Boolean));
    if (Array.isArray(aiData.categories))
      setAiCategories(aiData.categories.filter(Boolean));
  }, [aiData]);

  async function handleGenerateAI() {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, author, description, isbn }),
      });
      if (!response.ok) throw new Error("AI service error");
      const data = await response.json();
      if (data?.text) setAiText(data.text);
      if (Array.isArray(data?.tags)) setAiTags(data.tags.filter(Boolean));
      if (Array.isArray(data?.categories))
        setAiCategories(data.categories.filter(Boolean));
    } catch (error) {
      console.warn("AI generation failed", error);
      alert("خطا در تولید متن AI. لطفا بعدا تلاش کنید.");
    } finally {
      setGenerating(false);
    }
  }

  const searchQuery = isbn || title || "";
  const encodedQuery = encodeURIComponent(searchQuery);
  const storeLinks = {
    amazon: `https://www.amazon.com/s?k=${encodedQuery}`,
    barnes: `https://www.barnesandnoble.com/s/${encodedQuery}`,
    waterstones: `https://www.waterstones.com/search?query=${encodedQuery}`,
    bookshop: `https://bookshop.org/search?query=${encodedQuery}`,
    kobo: `https://www.kobo.com/search?query=${encodedQuery}`,
    google: `https://www.google.com/search?q=${encodedQuery}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col items-center md:items-stretch">
            <div className="w-48 md:w-full lg:w-64 mx-auto md:mx-0 aspect-[2/3] rounded overflow-hidden border book-cover relative">
              <Image src={imageUrl} alt={title} fill className="object-cover" />
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold book-title">{title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-sm text-[var(--color-cork)]">
                    نویسنده:{" "}
                    <span className="font-medium text-[var(--color-german-camo)]">
                      {author || "-"}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    انتشار: {published || "-"}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    صفحات: {pages ?? "-"}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded bg-[var(--color-bread)] text-sm font-semibold">
                  دسترسی رایگان
                </div>
                <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                  امتیاز: {average} ({reviews.length})
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded bg-[var(--color-rich-coral)] text-white"
                  onClick={() =>
                    descRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  خواندن آنلاین
                </button>
                {imageUrl && (
                  <a
                    href={imageUrl}
                    download
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    دانلود جلد
                  </a>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">خرید از</h4>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={storeLinks.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded bg-[var(--color-rich-coral)] text-white text-sm"
                  >
                    آمازون
                  </a>
                  <a
                    href={storeLinks.barnes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    Barnes & Noble
                  </a>
                  <a
                    href={storeLinks.waterstones}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    Waterstones
                  </a>
                  <a
                    href={storeLinks.bookshop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    Bookshop.org
                  </a>
                  <a
                    href={storeLinks.kobo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    Kobo
                  </a>
                  <a
                    href={storeLinks.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm"
                  >
                    جستجو در وب
                  </a>
                </div>
              </div>
            </div>

            <div ref={descRef} className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">معرفی کتاب</h3>
                <button
                  type="button"
                  onClick={() => {
                    void handleGenerateAI();
                  }}
                  disabled={generating}
                  className="px-3 py-2 rounded border bg-[var(--color-bread)] text-sm disabled:opacity-60"
                >
                  {generating
                    ? "در حال تولید..."
                    : aiText
                      ? "بازتولید معرفی با AI"
                      : "تولید معرفی با AI"}
                </button>
              </div>

              {aiText ? (
                <div
                  dir="rtl"
                  className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white ring-1 ring-indigo-100 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-1 rounded-full h-12 bg-gradient-to-b from-indigo-600 to-purple-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xl font-extrabold text-[var(--color-german-camo)]">
                            {title}
                          </h4>
                          <div className="mt-2 text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                            {aiText}
                          </div>
                        </div>
                      </div>

                      {aiCategories.length > 0 && (
                        <div className="mt-3 text-sm text-[var(--muted-foreground)]">
                          دسته‌بندی‌ها: {aiCategories.join("، ")}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {aiTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-white/60 ring-1 ring-indigo-100 text-[var(--color-german-camo)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <blockquote className="mt-4 border-l-4 border-indigo-200 pl-4 italic text-sm text-[var(--muted-foreground)]">
                        خلاصهٔ ویژه: این بخش به‌صورتی کوتاه و هدفمند روندهای
                        تاثیرگذار روی تجربهٔ کاربری و معماری فرانت‌اند را برجسته
                        می‌کند.
                      </blockquote>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[var(--foreground)]">
                  {description ? (
                    <>
                      <p className={`${expanded ? "" : "line-clamp-6"}`}>
                        {description}
                      </p>
                      {description.length > 400 && (
                        <button
                          className="mt-2 text-sm text-[var(--color-scarlet-rose)]"
                          onClick={() =>
                            setExpanded((isExpanded) => !isExpanded)
                          }
                        >
                          {expanded ? "کمتر" : "ادامه مطلب"}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-[var(--muted-foreground)]">
                      توضیحی برای این کتاب وجود ندارد.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <div>
                <h4 className="text-sm font-semibold mb-1">جزئیات</h4>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-1">
                  <li>ناشر: {publisher || "-"}</li>
                  <li>سال انتشار: {published || "-"}</li>
                  <li>تعداد صفحات: {pages ?? "-"}</li>
                  <li>شابک (ISBN): {isbn || "-"}</li>
                  <li>قیمت: {price ?? "-"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Full reviews section (always shown below details) */}
        <div className="mt-6 p-6">
          <div className="mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-24 relative rounded overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">نقد و بررسی</h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 text-sm border rounded bg-[var(--muted-background)]"
                      onClick={() => generateFakeReviews()}
                    >
                      بارگذاری نمونه
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {author || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <form onSubmit={handleAddReview} className="flex flex-col gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="نام شما"
                className="p-2 border rounded"
              />
              <select
                aria-label="امتیاز"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="p-2 border rounded w-28"
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="نظر شما"
                className="p-2 border rounded"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-[var(--color-scarlet-rose)] text-white"
                >
                  ارسال نظر
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setRating(5);
                    setComment("");
                  }}
                  className="px-3 py-2 rounded border bg-[var(--color-bread)]"
                >
                  لغو
                </button>
              </div>
            </form>

            <div>
              {reviews.length === 0 ? (
                <div className="text-sm text-[var(--muted-foreground)]">
                  هنوز نظری ثبت نشده است.
                </div>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((review, index) => (
                    <li
                      key={review.createdAt + index}
                      className="border p-3 rounded"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/70 ring-1 ring-indigo-100 flex items-center justify-center text-sm font-semibold text-[var(--color-german-camo)]">
                          {(review.name || "")
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("") || "ک"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{review.name}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-[var(--color-german-camo)]">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <span
                                key={starIndex}
                                className={`text-sm ${starIndex < review.rating ? "text-yellow-400" : "text-[var(--muted-foreground)]"}`}
                              >
                                {starIndex < review.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-sm">{review.comment}</div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              className="text-sm text-[var(--color-rich-coral)]"
                              onClick={() => startReply(index)}
                            >
                              پاسخ
                            </button>
                          </div>

                          {review.replies && review.replies.length > 0 && (
                            <div className="mt-3 space-y-2 pl-12">
                              {review.replies.map((reply, replyIndex) => (
                                <div
                                  key={reply.createdAt + replyIndex}
                                  className="border-l-2 pl-3 bg-[var(--muted-background)]/80 p-3 rounded-md ring-1 ring-indigo-50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                      {reply.name}
                                    </div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="mt-1 text-sm">
                                    {reply.comment}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {replyTarget === index && (
                            <form
                              onSubmit={handleSubmitReply}
                              className="mt-3 pl-12 flex flex-col gap-2 bg-white/60 p-3 rounded-md ring-1 ring-indigo-50"
                            >
                              <input
                                value={replyName}
                                onChange={(event) =>
                                  setReplyName(event.target.value)
                                }
                                placeholder="نام شما"
                                className="p-2 border rounded w-full"
                              />
                              <textarea
                                value={replyComment}
                                onChange={(event) =>
                                  setReplyComment(event.target.value)
                                }
                                placeholder="پاسخ شما"
                                className="p-2 border rounded w-full"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-3 py-1 rounded bg-[var(--color-scarlet-rose)] text-white"
                                >
                                  ارسال
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelReply}
                                  className="px-3 py-1 rounded border bg-[var(--color-bread)]"
                                >
                                  لغو
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="mt-6">
            <div className="border rounded p-4 bg-[var(--muted-background)]">
              <h4 className="text-lg font-semibold mb-3">پیشنهاد برای شما</h4>
              <div className="flex gap-2">
                {recommendations.map((recommendation) => (
                  <a
                    key={recommendation.id}
                    href={`/books/books/${recommendation.id}`}
                    className="flex-1 min-w-0 border rounded px-3 py-2 hover:bg-[var(--muted-background)]"
                  >
                    <div className="text-sm font-medium">
                      {recommendation.title}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {recommendation.author || "-"}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

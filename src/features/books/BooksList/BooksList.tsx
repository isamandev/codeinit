"use client";

import React, { useMemo, useState } from "react";
import type { Post } from "@/shared/lib/posts";
import BookCard from "@/features/books/BookCard/BookCard";

type Props = {
  initialPosts: Post[];
};

export default function BooksList({ initialPosts }: Props) {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [yearMin, setYearMin] = useState<string>("");
  const [yearMax, setYearMax] = useState<string>("");
  const [pagesMin, setPagesMin] = useState<string>("");
  const [pagesMax, setPagesMax] = useState<string>("");
  const [sort, setSort] = useState<
    "newest" | "oldest" | "pages-asc" | "pages-desc"
  >("newest");

  const authors = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => p.author && set.add(p.author));
    return Array.from(set).sort();
  }, [initialPosts]);

  const filtered = useMemo(() => {
    let list = initialPosts.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.author || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }
    if (author) list = list.filter((p) => p.author === author);
    if (yearMin)
      list = list.filter((p) => Number(p.published || 0) >= Number(yearMin));
    if (yearMax)
      list = list.filter((p) => Number(p.published || 0) <= Number(yearMax));
    if (pagesMin)
      list = list.filter((p) => Number(p.pages || 0) >= Number(pagesMin));
    if (pagesMax)
      list = list.filter((p) => Number(p.pages || 0) <= Number(pagesMax));

    switch (sort) {
      case "newest":
        list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        break;
      case "oldest":
        list.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        break;
      case "pages-asc":
        list.sort((a, b) => Number(a.pages || 0) - Number(b.pages || 0));
        break;
      case "pages-desc":
        list.sort((a, b) => Number(b.pages || 0) - Number(a.pages || 0));
        break;
    }

    return list;
  }, [initialPosts, query, author, yearMin, yearMax, pagesMin, pagesMax, sort]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <aside className="w-full md:w-64 p-3 border rounded-md bg-white self-start sticky top-[calc(4rem+1.5rem)] max-h-[calc(100vh-(4rem+1.5rem))] overflow-auto">
        <h3 className="text-sm font-semibold mb-2">فیلترها</h3>

        <label className="block mb-2 text-xs">
          جستجو
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2 text-xs">
          نویسنده
          <select
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">همه</option>
            {authors.map((authorName) => (
              <option key={authorName} value={authorName}>
                {authorName}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <label>
            سال از
            <input
              value={yearMin}
              onChange={(event) => setYearMin(event.target.value)}
              className="mt-1 w-full p-1 border rounded"
            />
          </label>
          <label>
            تا
            <input
              value={yearMax}
              onChange={(event) => setYearMax(event.target.value)}
              className="mt-1 w-full p-1 border rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
          <label>
            صفحات از
            <input
              value={pagesMin}
              onChange={(event) => setPagesMin(event.target.value)}
              className="mt-1 w-full p-1 border rounded"
            />
          </label>
          <label>
            تا
            <input
              value={pagesMax}
              onChange={(event) => setPagesMax(event.target.value)}
              className="mt-1 w-full p-1 border rounded"
            />
          </label>
        </div>

        <label className="block text-xs mt-3">
          مرتب‌سازی
          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | "newest"
                  | "oldest"
                  | "pages-asc"
                  | "pages-desc",
              )
            }
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="pages-asc">صفحات (کم-&gt;زیاد)</option>
            <option value="pages-desc">صفحات (زیاد-&gt;کم)</option>
          </select>
        </label>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              setQuery("");
              setAuthor("");
              setYearMin("");
              setYearMax("");
              setPagesMin("");
              setPagesMax("");
              setSort("newest");
            }}
            className="px-3 py-1 text-sm border rounded bg-[var(--color-bread)]"
          >
            حذف فیلتر
          </button>
          <div className="text-xs text-[var(--muted-foreground)] self-center">
            نمایش {filtered.length} مورد
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="w-full h-full">
              <BookCard
                title={p.title}
                author={p.author || "-"}
                imageUrl={p.imageUrl || "/harry-potter-book.jpg"}
                url={`/books/books/${p.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

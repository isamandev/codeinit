"use client";

import React from "react";
import DraggableScroller from "@/components/DraggableScroller";
import BookCard from "@/features/books/BookCard/BookCard";
import type { Post } from "@/shared/lib/posts";

export default function BooksScroller({ books }: { books: Post[] }) {
  return (
    <DraggableScroller>
      {books.map((p) => (
        <div key={p.id} className="w-[160px] sm:w-40 lg:w-48 flex-shrink-0">
          <BookCard
            title={p.title}
            author={p.author || "-"}
            imageUrl={p.imageUrl || "/harry-potter-book.jpg"}
            url={`/books/books/${p.id}`}
          />
        </div>
      ))}
    </DraggableScroller>
  );
}

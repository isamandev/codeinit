"use client";

import useSWR from "swr";

type Book = {
  id: string;
  title: string;
  author?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export function useBooks() {
  const { data, error, isLoading, mutate } = useSWR<Book[]>("/api/books");

  return {
    books: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

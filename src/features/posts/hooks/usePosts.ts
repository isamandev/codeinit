"use client";

import useSWR from "swr";
import type { Post } from "../types/post";

export function usePosts() {
  const { data, error, isLoading, mutate } =
    useSWR<Record<string, unknown>[]>("/api/posts");

  const posts: Post[] = (data ?? []).map((p) => ({
    id: String(p.id),
    title: String(p.title ?? ""),
    excerpt:
      (p.excerpt as string) ??
      (p.description as string) ??
      (p.aiIntro as string) ??
      undefined,
    content: (p.content as string) ?? undefined,
    publishedAt:
      (p.publishedAt as string) ??
      (p.createdAt as string) ??
      (p.published as string) ??
      undefined,
  }));

  return {
    posts,
    isLoading,
    error,
    mutate,
  };
}

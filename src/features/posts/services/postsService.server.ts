import { readArticles } from "@/shared/lib/articles";
import type { Post } from "../types/post";

export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await readArticles();
    return posts as Post[];
  } catch (err) {
    console.warn("getPosts failed", err);
    return [];
  }
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const posts = await readArticles();
    const p = posts.find((x) => x.id === id);
    return (p as Post) ?? null;
  } catch (err) {
    console.warn("getPost failed", err);
    return null;
  }
}

export const runtime = "nodejs";

import { readPosts, writePosts } from "@/shared/lib/posts";
import { readArticles } from "@/shared/lib/articles";

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
  return cleaned.length ? [...new Set(cleaned)] : undefined;
}

export async function GET() {
  // Return only article items (exclude entries that represent books)
  const posts = await readArticles();
  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.title) {
      return new Response(JSON.stringify({ error: "title is required" }), {
        status: 400,
      });
    }

    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      title: String(body.title),
      author: body.author ? String(body.author) : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      description: body.description ? String(body.description) : undefined,
      aiIntro: body.aiIntro ? String(body.aiIntro) : undefined,
      published: body.published ? String(body.published) : undefined,
      pages: body.pages ? Number(body.pages) : undefined,
      tags: toStringArray(body.tags),
      categories: toStringArray(body.categories),
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost);
    await writePosts(posts);

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

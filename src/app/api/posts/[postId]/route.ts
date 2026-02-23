export const runtime = "nodejs";

import { readPosts, writePosts } from "@/shared/lib/posts";
import { readArticles } from "@/shared/lib/articles";

type Params = { params: { postId: string } };

export async function GET(_request: Request, { params }: Params) {
  const id = params.postId;
  // Only consider article items for public GET detail
  const posts = await readArticles();
  const post = posts.find((p) => p.id === id);
  if (!post)
    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
    });
  return new Response(JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = params.postId;
    const body = await request.json();
    const posts = await readPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1)
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
      });

    const updated = { ...posts[idx], ...body };
    posts[idx] = updated;
    await writePosts(posts);
    return new Response(JSON.stringify(updated), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const id = params.postId;
  const posts = await readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1)
    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
    });
  posts.splice(idx, 1);
  await writePosts(posts);
  return new Response(null, { status: 204 });
}

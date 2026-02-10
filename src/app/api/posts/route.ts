export const runtime = "nodejs";

import { readPosts, writePosts } from "@/lib/posts";

export async function GET() {
  const posts = await readPosts();
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
      published: body.published ? String(body.published) : undefined,
      pages: body.pages ? Number(body.pages) : undefined,
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost);
    await writePosts(posts);

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: String(err?.message ?? err) }),
      { status: 500 },
    );
  }
}

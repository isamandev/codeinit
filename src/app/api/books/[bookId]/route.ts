export const runtime = "nodejs";

import { readBooks, writeBooks } from "@/shared/lib/books";
import type { Post } from "@/shared/lib/posts";

export async function GET(
  request: Request,
  { params }: { params: { bookId: string } },
) {
  const { bookId } = params;
  const posts = await readBooks();
  const found = posts.find((p) => String(p.id) === String(bookId));
  if (!found) return new Response(null, { status: 404 });
  return new Response(JSON.stringify(found), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { bookId: string } },
) {
  try {
    const { bookId } = params;
    const body = await request.json();
    const posts = await readBooks();
    const idx = posts.findIndex((p) => String(p.id) === String(bookId));
    if (idx === -1) return new Response(null, { status: 404 });

    const updated = {
      ...posts[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    posts[idx] = updated as Post;
    await writeBooks(posts);
    return new Response(JSON.stringify(updated), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { bookId: string } },
) {
  const { bookId } = params;
  const posts = await readBooks();
  const idx = posts.findIndex((p) => String(p.id) === String(bookId));
  if (idx === -1) return new Response(null, { status: 404 });
  posts.splice(idx, 1);
  await writeBooks(posts);
  return new Response(null, { status: 204 });
}

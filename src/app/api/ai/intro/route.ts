import { readPosts } from "@/shared/lib/posts";
import fs from "node:fs";
import path from "node:path";

function readStore() {
  try {
    const file = path.join(process.cwd(), "data", "ai-intros.json");
    if (!fs.existsSync(file)) return {};
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const store = readStore();

    // If id provided, try to return that entry
    if (id) {
      const posts = await readPosts();
      const book = posts.find((p) => p.id === id);
      if (book?.aiIntro) {
        return new Response(
          JSON.stringify({
            text: book.aiIntro,
            tags: book.tags || [],
            categories: book.categories || [],
            updatedAt: book.createdAt,
            id,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const entry = store[id];
      if (entry)
        return new Response(
          JSON.stringify({
            text: entry.text,
            tags: entry.tags || [],
            categories: entry.categories || [],
            updatedAt: entry.updatedAt,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback: return the most recently-updated intro if any exist
    const keys = Object.keys(store || {});
    if (keys.length === 0)
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    let latestKey: string | null = null;
    let latestDate = 0;
    for (const k of keys) {
      const e = store[k];
      const t = e && e.updatedAt ? Date.parse(e.updatedAt) : 0;
      if (t > latestDate) {
        latestDate = t;
        latestKey = k;
      }
    }
    if (latestKey) {
      const e = store[latestKey];
      return new Response(
        JSON.stringify({
          text: e.text,
          tags: e.tags || [],
          categories: e.categories || [],
          updatedAt: e.updatedAt,
          id: latestKey,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

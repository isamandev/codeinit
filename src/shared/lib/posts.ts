import fs from "fs/promises";
import path from "path";

export type Post = {
  id: string;
  title: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  aiIntro?: string;
  published?: string;
  pages?: number;
  publisher?: string;
  isbn?: string;
  price?: number | string;
  tags?: string[];
  categories?: string[];
  createdAt: string;
};

const dbPath = path.join(process.cwd(), "src", "data", "posts.json");

async function readPosts(): Promise<Post[]> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: unknown }).code === "ENOENT"
    )
      return [];
    throw err;
  }
}

async function writePosts(posts: Post[]) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(posts, null, 2), "utf-8");
}

export { readPosts, writePosts };

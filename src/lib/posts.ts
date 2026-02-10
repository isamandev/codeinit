import fs from "fs/promises";
import path from "path";

export type Post = {
  id: string;
  title: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  published?: string;
  pages?: number;
  createdAt: string;
};

const dbPath = path.join(process.cwd(), "src", "data", "posts.json");

async function readPosts(): Promise<Post[]> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch (err: any) {
    if (err?.code === "ENOENT") return [];
    throw err;
  }
}

async function writePosts(posts: Post[]) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(posts, null, 2), "utf-8");
}

export { readPosts, writePosts };

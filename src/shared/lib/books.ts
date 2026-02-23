import fs from "fs/promises";
import path from "path";
import type { Post as SharedPost } from "./posts";

const dbPath = path.join(process.cwd(), "src", "data", "books.json");

export async function readBooks(): Promise<SharedPost[]> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return (JSON.parse(raw) as SharedPost[]) || [];
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

export async function writeBooks(posts: SharedPost[]) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(posts, null, 2), "utf-8");
}

export default readBooks;

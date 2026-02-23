import fs from "fs/promises";
import path from "path";
import type { Post as SharedPost } from "./posts";

const dbPath = path.join(process.cwd(), "src", "data", "posts.json");

export async function readArticles(): Promise<SharedPost[]> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    const all = (JSON.parse(raw) as SharedPost[]) || [];
    return all.filter((p) => typeof p.pages !== "number");
  } catch (err: unknown) {
    // If file doesn't exist, return empty array
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: unknown }).code === "ENOENT"
    )
      return [];
    throw err;
  }
}

export default readArticles;

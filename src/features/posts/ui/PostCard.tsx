import React from "react";
import Link from "next/link";
import type { Post } from "../types/post";
import { toJalali } from "@/shared/lib/date";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block">
      <article className="border rounded p-4 mb-4 hover:shadow">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        {post.excerpt && (
          <p className="text-sm text-gray-600">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <time className="text-xs text-gray-400">
            {toJalali(post.publishedAt)}
          </time>
        )}
      </article>
    </Link>
  );
}

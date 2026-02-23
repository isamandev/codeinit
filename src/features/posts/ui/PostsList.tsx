"use client";

import React from "react";
import { usePosts } from "../hooks/usePosts";
import { PostCard } from "./PostCard";

export default function PostsList() {
  const { posts, isLoading, error } = usePosts();

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری پست‌ها</div>;

  return (
    <section>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}

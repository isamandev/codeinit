"use client";

import PostForm from "@/features/posts/PostForm";

export default function Page() {
  return <PostForm redirectAfter="/dashboard/posts" />;
}

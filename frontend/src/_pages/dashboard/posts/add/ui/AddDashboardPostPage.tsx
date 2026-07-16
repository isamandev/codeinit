"use client";

import { PostForm } from "@/features/post-management";

export default function AddDashboardPostPage() {
  return <PostForm redirectAfter="/dashboard/posts" />;
}

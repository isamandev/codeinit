import React from "react";
import { PostsList } from "@/widgets/posts-list";

export const metadata = { title: "Posts" };

export default async function PostsPage() {
  return (
    <main className="container mx-auto p-4">
      <PostsList />
    </main>
  );
}

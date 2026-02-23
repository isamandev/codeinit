import React from "react";
import { PostsList } from "@features/posts";

export const metadata = { title: "Posts" };

export default async function Page() {
  return (
    <main className="container mx-auto p-4">
      <PostsList />
    </main>
  );
}

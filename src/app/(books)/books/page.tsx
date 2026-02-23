import BookCard from "@/features/books/BookCard/BookCard";
import type { Post } from "@/shared/lib/posts";

const page = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/books`,
  );
  const posts: Post[] = res.ok ? await res.json() : [];
  const sorted = posts
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {sorted.map((p: Post) => (
        <BookCard
          key={p.id}
          title={p.title}
          author={p.author || "-"}
          imageUrl={p.imageUrl || "/harry-potter-book.jpg"}
          url={`/books/books/${p.id}`}
        />
      ))}
    </section>
  );
};

export default page;

import BookCard from "../../../components/BookCard/BookCard";
import { readPosts } from "@/lib/posts";

const page = async () => {
  const posts = await readPosts();

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {posts.map((p) => (
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

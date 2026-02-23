import BookDetail from "@/features/books/BookDetail/BookDetail";

type Params = {
  params: { bookId: string };
};

const page = ({ params }: Params) => {
  const { bookId } = params;

  // In a real app you'd fetch the book by id. For now use placeholder data.
  const book = {
    id: bookId,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J. K. Rowling",
    imageUrl: "/harry-potter-book.jpg",
    description:
      "داستان جادوگری کودکانی که وارد دنیای جادویی می‌شوند. این یک متن نمونه برای معرفی کتاب است.",
    published: "1997",
    pages: 223,
  };

  return (
    <main>
      <BookDetail
        id={book.id}
        title={book.title}
        author={book.author}
        imageUrl={book.imageUrl}
        description={book.description}
        published={book.published}
        pages={book.pages}
      />
    </main>
  );
};

export default page;

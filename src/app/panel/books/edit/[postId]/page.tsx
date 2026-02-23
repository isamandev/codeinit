import BookEditForm from "@/features/admin/BookEditForm";

type Props = { params: { postId: string } };

export default async function Page({ params }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/books/${params.postId}`,
  );
  if (!res.ok) {
    return (
      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-xl font-semibold">کتاب پیدا نشد</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          کتابی با این شناسه وجود ندارد.
        </p>
      </main>
    );
  }

  const post = await res.json();
  if (!post) {
    return (
      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-xl font-semibold">کتاب پیدا نشد</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          کتابی با این شناسه وجود ندارد.
        </p>
      </main>
    );
  }

  return <BookEditForm initialData={post} redirectAfter="/panel/books" />;
}

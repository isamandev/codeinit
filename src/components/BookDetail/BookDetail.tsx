import Image from "next/image";
import Button from "../ui/Button/Button";

type BookDetailProps = {
  title: string;
  author: string;
  imageUrl: string;
  description?: string;
  published?: string;
  pages?: number;
};

export default function BookDetail({
  title,
  author,
  imageUrl,
  description,
  published,
  pages,
}: BookDetailProps) {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-gray-100 border border-gray-200">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <h1 className="book-title text-3xl font-bold">{title}</h1>
          <p className="book-author text-lg font-medium">نویسنده: {author}</p>

          <div className="flex gap-3">
            <Button type="primary">خرید</Button>
            <Button type="secondary">افزودن به علاقه‌مندی‌ها</Button>
          </div>

          <div className="mt-4 text-gray-700 leading-relaxed">
            {description ? (
              <p>{description}</p>
            ) : (
              <p>توضیحاتی برای این کتاب در دسترس نیست.</p>
            )}
          </div>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            {published && <div>انتشار: {published}</div>}
            {pages && <div>تعداد صفحات: {pages}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

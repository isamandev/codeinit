import Image from "next/image";
import Link from "next/link";

type BookCardProps = {
  title: string;
  author: string;
  imageUrl: string;
  url: string;
};

function BookCard({ title, author, imageUrl, url }: BookCardProps) {
  return (
    <Link
      className="block w-[160px] sm:w-40 lg:w-48 h-full flex-shrink-0"
      href={url}
    >
      <article className="flex flex-col gap-2 items-start h-full justify-between">
        <div className="relative mx-0 w-full aspect-[2/3] rounded-sm shadow-sm overflow-hidden book-cover">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-0 h-[3.5rem]">
          <h2 className="book-title text-xs sm:text-sm font-semibold line-clamp-2">
            {title}
          </h2>
          <p className="book-author text-[11px] sm:text-xs font-medium">
            {author}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default BookCard;

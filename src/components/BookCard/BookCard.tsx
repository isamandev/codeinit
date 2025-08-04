import Image from "next/image";
import Link from "next/link";

type BookCardProps = {
  title: string;
  author: string;
  imageUrl: string;
  url: string;
};

function BookCard({ title, author, imageUrl, url }: BookCardProps) {
  // ---
  return (
    <Link className="flex flex-col gap-5" href={url}>
      <article>
        <div className="relative w-[210px] aspect-[1/1.6] rounded-lg  shadow-md overflow-hidden bg-gray-300 border-1 border-solid border-[#697db7]">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[#495f67] text-2xl font-semibold">{title}</h2>
          <p className="text-[#b2b8bd] text-xl  font-medium">{author}</p>
        </div>
      </article>
    </Link>
  );
}

export default BookCard;

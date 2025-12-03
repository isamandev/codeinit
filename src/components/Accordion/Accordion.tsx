"use client";
import Image from "next/image";
import { useState } from "react";

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // ---
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((prev) => !prev);

  return (
    <div className="grid pb-6">
      <div
        onClick={handleClick}
        className="flex items-center justify-between cursor-pointer"
      >
        <Image
          src="/arrow-down.svg"
          alt="arrow down"
          width={18}
          height={18}
        />
        <span className="text-[#444859]">{title}</span>
      </div>
      <div
        className={`grid w-full text-right  transition-all  duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] pb-6 pt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;

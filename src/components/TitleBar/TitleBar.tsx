"use client";
import Image from "next/image";

function TitleBar({
  iconPath,
  title,
  textButton,
}: {
  iconPath: string;
  title: string;
  textButton?: string;
}) {
  return (
    <div
      dir="rtl"
      className="p-5 flex items-center justify-between w-full border-[#CBCED7] border-b"
    >
      <div className="flex items-center gap-2">
        <Image src={iconPath} alt="file" width={24} height={24} />
        <span className="text-xl font-bold text-[#444859]">
          {title}
        </span>
      </div>
      <button className="text-[#0d6efd] text-sm px-2 cursor-pointer font-medium">
        {textButton}
      </button>
    </div>
  );
}

export default TitleBar;

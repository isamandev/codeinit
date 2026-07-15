"use client";

import Link from "next/link";
import React from "react";

type Item = { href: string; label: string };

export default function Sidebar({ items }: { items: Item[] }) {
  return (
    <aside className="w-56 p-4 border rounded-md">
      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="px-3 py-2 rounded hover:bg-gray-100 rtl:text-right"
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

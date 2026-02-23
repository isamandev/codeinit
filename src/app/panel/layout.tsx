import type { Metadata } from "next";
import React from "react";
import AuthGuard from "@/features/auth/AuthGuard";
import AuthToolbar from "@/features/admin/AuthToolbar";
import { Sidebar } from "@/shared/ui";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "پنل مدیریت سایت",
};

const sidebarLinks = [
  { href: "/panel", label: "داشبورد پنل" },
  { href: "/panel/books", label: "مدیریت کتاب‌ها" },
  { href: "/panel/books/add", label: "افزودن کتاب" },
  { href: "/panel/posts", label: "مدیریت مقالات" },
  { href: "/panel/users", label: "مدیریت کاربران" },
  { href: "/panel/posts/add", label: "افزودن مقاله" },
  { href: "/panel/tools", label: "ابزارها" },
];

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthGuard role="admin" />
      <div className="grid grid-cols-[220px_1fr] gap-6">
        <Sidebar items={sidebarLinks} />
        <section>
          <AuthToolbar />
          {children}
        </section>
      </div>
    </>
  );
}

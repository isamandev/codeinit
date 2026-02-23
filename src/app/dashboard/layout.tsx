import type { Metadata } from "next";
import React from "react";
import AuthGuard from "@/features/auth/AuthGuard";
import { Sidebar } from "@/shared/ui";

export const metadata: Metadata = {
  title: "داشبورد",
  description: "پنل مدیریت",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthGuard role="user" />
      <div className="grid grid-cols-[220px_1fr] gap-6">
        <Sidebar
          items={[
            { href: "/dashboard", label: "داشبورد" },
            { href: "/dashboard/books", label: "کتاب‌ها" },
            { href: "/dashboard/books/add", label: "افزودن کتاب" },
            { href: "/dashboard/posts", label: "مقالات" },
            { href: "/dashboard/posts/add", label: "ارسال مقاله" },
          ]}
        />
        <section>{children}</section>
      </div>
    </>
  );
}

"use client";

import { useUsers } from "@/entities/user";

export default function UsersListClient() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-[var(--muted-foreground)]">
        دسترسی به فهرست کاربران امکان‌پذیر نیست.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-sm text-[var(--muted-foreground)]">
        مدیریت کاربران سیستم
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">ایمیل</th>
              <th className="px-3 py-2">نقش</th>
              <th className="px-3 py-2">تاریخ ثبت‌نام</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-3 py-2">{user.name ?? "-"}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

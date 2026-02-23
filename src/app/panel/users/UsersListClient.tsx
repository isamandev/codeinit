"use client";

import React, { useState } from "react";
import { useUsers } from "@/shared/lib/swr/useUsers";

type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export default function UsersListClient() {
  const { users, isLoading: loading, mutate } = useUsers();
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  async function handleCreate(event?: React.FormEvent) {
    event?.preventDefault();
    if (!email || !password) return alert("ایمیل و پسورد لازم است");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email,
          password,
          role: role || undefined,
        }),
      });
      if (response.ok) {
        setAddOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        await mutate();
      } else {
        const errorText = await response.text();
        alert("خطا: " + errorText);
      }
    } catch (error) {
      console.error(error);
      alert("خطا هنگام ایجاد کاربر");
    }
  }

  async function handleEdit(user: User) {
    const promptedName = prompt("نام:", user.name ?? "");
    const promptedEmail = prompt("ایمیل:", user.email ?? "");
    const promptedPassword = prompt("پسورد (خالی برای حفظ):", "");
    const promptedRole = prompt("نقش:", user.role ?? "");
    const body: any = { name: promptedName, email: promptedEmail };
    if (promptedPassword) body.password = promptedPassword;
    if (promptedRole) body.role = promptedRole;
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) await mutate();
    else {
      const errorText = await response.text();
      alert("خطا: " + errorText);
    }
  }

  async function handleDelete(user: User) {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) return;
    const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (response.ok) await mutate();
    else {
      const errorText = await response.text();
      alert("خطا: " + errorText);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-[var(--muted-foreground)]">
          مدیریت کاربران سیستم
        </div>
        <div>
          <button
            onClick={() => setAddOpen(true)}
            className="px-3 py-1 rounded bg-[var(--color-scarlet-rose)] text-white text-sm"
          >
            اضافه کردن
          </button>
        </div>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-[var(--background)] p-4 rounded shadow max-w-md w-full"
          >
            <h3 className="text-lg font-medium mb-3">کاربر جدید</h3>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-xs">نام (اختیاری)</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="px-2 py-1 border rounded"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-xs">ایمیل</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="px-2 py-1 border rounded"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-xs">پسورد</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="px-2 py-1 border rounded"
              />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-xs">نقش</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">-- انتخاب کنید --</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="user">user</option>
              </select>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="px-3 py-1 border rounded"
              >
                لغو
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[var(--color-scarlet-rose)] text-white"
              >
                ایجاد
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">نام</th>
                <th className="px-3 py-2">ایمیل</th>
                <th className="px-3 py-2">نقش</th>
                <th className="px-3 py-2">اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-3 py-2">{user.name ?? "-"}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.role ?? "کاربر"}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="ml-2 text-sm px-2 py-1 border rounded"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-sm px-2 py-1 border rounded"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

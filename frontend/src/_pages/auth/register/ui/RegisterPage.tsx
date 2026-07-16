"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("نام کاربری و رمز لازم است");
      return;
    }
    if (password !== confirm) {
      setError("رمز و تکرار آن مطابقت ندارند");
      return;
    }
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email: username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "خطا در ثبت‌نام");
        return;
      }
      // server sets HttpOnly cookie; redirect to dashboard
      router.replace("/dashboard");
    } catch (error) {
      console.warn("register error", error);
      setError("خطا در ثبت‌نام");
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">ثبت‌نام</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">نام کاربری</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">گذرواژه</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">تکرار گذرواژه</span>
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded">
            ثبت‌نام
          </button>
        </div>
      </form>
    </main>
  );
}

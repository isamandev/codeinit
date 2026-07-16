"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "نام کاربری یا رمز اشتباه است");
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (data?.role === "admin") router.replace("/panel/books");
      else router.replace("/dashboard");
    } catch (error) {
      console.warn("login error", error);
      setError("خطا در ورود");
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">ورود</h1>
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

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">
            ورود
          </button>
        </div>
      </form>
    </main>
  );
}

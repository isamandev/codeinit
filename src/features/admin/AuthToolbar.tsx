"use client";

import { useRouter } from "next/navigation";

export default function AuthToolbar() {
  const router = useRouter();

  function handleLogout() {
    try {
      fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        router.replace("/");
      });
    } catch (error) {
      console.warn("remove admin-auth failed", error);
      router.replace("/");
    }
  }

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={handleLogout}
        className="px-3 py-1 border rounded text-sm"
      >
        خروج از ادمین
      </button>
    </div>
  );
}

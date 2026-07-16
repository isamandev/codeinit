"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/entities/user";

export default function AuthToolbar() {
  const router = useRouter();
  const { mutate } = useAuth();

  function handleLogout() {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .catch((error) => console.warn("logout failed", error))
      .finally(() => {
        void mutate(null, false);
        router.replace("/");
      });
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

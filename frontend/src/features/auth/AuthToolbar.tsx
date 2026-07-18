"use client";

import { useRouter } from "next/navigation";
import { useSession, clearStoredSession } from "@/entities/user";

export default function AuthToolbar() {
  const router = useRouter();
  const { mutate } = useSession();

  function handleLogout() {
    clearStoredSession();
    void mutate(null, false);
    router.replace("/");
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

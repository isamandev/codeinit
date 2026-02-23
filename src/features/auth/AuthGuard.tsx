"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/lib/swr/useAuth";

interface AuthGuardProps {
  /**
   * The role required to access this area.
   * - "user"  → any authenticated user; admins are redirected to /panel
   * - "admin" → admin only; non-admins are redirected to /dashboard
   */
  role?: "user" | "admin";
}

export default function AuthGuard({ role = "user" }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading, error } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (error || !user?.email) {
      router.replace("/auth/login");
      return;
    }

    if (role === "admin" && user.role !== "admin") {
      router.replace("/dashboard");
    } else if (role === "user" && user.role === "admin") {
      router.replace("/panel");
    }
  }, [user, isLoading, error, router, role]);

  return null;
}

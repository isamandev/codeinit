"use client";

import useSWR from "swr";

type Me = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
} | null;

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<Me>("/api/auth/me", {
    shouldRetryOnError: false,
    onErrorRetry: () => {},
  });

  return {
    user: error ? null : (data ?? null),
    isLoading,
    error,
    mutate,
  };
}

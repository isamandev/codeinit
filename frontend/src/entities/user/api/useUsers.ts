"use client";

import useSWR from "swr";

type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("/api/users");

  return {
    users: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

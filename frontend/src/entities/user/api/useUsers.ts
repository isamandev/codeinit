"use client";

import useSWR from "swr";
import { getUsers } from "./usersApi";
import { getStoredSession } from "../model/session";
import type { User } from "../model/user";

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    "users-list",
    () => {
      const stored = getStoredSession();
      if (!stored) throw new Error("Not authenticated");
      return getUsers(stored.token);
    },
    { shouldRetryOnError: false },
  );

  return {
    users: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

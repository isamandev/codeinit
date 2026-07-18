"use client";

import useSWR from "swr";
import { getMe, AuthApiError } from "./authApi";
import {
  getStoredSession,
  clearStoredSession,
  type Session,
} from "../model/session";

async function fetchSession(): Promise<Session | null> {
  const stored = getStoredSession();
  if (!stored) return null;

  try {
    const user = await getMe(stored.token);
    return { token: stored.token, user };
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      clearStoredSession();
      return null;
    }
    throw error;
  }
}

export function useSession() {
  const stored = getStoredSession();
  const { data, error, isLoading, mutate } = useSWR<Session | null>(
    "auth-session",
    fetchSession,
    { fallbackData: stored, shouldRetryOnError: false },
  );

  return {
    user: error ? null : (data?.user ?? null),
    isLoading,
    error,
    mutate,
  };
}

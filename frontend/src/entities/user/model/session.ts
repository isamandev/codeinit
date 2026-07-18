import type { User } from "./user";

export type Session = {
  token: string;
  user: User;
};

const SESSION_STORAGE_KEY = "authSession";

export function getStoredSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setStoredSession(session: Session): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

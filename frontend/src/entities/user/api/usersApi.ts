import type { User } from "../model/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const body = (await response.json()) as { success: boolean; data: User[] };
  return body.data;
}

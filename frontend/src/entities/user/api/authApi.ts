import type { Session } from "../model/session";
import type { User } from "../model/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class AuthApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type BackendEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function parseAuthResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as BackendEnvelope<T> & {
    message?: string;
  };

  if (!response.ok) {
    throw new AuthApiError(
      response.status,
      body.message ?? `Request failed with status ${response.status}`,
    );
  }

  return body.data;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await parseAuthResponse<User & { token: string }>(response);
  const { token, ...user } = data;
  return { token, user };
}

export async function signIn(
  email: string,
  password: string,
): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseAuthResponse<Session>(response);
}

export async function getMe(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseAuthResponse<User>(response);
}

import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  passwordEnv?: string;
  role?: string;
  createdAt: string;
};

const dbPath = path.join(process.cwd(), "src", "data", "users.json");

export async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    const parsed = (JSON.parse(raw) as User[]) || [];
    // Resolve passwords from environment variables when `passwordEnv` is provided.
    return parsed.map((u) => {
      if (u.passwordEnv) {
        return { ...u, password: process.env[u.passwordEnv] ?? "" } as User;
      }
      return u;
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: unknown }).code === "ENOENT"
    )
      return [];
    throw err;
  }
}

export async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2), "utf-8");
}

export function safeUser(u: User) {
  const { password, ...rest } = u as User;
  return rest;
}

export async function getUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email === email);
}

export async function getUserById(id: string) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(data: {
  name?: string;
  email: string;
  password: string;
  role?: string;
}) {
  const users = await readUsers();
  const exists = users.find((u) => u.email === data.email);
  if (exists) throw new Error("email already exists");
  const hash = await bcrypt.hash(data.password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: hash,
    role: data.role,
    createdAt: new Date().toISOString(),
  };
  users.unshift(newUser);
  await writeUsers(users);
  return newUser;
}

export async function updateUser(id: string, patch: Partial<User>) {
  const users = await readUsers();
  let updated: User | undefined;
  const next = users.map((u) => {
    if (u.id !== id) return u;
    updated = { ...u, ...patch } as User;
    return updated;
  });
  if (!updated) throw new Error("user not found");
  await writeUsers(next);
  return updated!;
}

export async function deleteUser(id: string) {
  const users = await readUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) throw new Error("user not found");
  await writeUsers(next);
}

export default readUsers;

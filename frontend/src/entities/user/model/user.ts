export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  passwordEnv?: string;
  role?: string;
  createdAt: string;
};

export function safeUser(u: User) {
  const { password, ...rest } = u as User;
  return rest;
}

export type Role = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  createdAt: string;
};

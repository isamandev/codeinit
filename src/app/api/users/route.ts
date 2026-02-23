export const runtime = "nodejs";

import type { User } from "@/shared/lib/users";
import { readUsers, createUser, safeUser } from "@/shared/lib/users";
import { signAuthToken } from "@/shared/lib/auth";

export async function GET() {
  const users = await readUsers();
  return new Response(JSON.stringify(users.map(safeUser)), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.email || !body?.password) {
      return new Response(
        JSON.stringify({ error: "email and password required" }),
        {
          status: 400,
        },
      );
    }

    const user = await createUser({
      name: body.name ? String(body.name) : undefined,
      email: String(body.email),
      password: String(body.password),
      role: body.role ? String(body.role) : undefined,
    });

    // Sign token and set HttpOnly cookie to auto-login after registration
    const token = signAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookie = `token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${secure};`;

    return new Response(JSON.stringify(safeUser(user as User)), {
      status: 201,
      headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

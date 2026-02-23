export const runtime = "nodejs";

import { getUserByEmail, safeUser } from "@/shared/lib/users";
import { signAuthToken } from "@/shared/lib/auth";
import bcrypt from "bcryptjs";

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

    const user = await getUserByEmail(String(body.email));
    if (!user) {
      return new Response(JSON.stringify({ error: "invalid credentials" }), {
        status: 401,
      });
    }

    const supplied = String(body.password);
    let ok = false;
    try {
      // If stored password looks like a bcrypt hash, compare with bcrypt.
      if (typeof user.password === "string" && user.password.startsWith("$2")) {
        ok = await bcrypt.compare(supplied, user.password);
      } else {
        // Fallback for plaintext-stored passwords (backwards compatibility)
        ok = user.password === supplied;
      }
    } catch (e) {
      ok = false;
    }

    if (!ok) {
      return new Response(JSON.stringify({ error: "invalid credentials" }), {
        status: 401,
      });
    }

    const token = signAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HttpOnly, Secure cookie so client JS cannot access token
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookie = `token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${secure};`;

    return new Response(JSON.stringify(safeUser(user)), {
      headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

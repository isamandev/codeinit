export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifyAuthToken } from "@/shared/lib/auth";
import { getUserById, safeUser } from "@/shared/lib/users";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return new Response(JSON.stringify({}), { status: 204 });

    const payload = verifyAuthToken(token);
    if (!payload) return new Response(JSON.stringify({}), { status: 204 });

    const user = await getUserById(payload.id);
    if (!user) return new Response(JSON.stringify({}), { status: 204 });

    return new Response(JSON.stringify(safeUser(user)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({}), { status: 204 });
  }
}

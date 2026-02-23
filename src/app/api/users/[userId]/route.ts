export const runtime = "nodejs";

import {
  getUserById,
  safeUser,
  updateUser,
  deleteUser,
} from "@/shared/lib/users";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const user = await getUserById(params.userId);
    if (!user)
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
      });
    return new Response(JSON.stringify(safeUser(user)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const body = await request.json();
    const patch: any = {};
    if (body.name) patch.name = String(body.name);
    if (body.email) patch.email = String(body.email);
    if (body.password) patch.password = String(body.password);
    if (body.role) patch.role = String(body.role);

    const updated = await updateUser(params.userId, patch);
    return new Response(JSON.stringify(safeUser(updated)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    await deleteUser(params.userId);
    return new Response(null, { status: 204 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

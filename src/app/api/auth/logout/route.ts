export const runtime = "nodejs";

export async function POST() {
  // Clear the cookie by setting Max-Age=0
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookie = `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${secure};`;
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}

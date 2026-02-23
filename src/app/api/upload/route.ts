export const runtime = "nodejs";

import fs from "fs/promises";
import path from "path";

type UploadBody = {
  filename: string;
  data: string; // data URL or base64
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UploadBody;
    if (!body?.filename || !body?.data) {
      return new Response(
        JSON.stringify({ error: "filename and data required" }),
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = path
      .basename(body.filename)
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    let base64 = body.data;
    const match = base64.match(/^data:(.+);base64,(.+)$/);
    if (match) base64 = match[2];

    const buffer = Buffer.from(base64, "base64");
    const outPath = path.join(uploadsDir, fileName);
    await fs.writeFile(outPath, buffer);

    const url = `/uploads/${fileName}`;
    return new Response(JSON.stringify({ url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

import { readPosts, writePosts } from "@/shared/lib/posts";
import fs from "node:fs/promises";
import path from "node:path";

type ReqBody = {
  id?: string;
  title?: string;
  author?: string;
  description?: string;
  isbn?: string;
};

type IntroStoreEntry = {
  text: string;
  tags?: string[];
  categories?: string[];
  updatedAt: string;
};

function toStringArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  if (!cleaned.length) return undefined;
  return [...new Set(cleaned)].slice(0, maxItems);
}

async function readIntroStore(): Promise<Record<string, IntroStoreEntry>> {
  try {
    const filePath = path.join(process.cwd(), "data", "ai-intros.json");
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw || "{}") as Record<string, IntroStoreEntry>;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      return {};
    }
    return {};
  }
}

async function writeIntroStore(data: Record<string, IntroStoreEntry>) {
  const filePath = path.join(process.cwd(), "data", "ai-intros.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

class OpenRouterError extends Error {
  status?: number;
  detail?: string;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
    this.detail = detail;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function generateWithOpenRouter(
  prompt: string,
  model = "gpt-oss-120b:free",
) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not configured");

  const baseUrl =
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body = {
    model,
    messages: [
      {
        role: "system",
        content:
          "شما یک مولد محتوای حرفه‌ای برای کتاب هستید. خروجی باید دقیقاً یک شیء JSON معتبر باشد با کلیدهای `intro` (متن معرفی فارسی، کوتاه و جذاب)، `tags` (آرایه‌ای از 4 تا 8 تگ کوتاه مرتبط با کتاب) و `categories` (آرایه‌ای از 1 تا 3 دسته‌بندی اصلی مرتبط). هیچ متن اضافی یا markdown خارج از JSON چاپ نکنید.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "codeinit",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error: unknown) {
    const detail = getErrorMessage(error);
    throw new OpenRouterError("OpenRouter request failed", 502, detail);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new OpenRouterError(
      `OpenRouter error ${resp.status}`,
      resp.status,
      txt || `Request failed with status ${resp.status}`,
    );
  }

  const json = await resp.json();
  // typical response: { choices: [ { message: { content: "..." } } ] }
  const content =
    json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text ?? null;
  if (!content) throw new Error("OpenRouter returned no content");
  return content;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;
    const prompt = `برای کتاب زیر خروجی JSON تولید کن:\n- عنوان: ${body.title || "نامشخص"}\n- نویسنده: ${body.author || "نامشخص"}\n- شابک: ${body.isbn || "نامشخص"}\n- توضیح اولیه: ${body.description || "ندارد"}\n\nقواعد:\n1) intro یک معرفی فارسی کوتاه و حرفه‌ای باشد.\n2) tags فقط آرایه‌ای از تگ‌های مرتبط، کوتاه و کاربردی باشد.\n3) categories فقط آرایه‌ای از دسته‌بندی‌های اصلی و عمومی مرتبط با کتاب باشد.\n4) خروجی دقیقاً JSON معتبر با کلیدهای intro,tags,categories باشد.`;

    let content: string;
    try {
      content = await generateWithOpenRouter(prompt, "gpt-oss-120b:free");
    } catch (e: unknown) {
      const detail =
        e instanceof OpenRouterError
          ? e.detail || e.message
          : getErrorMessage(e);
      const status =
        e instanceof OpenRouterError && typeof e.status === "number"
          ? e.status
          : 502;
      console.error("[api/ai/generate] OpenRouter call failed", {
        status,
        detail,
      });
      return new Response(
        JSON.stringify({
          error: "OpenRouter generation failed",
          detail,
        }),
        { status, headers: { "Content-Type": "application/json" } },
      );
    }

    // try to parse JSON result (model is instructed to return JSON)
    let parsed: {
      intro?: string;
      tags?: unknown;
      categories?: unknown;
    } | null = null;
    try {
      parsed = JSON.parse(content) as {
        intro?: string;
        tags?: unknown;
        categories?: unknown;
      };
    } catch (e) {
      // second attempt: some models wrap JSON in markdown or code fences, try to extract JSON substring
      const match = content.match(/\{[\s\S]*\}/m);
      if (match) {
        try {
          parsed = JSON.parse(match[0]) as {
            intro?: string;
            tags?: unknown;
            categories?: unknown;
          };
        } catch (err) {
          console.warn("Failed to parse JSON from model content", err);
        }
      }
      void e;
    }

    if (!parsed || typeof parsed.intro !== "string") {
      return new Response(
        JSON.stringify({
          error:
            "Model did not return valid JSON with required intro/tags/categories fields",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const text = parsed.intro;
    const tags = toStringArray(parsed.tags, 8) ?? [];
    const categories = toStringArray(parsed.categories, 3) ?? [];
    const updatedAt = new Date().toISOString();

    if (body.id) {
      const posts = await readPosts();
      const postIndex = posts.findIndex((p) => p.id === body.id);
      if (postIndex !== -1) {
        posts[postIndex] = {
          ...posts[postIndex],
          aiIntro: text,
          tags,
          categories,
        };
        await writePosts(posts);
      }

      const store = await readIntroStore();
      store[body.id] = {
        text,
        tags,
        categories,
        updatedAt,
      };
      await writeIntroStore(store);
    }

    return new Response(
      JSON.stringify({
        text,
        tags,
        categories,
        id: body.id || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

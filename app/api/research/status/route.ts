import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { available: Boolean((env.GEMINI_API_KEY || env.OPENAI_API_KEY) && env.DB) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

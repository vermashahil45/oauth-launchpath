import { env } from "cloudflare:workers";
import { guides } from "@/lib/guides";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
 const seed = guides.find(g => g.id === id);
 if (seed) return Response.json(seed, { headers });
 if (!/^[a-f0-9-]{36}$/.test(id)) return Response.json({ error: "Guide not found." }, { status: 404, headers });
 if (!env.DB) return Response.json({ error: "Guide storage unavailable." }, { status: 503, headers });
 const row = await env.DB.prepare("SELECT content FROM oauth_guides WHERE id = ?").bind(id).first<{ content: string }>();
 return row ? Response.json(JSON.parse(row.content), { headers }) : Response.json({ error: "This guide could not be found. Return to the library or investigate the app again." }, { status: 404, headers });
}

import { env } from "cloudflare:workers";
import { z } from "zod";
import { investigate } from "@/lib/research";
export const dynamic = "force-dynamic";
const inputSchema = z.object({ provider: z.string().trim().min(2).max(200), scenario: z.string().trim().min(8).max(1200), distribution: z.enum(["Public external integration", "Internal organization only", "Personal prototype / limited testing"]) });
const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
 if (request.headers.get("origin") !== new URL(request.url).origin) return fail("Research requests must originate from this site.", 403);
 if (!request.headers.get("content-type")?.includes("application/json")) return fail("Send a JSON request.", 415);
 const raw = await request.text();
 if (raw.length > 6000) return fail("Request is too large.", 413);
 let input: z.infer<typeof inputSchema>;
 try { input = inputSchema.parse(JSON.parse(raw)); } catch { return fail("Enter an app name, a use case of at least eight characters, and a supported audience.", 400); }
 if (!env.OPENAI_API_KEY) return fail("Live research is not configured yet. The site owner must add OPENAI_API_KEY as a server-side secret. The three researched library guides are available now.", 503);
 if (!env.DB) return fail("Guide storage is not available. Ask the site owner to check the database binding.", 503);
 const db = env.DB;
 // Atomic, global daily quota persists across worker instances. No IP/user data stored.
 const day = new Date().toISOString().slice(0, 10);
 const limit = await db.prepare("INSERT INTO research_limits (key, count) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 30 RETURNING count").bind(day).first();
 if (!limit) return fail("This demo's daily research allowance has been used. Please return tomorrow (UTC reset).", 429);
 const abort = new AbortController();
 const timeout = setTimeout(() => abort.abort(), 180000);
 request.signal.addEventListener("abort", () => abort.abort(), { once: true });
 const encoder = new TextEncoder();
 const stream = new ReadableStream({
  async start(controller) {
   let active = true;
   const send = (event: object) => { if (active) { try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); } catch { active = false; abort.abort(); } } };
   const heartbeat = setInterval(() => { if (active) { try { controller.enqueue(encoder.encode(": heartbeat\n\n")); } catch { active = false; abort.abort(); } } }, 15000);
   try {
    const guide = await investigate(input, { key: env.OPENAI_API_KEY!, model: env.OPENAI_MODEL || "gpt-5.4" }, message => send({ type: "progress", message }), abort.signal);
    await db.prepare("INSERT INTO oauth_guides (id, content, created_at) VALUES (?, ?, ?)").bind(guide.id, JSON.stringify(guide), new Date().toISOString()).run();
    send({ type: "done", guide });
   } catch (e) {
    send({ type: "error", message: abort.signal.aborted ? "Research timed out or was cancelled. No completed guide is available; try a more specific provider website." : e instanceof Error ? e.message : "Research failed. Please retry." });
   } finally { clearTimeout(timeout); clearInterval(heartbeat); if (active) controller.close(); }
  },
  cancel() { abort.abort(); clearTimeout(timeout); },
 });
 return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

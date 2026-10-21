import { z } from "zod";
const text = z.string().min(1).max(2000);
const url = z.string().url().refine(v => {
  const u = new URL(v);
  return u.protocol === "https:" && !u.username && !u.password && u.hostname.includes(".") && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(u.hostname) && !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(u.hostname) && !u.hostname.includes(":");
});
export const guideSchema = z.object({
  name: text, website: url, tagline: text, scenario: text,
  difficulty: z.enum(["Low", "Moderate", "High", "Unknown"]), effort: text, wait: text, verdict: text,
  next: z.object({ title: text, detail: text, url }),
  scopes: z.array(z.object({ name: text, reason: text, source: text })).max(12),
  prerequisites: z.array(text).max(15),
  steps: z.array(z.object({ title: text, detail: text, owner: z.enum(["You", "Agent", "Provider"]), source: text })).min(1).max(16),
  blockers: z.array(z.object({ title: text, fix: text, source: text })).max(12),
  agentCan: z.array(text).max(10), humanMust: z.array(text).max(10), unknowns: z.array(text).max(12),
  sources: z.array(z.object({ id: text, title: text, url, supports: text })).min(1).max(20),
  attempt: text, correction: text,
});
export type GuideContent = z.infer<typeof guideSchema>;
export type Guide = GuideContent & { id: string; checkedAt: string; kind: "curated" | "generated"; searchCount?: number };
export function validateReferences(g: GuideContent) {
  const ids = new Set(g.sources.map(s => s.id));
  if (ids.size !== g.sources.length) throw new Error("Duplicate evidence IDs");
  for (const c of [...g.scopes, ...g.steps, ...g.blockers]) if (!ids.has(c.source)) throw new Error("Missing claim evidence");
  return g;
}

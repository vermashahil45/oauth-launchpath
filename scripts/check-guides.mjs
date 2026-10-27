import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
const temp = await mkdtemp(path.join(tmpdir(), "launchpath-check-"));
try {
 const entry = path.resolve("work/check-entry.ts");
 await import("node:fs/promises").then(fs => fs.mkdir("work", { recursive: true }));
 await writeFile(entry, `export { guides } from "../lib/guides"; export { guideSchema, validateReferences } from "../lib/guide"; export { collectSources, enforceEvidence, normalizedUrl, investigate } from "../lib/research";`);
 const output = path.join(temp, "check.mjs");
 await build({ entryPoints: [entry], outfile: output, bundle: true, platform: "node", format: "esm" });
 const { guides, guideSchema, validateReferences, collectSources, enforceEvidence, normalizedUrl, investigate } = await import(pathToFileURL(output).href);
 for (const g of guides) { guideSchema.parse(g); validateReferences(g); assert.ok(g.steps.length >= 4); assert.ok(g.effort.includes("estimate")); assert.ok(g.attempt.includes("No ") || /no (registration|project)/i.test(g.attempt) || g.attempt.includes("no registration")); }
 assert.equal(new Set(guides.map(g => g.id)).size, 3);
 const { readFile } = await import("node:fs/promises");
 const starter = JSON.parse(await readFile("public/starters/slack-socket-mode.json", "utf8"));
 assert.deepEqual(starter.oauth_config.scopes.bot, ["app_mentions:read", "chat:write"]);
 assert.deepEqual(starter.settings.event_subscriptions.bot_events, ["app_mention"]);
 assert.equal(starter.settings.socket_mode_enabled, true);
 assert.ok(!JSON.stringify(starter).includes("xox"));
 const base = guideSchema.parse(guides[0]);
 assert.throws(() => validateReferences({ ...base, steps: [{ ...base.steps[0], source: "invented" }] }), /Missing claim/);
 assert.throws(() => guideSchema.parse({ ...base, website: "javascript:alert(1)" }));
 assert.throws(() => guideSchema.parse({ ...base, website: "https://127.0.0.1/private" }));
 assert.throws(() => enforceEvidence(base, ["https://example.org/not-a-source"]), /outside/);
 assert.throws(() => enforceEvidence({ ...base, next: { ...base.next, url: "https://example.org/unresearched" } }, base.sources.map(s => s.url)), /next-step/);
 assert.equal(normalizedUrl("https://example.com/docs/?utm_source=test#part"), "https://example.com/docs");
 const evidence = { status: "completed", output: [{ type: "web_search_call", action: { sources: [{ url: base.sources[0].url }] } }, { type: "message", content: [{ type: "output_text", text: "Research", annotations: [{ type: "url_citation", url: base.sources[1].url }] }] }] };
 assert.equal(collectSources(evidence).length, 2);
 const originalFetch = globalThis.fetch;
 const progress = [];
 let calls = 0;
 try {
  globalThis.fetch = async (_url, options) => {
   const request = JSON.parse(options.body);
   assert.equal(request.store, false);
   calls++;
   if (calls === 1) { assert.equal(request.tools[0].type, "web_search"); return Response.json({ status: "completed", output: [{ type: "web_search_call", action: { sources: [...base.sources.map(s => ({ url: s.url })), { url: base.next.url }] } }, { type: "message", content: [{ type: "output_text", text: "Official research" }] }] }); }
   assert.equal(request.text.format.type, "json_schema");
   return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ ...base, attempt: "Model falsely claims a real setup test." }) }] }] });
  };
  const generated = await investigate({ provider: "Example", scenario: "Read public profile", distribution: "Public external integration" }, { key: "test-placeholder", model: "test-model" }, m => progress.push(m));
  assert.equal(calls, 2); assert.equal(generated.kind, "generated"); assert.ok(generated.attempt.startsWith("Public documentation research only")); assert.equal(progress.length, 3); assert.match(generated.id, /^[a-f0-9-]{36}$/);
  let geminiCalls = 0;
  globalThis.fetch = async (url, options) => {
   geminiCalls++;
   if (String(url).includes("api.tavily.com/search")) {
    assert.equal(options.headers.Authorization, "Bearer search-placeholder");
    const results = [...base.sources.map(s => ({ title: "Official source", url: s.url, content: "Official OAuth documentation" })), { title: "Registration", url: base.next.url, content: "Open the developer console" }];
    return Response.json({ results });
   }
   assert.ok(String(url).includes("gemini-3.5-flash-lite:generateContent"));
   assert.equal(options.headers["x-goog-api-key"], "model-placeholder");
   const request = JSON.parse(options.body);
   assert.equal(request.generationConfig.responseMimeType, "application/json");
   assert.ok(!request.tools, "free model call must not request paid search grounding");
   return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify({ ...base, attempt: "Model falsely claims a real setup test." }) }] } }] });
  };
  const geminiGuide = await investigate({ provider: "Example", scenario: "Read public profile", distribution: "Public external integration" }, { provider: "gemini", key: "model-placeholder", searchKey: "search-placeholder", model: "gemini-3.5-flash-lite" }, () => {});
  assert.equal(geminiCalls, 2); assert.equal(geminiGuide.kind, "generated"); assert.ok(geminiGuide.attempt.startsWith("Public documentation research only"));
  globalThis.fetch = async () => Response.json({ error: { message: "secret raw diagnostic" } }, { status: 401 });
  await assert.rejects(() => investigate({provider:"Example",scenario:"Public profile",distribution:"Public external integration"},{key:"test-placeholder",model:"test"},()=>{}), e => !e.message.includes("secret raw diagnostic") && e.message.includes("credential"));
 } finally { globalThis.fetch = originalFetch; }
 console.log("PASS: 3 curated guide contracts, evidence references, URL rejection, citation membership, mocked OpenAI and Tavily+Gemini research, false setup-claim override, and sanitized provider errors.");
 console.log("This is deterministic validation; no live model call or provider OAuth flow was tested.");
} finally { await rm(temp, { recursive: true, force: true }); }

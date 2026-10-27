# Launchpath

An OAuth setup navigator for agent builders: know the work, the wait, and your next action.

- **Working preview:** https://oauth-launchpath.shahilsunny2104.chatgpt.site
- **Source:** https://github.com/vermashahil45/oauth-launchpath

Both links are public and can be opened without signing in. Public access verified on 22 October 2026.

![Launchpath guide library](docs/screenshots/library-desktop.png)

## What works

Three researched guides cover GitHub public-profile access, Gmail restricted mailbox access, and Slack development/pilot/Marketplace distribution. Search and filter the library; follow a device-local checklist; inspect blockers, sources, uncertainty and agent/human handoffs; share a stable URL or export Markdown.

The Slack guide includes a downloadable development manifest and a [setup walkthrough](docs/slack-development.md). It distinguishes Socket Mode prototyping from a Marketplace-compatible release. The draft was checked locally, not installed or validated by Slack.

The live-generation implementation accepts an app name or website, use case and audience. It searches the web, compiles a structured guide, validates source references and returned source/action URLs, and saves a D1 record with a shareable URL. Progress reflects actual server stages. It supports OpenAI Responses or a no-cost path using Tavily Search and Gemini structured output.

**No-cost demo option:** configure `GEMINI_API_KEY` from Google AI Studio and `TAVILY_API_KEY` from Tavily's free Researcher plan. Tavily lists 1,000 search credits per month with no card required; basic search costs one credit. Gemini 3.5 Flash-Lite lists free text input/output. The app uses Tavily for research and Gemini for structured guide generation, so it does not call Google's paid Search grounding tool. Quotas and account access can still change or block a request. Google says free-tier prompts may be used to improve its products. Do not submit confidential use cases. **Local live guide generation was verified**; the hosted public site still needs its server-side keys configured and redeployed.

## Setup

Requires Node.js 22.13+ (24 recommended), npm and network access.

```bash
npm ci
npm run db:local
cp .env.example .dev.vars
# Add your API credential to the ignored .dev.vars file in your editor.
npm run dev
```

PowerShell: use `Copy-Item .env.example .dev.vars`. Open the printed local URL, normally port 5173.

```bash
npm run check
npm run typecheck
npm run build
```

For a no-cost local test, create a key in [Google AI Studio](https://aistudio.google.com/app/apikey) and a Tavily key on its [free plan](https://app.tavily.com/home). Add `GEMINI_API_KEY=...` and `TAVILY_API_KEY=...` to the ignored `.dev.vars` file. `GEMINI_MODEL` defaults to `gemini-3.5-flash-lite`. Choose only the free plan and do not enable paid billing. Tavily documents 1,000 free credits per month without a credit card; each basic search uses one credit. Check Google's current model/quota terms before use; free-tier prompts may be used to improve its products. If both Gemini and Tavily are configured, that path takes priority over OpenAI. Alternatively set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` (default `gpt-5.4`); OpenAI API usage may require credit. For a deployed demo, add both Gemini and Tavily keys as server secrets in Sites and redeploy. Never commit credentials.

Uses the supplied Sites Vinext/React starter and Cloudflare D1. `.openai/hosting.json` declares `DB`; Sites applies the versioned Drizzle migrations during deployment. Local and hosted databases are separate.

## Key decisions

- **Specific scenarios:** difficulty depends on permissions, audience and distribution, not just the provider name.
- **Work versus waiting:** hands-on estimates are labeled; external timing is sourced or unknown.
- **Evidence in the workflow:** documentation, observed public entry points, estimates and untested steps are explicit.
- **Bounded agent:** research and preparation are automated. Authentication, domain proof, credential handling and review submissions belong to a human.
- **A focused slice:** three contrasting guides and an extensible schema demonstrate the eventual 100-app library without shallow filler.

## Verification and limits

TypeScript, the production build, local migration, deterministic research checks and desktop/mobile browser checks passed. Hosted checks passed for the page, seeded API, database-backed lookup, origin protection and missing-secret response. A local Tavily+Gemini generation for Notion saved and reopened successfully; its sources and corrections are recorded in [full results](docs/verification-results.md). Hosted model-backed generation is not yet configured.

No provider registration, consent, token exchange or approval was completed. Public console entry attempts and corrected assumptions are recorded in [validation notes](docs/validation.md). Hands-on durations are estimates, not measurements.

Generated guides are AI research drafts. Citation membership does not prove claim accuracy, full-page reading or source authority. The prompt prefers official sources; there is no universal provider-domain allowlist. Research has a three-minute timeout and a global allowance of 30 attempts per UTC day, including failures. There is no background queue, autonomous registration or freshness scheduler.

Generated records are visible to people with site access. Do not submit confidential use cases. Checklists stay on the device; current-session generated cards reset on reload while saved guide URLs persist.

## Review the implementation

- `lib/guides.ts`: curated guidance and sources.
- `lib/guide.ts`: runtime guide contract.
- `lib/research.ts`: research instructions, compilation and evidence checks.
- `app/api/research/route.ts`: validation, quota, streaming and persistence.
- `components/launchpath.tsx`: library, guide and research interface.
- [Demo walkthrough](docs/demo.md).

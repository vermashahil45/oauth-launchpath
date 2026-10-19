# Launchpath

An OAuth setup navigator for agent builders: understand the work, external wait, blockers and next action before committing to an integration.

**Demo:** https://oauth-launchpath.shahilsunny2104.chatgpt.site (private preview; access must be granted before an external review).

**Source:** https://github.com/vermashahil45/oauth-launchpath (private repository).

![Launchpath guide library](docs/screenshots/library-desktop.png)

## Working slice

- Three source-backed guides: GitHub public-profile OAuth, Gmail mailbox-reading with a restricted scope, and Slack development/pilot/Marketplace distribution.
- Search, complexity filters, setup checklists, least-privilege scopes, blocker help, evidence and explicit agent/human handoffs.
- Copyable guide URLs and Markdown export. Checklists stay on the current browser; shared guides do not share completion state.
- Live investigation of a provider name or website, qualified by the intended use case and audience.
- Two-stage server research: web-search agent → structured guide → schema/reference/source-membership validation → durable D1 record.
- Streaming progress reports actual server stages; errors do not substitute a canned guide.

Live investigation requires a funded OpenAI API credential with access to the configured model and web search. If absent, the endpoint returns an explicit configuration error; library guides remain usable. See `docs/verification-results.md` for what has actually been tested.

## Local setup

Requires Node.js **22.13+** (Node 24 recommended), npm and network access.

```bash
npm ci
npm run db:local
cp .env.example .dev.vars
# Put your OPENAI_API_KEY in the ignored .dev.vars file using your editor.
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .dev.vars`. Open the URL printed by the dev server (normally http://localhost:5173). `.dev.vars` is ignored by Git. Never place a model key in client code, the hosting manifest or the repository.

```bash
npm run check
npm run typecheck
npm run build
```

## Deployment and storage

The project uses the supplied Sites Vinext/React starter and Cloudflare D1. Keep the Sites worker integration. `.openai/hosting.json` declares `DB`; Drizzle migrations are versioned under `drizzle/`. Sites provisions hosted D1 and applies migrations during deployment. Local preview needs the separate local migration command above.

Configure `OPENAI_API_KEY` as a **secret runtime variable** in Sites settings; optionally set `OPENAI_MODEL` (default `gpt-5.4`). Deploy a saved version after changing runtime variables. No provider OAuth credentials are needed to read or generate guides.

The initial preview is private. Copied URLs work for visitors who have site access. Grant reviewer access or choose the appropriate public audience before submitting the demo. Generated records contain the supplied use case, so do not enter confidential project information. Markdown export is portable without site access.

## Key decisions

1. **Scenario before provider difficulty.** Public-profile access, mailbox-wide reading and a mention-response bot have very different permissions. Guides state their assumptions and audience.
2. **Work and waiting are separate.** Developer effort is labeled as an estimate. External timing is attributed or unknown. No fabricated approval score or deadline.
3. **Evidence is visible in the workflow.** Sources support steps and blockers. Documentation research, observable entry-point attempts, estimates and unknowns are distinguished. No OAuth connection is claimed from reading documentation.
4. **A guide is a reusable artifact.** Stable URLs use stored records, not machine-local state or a temporary chat response. Markdown export makes the result easy to share.
5. **A bounded agent.** The research agent can investigate public sources and draft instructions. Humans authenticate, prove ownership, authorize access, manage credentials and submit reviews. The app does not request those credentials.
6. **Three contrasting providers over shallow breadth.** The schema can support a 100-app catalog, but the take-home demonstrates three researched paths and unfamiliar-provider generation.

## Important limitations

- No provider registration, token exchange or approval submission was completed. Public setup entry points were attempted, and the exact limits are shown in each guide.
- A generated guide is an AI research draft. Source membership checks prevent invented citation URLs outside returned evidence; they do not prove claims are accurate, that a page was read in full, or that a source is authoritative. The prompt prefers official sources; no universal provider-domain allowlist is assumed.
- Live generation depends on API configuration, credit, model access, search availability and provider documentation. Incomplete/invalid research is rejected. Model/web-search costs are borne by the configured API account.
- Demo allowance is 30 research attempts globally per UTC day, including failed attempts. The atomic database counter prevents trivial multi-instance quota bypass. It is not a per-user billing/rate-limit system.
- No authenticated provider-browser automation, secret vault, autonomous registrations, background queue or source-freshness scheduler. Research timeout is three minutes. Closing the dialog cancels the client request; already spent API work is not refunded.
- The library is a curated snapshot dated 19 October 2026. Generated guides are not automatically added to the global curated catalog. Their stable links persist, while the current-session generated cards reset on reload.
- No claim of completed live generation until `docs/verification-results.md` records it. Mock pipeline tests do not establish a live model or successful provider connection.

## Files worth reviewing

| File | Purpose |
| --- | --- |
| `lib/guides.ts` | Curated scenarios, steps, blockers and evidence |
| `lib/guide.ts` | Runtime guide contract and evidence-reference validation |
| `lib/research.ts` | Research instructions, source collection and structured compilation |
| `app/api/research/route.ts` | Input/origin checks, quota, streaming and persistence |
| `app/api/guides/[id]/route.ts` | Reopening stored guide URLs |
| `docs/validation.md` | Source checks, corrections and setup-attempt limits |
| `docs/demo.md` | Five-minute walkthrough |

The starter includes framework infrastructure and example components; app-specific work is in the files above and `components/launchpath.tsx` / `app/globals.css`.

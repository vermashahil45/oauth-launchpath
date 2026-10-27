# Verification results

Checked 19 October 2026 on Windows with Node.js 24.18.0.

| Check | Result |
| --- | --- |
| Curated guide schemas and evidence references | Passed for all three guides |
| Invalid/unsafe URLs and fabricated citation/action links | Rejected by deterministic checks |
| Two-stage research, setup-test claim override and sanitized provider errors | Passed with mocked model responses; not a live generation |
| TypeScript | Passed (`node node_modules/typescript/bin/tsc --noEmit`) |
| Local D1 migration | Passed: `oauth_guides` and `research_limits` |
| Local HTTP page | 200 |
| Browser search, filters and empty state | Passed |
| Guide navigation and direct seeded URLs | Passed |
| Delayed saved-guide response versus new navigation | Passed with a deliberately delayed HTTP fixture |
| Checklist persistence across reload | Passed |
| Blocker expansion and evidence tab | Passed |
| Markdown export includes scopes, next action and blockers | Passed |
| Share feedback and missing-guide errors | Passed |
| Live generation without server secret | Correctly returned a visible configuration error; no canned result |
| Desktop (1440px) and mobile (390px) layouts | Screenshots inspected; no horizontal overflow in tested library/guide views |
| Browser page errors | None during the tested paths |
| Production build | Passed: all five Vinext/Vite build stages completed; both API routes emitted |
| Hosted deployment | Succeeded: https://oauth-launchpath.shahilsunny2104.chatgpt.site (private) |
| Hosted page, seeded API, D1 missing-record lookup, origin protection and missing-secret response | Passed: HTTP 200 / 200 / 404 / 403 / 503 respectively |
| Live model + web research + save + reopen | **Not tested: OPENAI_API_KEY is not configured** |
| Real provider OAuth connection or approval | **Not performed** |

Browser checks ran with the bundled Playwright installation and pre-existing Chrome in headless mode. The browser test script is `scripts/browser-check.mjs`; supply `PLAYWRIGHT_MODULE` when Playwright is outside the project, `BROWSER_EXECUTABLE_PATH` for an existing browser, and optionally `QA_BASE_URL`. `QA_EXPECT_UNCONFIGURED=1` checks the missing-secret error without spending model credit.

The delayed-response fixture tested navigation behavior only; it was not stored or presented as a real generated guide. Deterministic model fixtures did not reach OpenAI or any OAuth provider.

## Revision checked — 21 October 2026

- Replaced promotional copy and decorative hero artwork with direct setup language and registration/connection/release checks. Agent-generated drafts remain labeled.
- TypeScript, deterministic research checks, production build and desktop/mobile browser checks passed again.
- The browser suite checked the research-configuration status, the disabled action when configuration is missing, direct endpoint rejection, and the downloadable Slack manifest.
- Slack starter JSON passed local syntax, bot-scope and event checks. This is not Slack provider validation or a successful workspace installation.
- No model key is present in this project's local configuration or hosted environment. The unfamiliar-provider live generation check remains blocked on that account setup.

## Remaining acceptance checks

1. Configure a valid model secret, then generate an unfamiliar provider guide in the deployed app.
2. Inspect its primary sources and unknowns; reopen the saved URL from a separate session with site access.
3. Confirm the desired reviewer audience for both private links before submission.

The central unfamiliar-provider live demo is not claimed complete until those model-backed checks pass.

## No-cost provider path — 27 October 2026

- Added support for Tavily Search (research) plus Gemini structured output (guide compilation), using `TAVILY_API_KEY` and `GEMINI_API_KEY`. The default Gemini model is `gemini-3.5-flash-lite`; this path does not invoke Google's paid Search grounding feature.
- A first Gemini Search-grounding probe returned 404 because `gemini-2.5-flash-lite` is unavailable to new users. No guide was generated or saved in that probe.
- Google currently lists Gemini 3.5 Flash-Lite text input/output on its free tier. Tavily lists 1,000 free credits per month without a card; basic searches consume one credit. Provider eligibility, free quotas and limits can still change. Google's free-tier prompts may be used to improve its products.
- The Tavily+Gemini path is implemented but has not yet been live-tested. The deployed site needs both keys stored as server-side secrets before reviewers can use it.

## Public access checked — 22 October 2026

The owner approved making the site and repository public. Anonymous HTTP checks returned 200 for the website, Slack manifest, repository page and GitHub repository API. The unauthenticated GitHub response confirmed private=false. Reviewer access is complete. Live model-backed generation remains unverified until the model credential is configured.

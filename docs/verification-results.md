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

## No-cost Gemini option — 27 October 2026

- Added a Gemini `generateContent` path using Google Search grounding for research and JSON response schemas for guide compilation. It uses `gemini-2.5-flash-lite` by default and prefers `GEMINI_API_KEY` when set.
- The local OpenAI credential authenticated and the configured model was listed, but the Notion live-generation attempt returned HTTP 429; no guide was saved. No credential value was displayed or committed.
- The Gemini path is implemented but has not been live-tested. Google's current pricing docs list free input/output and up to 500 daily grounded requests for Gemini 2.5 Flash-Lite, while its model docs warn access to 2.5 models may be limited to users who previously used them. Account eligibility, regional availability and quotas may block a free test. Free-tier prompts may be used to improve Google's products.
- The deployed site still requires a server-side `GEMINI_API_KEY` secret to demonstrate live generation publicly.

## Public access checked — 22 October 2026

The owner approved making the site and repository public. Anonymous HTTP checks returned 200 for the website, Slack manifest, repository page and GitHub repository API. The unauthenticated GitHub response confirmed private=false. Reviewer access is complete. Live model-backed generation remains unverified until the model credential is configured.

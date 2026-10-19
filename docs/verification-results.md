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
| Hosted deployment | In progress; result will be recorded before handoff |
| Live model + web research + save + reopen | **Not tested: OPENAI_API_KEY is not configured** |
| Real provider OAuth connection or approval | **Not performed** |

Browser checks ran with the bundled Playwright installation and pre-existing Chrome in headless mode. The browser test script is `scripts/browser-check.mjs`; supply `PLAYWRIGHT_MODULE` when Playwright is outside the project, `BROWSER_EXECUTABLE_PATH` for an existing browser, and optionally `QA_BASE_URL`. `QA_EXPECT_UNCONFIGURED=1` checks the missing-secret error without spending model credit.

The delayed-response fixture tested navigation behavior only; it was not stored or presented as a real generated guide. Deterministic model fixtures did not reach OpenAI or any OAuth provider.

## Remaining acceptance checks

1. Configure a valid model secret, then generate an unfamiliar provider guide in the deployed app.
2. Inspect its primary sources and unknowns; reopen the saved URL from a separate session with site access.
3. Confirm the desired reviewer audience for both private links before submission.

The central unfamiliar-provider live demo is not claimed complete until those model-backed checks pass.

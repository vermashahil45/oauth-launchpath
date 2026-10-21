# Evidence and validation record

Research date: 19 October 2026. Claims describe this snapshot, not permanent provider policy.

Two research agents investigated Gmail and GitHub/Slack in parallel. The implementation agent independently reopened the GitHub registration documentation, Gmail scope table and Slack review process to check the highest-impact claims. Official links are also embedded in every guide.

| Sample | Source check | Finding / correction |
| --- | --- | --- |
| GitHub registration | https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app | Current docs allow ten callbacks and describe expiring tokens enabled by default; avoid the stale single-callback/nonexpiring-token recipe. |
| GitHub private repositories | https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps | `repo` is broad. Do not sell it as read-only private-repository access; assess GitHub Apps. |
| Gmail read-only scope | https://developers.google.com/workspace/gmail/api/auth/scopes | `gmail.readonly` is restricted; read-only does not mean a light approval path. |
| Google public launch | https://developers.google.com/identity/protocols/oauth2/production-readiness/overview | Audience, publication and verification are different. A testing success or Published state does not establish unrestricted launch readiness. |
| Slack submission | https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/ | Ten active workspaces are a prerequisite. Current published timing is up to 10 business days preliminary feedback plus functional review up to 10 weeks for new apps. These are provider estimates, not a guarantee. |
| Slack agent suitability | https://docs.slack.dev/slack-marketplace/slack-marketplace-app-guidelines-and-requirements/ | MCP-only without meaningful in-Slack functionality is a suitability issue. Public pilot distribution and Marketplace readiness must be separated. |

## Practical setup attempts

- Google Auth Platform: public open redirected to Google sign-in. Authenticated console, project/client creation and consent were not observed.
- Slack dashboard: public page required sign-in to create an application. No app was created or installed.
- GitHub registration portal: the research tool could not retrieve it. This is a tool limitation, not evidence that the console was tested or that a login gate was observed.

No provider credentials were created. No user consent, token exchange, API connection or approval submission completed. The product says this explicitly. Hands-on durations are product estimates, not measurements. Approval timing is attributed to a source or left unknown.

## Application verification

`node scripts/check-guides.mjs` checks seeded content contracts, evidence-reference integrity, unsafe URLs, generated-citation membership, the two-stage research pipeline under mocked responses, forced disclosure that no setup happened, and provider-error sanitization. Mock results do not establish live research.

TypeScript, production build, database migration, browser behavior and hosted checks are recorded in `docs/verification-results.md` after they run. Live model generation requires a valid server-side API credential and is separately identified there.

## Additional setup preparation — 21 October 2026

A research agent prepared a minimal Slack mention-response manifest from the official [manifest reference](https://docs.slack.dev/reference/app-manifest/) and [Socket Mode documentation](https://docs.slack.dev/apis/events-api/using-socket-mode/). Local JSON/permission/event checks passed. The draft is downloadable from the Slack guide. It was not submitted to Slack's manifest validator, registered, installed, or used in a real mention-response test. The documentation exposed an important constraint: Socket Mode apps cannot currently be listed in Slack Marketplace. The draft is explicitly a development option; the public-release path requires HTTP event delivery.

## Limits of the evidence gate

Source membership proves the URL was returned by the research tool. It does not prove a page was read in full or that every claim is true. A generated guide remains an AI research draft. The prompt prefers official sources; it is not a universal provider-domain allowlist. Human verification is required before relying on high-impact review claims.

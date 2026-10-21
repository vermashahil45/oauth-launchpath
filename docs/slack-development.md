# Slack development starter

The downloadable manifest is a **single development-workspace prototype**, not the public-release configuration. It uses Socket Mode so a local runtime can receive events without a public HTTP event endpoint. Socket Mode apps cannot currently be listed in the public Slack Marketplace; switch to HTTP event delivery and complete the distribution path before that submission.

1. Download `public/starters/slack-socket-mode.json`.
2. In [Slack app settings](https://api.slack.com/apps), choose **Create New App → From a manifest**, select your development workspace, and paste the JSON. Review the provider's configuration before creating it.
3. Generate a separate app-level token with `connections:write` under Basic Information → App-Level Tokens. It is not a bot OAuth scope and is deliberately absent from the manifest's bot permissions.
4. Install the app into the workspace. Keep the bot token and app-level token private and separate.
5. Configure a Bolt runtime with `socketMode: true`, the bot token, and the app-level token as `appToken`. Handle `app_mention` events and reply with `say()`.
6. Invite the bot to a channel and mention it. Confirm event receipt and a reply. This subscription does not cover direct messages.

## What was checked

On 21 October 2026, a research agent checked the draft against official manifest and Socket Mode documentation. Local checks parse the JSON and check the intended permission/event fields. **The manifest was not submitted to Slack's validator. No registration, token generation, workspace installation, or mention-response test was completed.**

- [Manifest reference](https://docs.slack.dev/reference/app-manifest/)
- [Socket Mode requirements and Marketplace restriction](https://docs.slack.dev/apis/events-api/using-socket-mode/)
- [App-level connections:write](https://docs.slack.dev/reference/scopes/connections.write/)
- [Bolt Socket Mode configuration](https://docs.slack.dev/tools/bolt-js/concepts/socket-mode)
- [app_mention event behavior](https://docs.slack.dev/reference/events/app_mention/)

Do not substitute this development draft for the multi-workspace OAuth and public-distribution steps in the main guide. Event transport and OAuth installation are separate concerns.

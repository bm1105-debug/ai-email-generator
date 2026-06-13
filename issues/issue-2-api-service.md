# Issue #2 — Extract API service with token limits and temperature control

## What to build

The Groq API fetch call is currently embedded inside `generateEmail`. Extract it into a standalone `callGroqAPI(messages, maxTokens)` function. Add `max_tokens` based on the selected length and fix `temperature` at 0.7 for consistent output quality.

Token limits by length:
- Concise → 200 tokens
- Standard → 500 tokens
- Detailed → 900 tokens

The function should throw typed errors (not generic ones) so the caller can display specific messages. This is the foundation for Issue #3 (Error Handler) and Issue #4 (Conversation Manager).

## Acceptance criteria

- [ ] `callGroqAPI(messages, maxTokens)` is a standalone function separate from `generateEmail`
- [ ] `temperature: 0.7` is included in every API request
- [ ] `max_tokens` is set based on the selected length — 200 / 500 / 900
- [ ] The function throws errors with a `status` property (e.g. 401, 429, 500) so callers can identify the type
- [ ] `generateEmail` calls `callGroqAPI` and behaviour is unchanged from the user's perspective
- [ ] Concise emails are noticeably shorter than Detailed emails in practice

## Blocked by

None — can start immediately.

# Issue #3 — Specific error messages by HTTP status code

## What to build

Currently all API failures show the same generic error message. Map HTTP status codes from the API response to specific, actionable user-facing messages so the recruiter knows exactly what went wrong and what to do next.

Error message map:
- 401 → "Invalid API key — check your config.js"
- 429 → "Rate limit reached — wait a few seconds and try again"
- 500 → "Groq server error — try again shortly"
- Network failure → "No internet connection — check your network"
- Unknown → "Something went wrong — please try again"

## Acceptance criteria

- [ ] A `getErrorMessage(status)` function maps status codes to user-facing strings
- [ ] 401 errors show the invalid API key message
- [ ] 429 errors show the rate limit message
- [ ] 500 errors show the server error message
- [ ] Network failures (fetch throws, no response) show the no internet message
- [ ] Any other status shows the fallback unknown error message
- [ ] Error messages are displayed in the error div, not as a browser alert

## Blocked by

Issue #2 — API Service (needs typed errors with a `status` property).

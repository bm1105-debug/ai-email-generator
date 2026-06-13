# PRD: AI-Powered Email Generator — Improvements

## Problem Statement

Recruiters at BSS send dozens of emails daily to candidates, clients, and internal teams. The current email generator tool produces emails but has several friction points that reduce its usefulness in a real recruiter's workflow:

- The generated output is displayed as raw text with no visual separation between the subject line and the email body, making it hard to quickly copy the right part into Gmail or Outlook.
- The refinement feature sends a completely new prompt without the previous email as context, so the AI generates a fresh email rather than truly refining the existing one.
- All API errors display the same generic message, leaving the recruiter with no actionable guidance when something goes wrong.
- There is no email history — if a recruiter generates a good email and accidentally clicks Generate again, the previous output is lost.
- The layout breaks on smaller screens, limiting use on laptops and tablets.
- The Generate button can be clicked multiple times while a request is in-flight, triggering duplicate API calls.

## Solution

Improve the existing browser-based email generator with a set of targeted enhancements that make it feel like a professional recruiter tool rather than a demo. The improvements focus on output display, refinement quality, error handling, usability, and API behaviour — without changing the core form structure or prompt architecture.

## User Stories

1. As a recruiter, I want the subject line and email body displayed in separate sections, so that I can copy each part independently into my email client.
2. As a recruiter, I want a dedicated Copy button for the subject line, so that I can paste it into the Subject field in Gmail without selecting text manually.
3. As a recruiter, I want a dedicated Copy button for the email body, so that I can paste it into the email body field without including the subject line.
4. As a recruiter, I want the refinement feature to improve the existing email rather than generate a new one, so that my refinement instructions are applied precisely.
5. As a recruiter, I want to see a loading spinner while the email is being generated, so that I have clear visual feedback that the tool is working.
6. As a recruiter, I want the Generate button to be disabled while a request is in progress, so that I cannot accidentally trigger duplicate API calls.
7. As a recruiter, I want to see a specific error message when my API key is invalid, so that I know exactly what to fix.
8. As a recruiter, I want to see a specific error message when the rate limit is hit, so that I know to wait before trying again.
9. As a recruiter, I want to see a specific error message when there is no internet connection, so that I am not confused by a generic failure.
10. As a recruiter, I want to see a word count on the generated email, so that I can gauge email length at a glance.
11. As a recruiter, I want to browse my last 5 generated emails, so that I can recover a good version I accidentally overwrote.
12. As a recruiter, I want to download the generated email as a .txt file, so that I can save it locally without copying manually.
13. As a recruiter, I want the tool to work on my laptop screen without the layout breaking, so that I can use it in any working environment.
14. As a recruiter, I want to see a tooltip description when I hover over a tone option, so that I understand what each tone means without guessing.
15. As a recruiter, I want the Concise length to enforce a shorter response from the AI, so that the output is actually short and not just labelled as such.
16. As a recruiter, I want the Detailed length to produce a longer, structured response, so that I get a proper multi-paragraph email when I need one.
17. As a recruiter, I want the key points textarea to show a character count, so that I know how much information I have provided.
18. As a recruiter, I want the Generate button to re-enable automatically after a request completes or fails, so that I can try again without refreshing the page.
19. As a recruiter, I want previously generated emails in history to be clickable, so that I can restore an older version to the output panel.
20. As a recruiter, I want the email history to persist across page refreshes, so that I do not lose my session if the browser is closed accidentally.

## Implementation Decisions

### Module 1 — Output Parser
Parse the API response and split it into a subject line and an email body based on the `Subject:` and `Email:` markers defined in the system prompt output format. Display each part in its own labelled box with its own Copy button. This replaces the current single `output-box` div.

### Module 2 — API Service
Extract the `fetch` call out of `generateEmail` into a standalone `callGroqAPI(messages, maxTokens)` function. This function accepts a messages array and a token limit, and returns the response text. It throws typed errors (InvalidKeyError, RateLimitError, NetworkError) so the caller can display specific messages.

Token limits by length:
- Concise → 200 tokens
- Standard → 500 tokens
- Detailed → 900 tokens

Temperature: fixed at `0.7` for consistent, professional output.

### Module 3 — Conversation Manager
Maintain a `conversationHistory` array in memory that stores the last assistant response. When `isRefine = true`, include the previous assistant message in the messages array sent to the API:

```
[system, user (original prompt), assistant (previous email), user (refinement prompt)]
```

This ensures the AI refines the actual previous output rather than generating a fresh email. Reset `conversationHistory` when the user clicks Generate (not Regenerate).

### Module 4 — Error Handler
Map HTTP status codes from the API response to specific user-facing messages:
- 401 → "Invalid API key — check your config.js"
- 429 → "Rate limit reached — wait a few seconds and try again"
- 500 → "Groq server error — try again shortly"
- Network failure → "No internet connection — check your network"
- Unknown → "Something went wrong — please try again"

### Module 5 — Email History
Use `localStorage` to persist the last 5 generated emails. Each entry stores the subject, body, timestamp, and form inputs used. Display history entries in a collapsible panel below the output card. Clicking an entry restores it to the output panel.

### Module 6 — UI Enhancements
- Replace the "Generating email..." text with a CSS spinner animation
- Disable the Generate and Regenerate buttons during API calls, re-enable on completion or error
- Add `media query` at 768px to stack the two-column grid into a single column
- Add `title` attributes to tone `<option>` elements as hover tooltips
- Show word count below the output box after generation

## Testing Decisions

Since this is a browser-based vanilla JS tool with no test framework currently configured, tests should focus on the pure logic functions that can be tested in isolation without a browser or API:

**What makes a good test here:**
- Test the output of a function given a specific input — do not test DOM manipulation or API calls directly
- Test edge cases: empty strings, malformed API responses, missing fields

**Modules to test:**

1. **Output Parser** — given a raw API response string, assert that the subject and body are correctly extracted. Test cases: normal response, missing `Email:` label, missing `Subject:` label, extra whitespace.

2. **Error Handler** — given a status code, assert that the correct user-facing message string is returned. All five error cases should be covered.

3. **Conversation Manager** — given a history array and a new message, assert that the messages array passed to the API is correctly structured for both normal generation and refinement.

4. **Token limit selector** — given a length string ("Concise", "Standard", "Detailed"), assert that the correct `maxTokens` value is returned.

## Out of Scope

- User authentication or login
- Saving emails to a backend database
- Multi-language support
- Sending emails directly from the tool (Gmail/Outlook integration)
- Changing the AI provider or model
- A/B testing different system prompts
- Analytics or usage tracking

## Further Notes

- The system prompt output format (`Subject: ... Email: ...`) is load-bearing for the Output Parser module. If the prompt is changed, the parser must be updated accordingly.
- The `config.js` file must be added to `.gitignore` before the GitHub repo is shared as part of the BSS submission. The API key must never be committed.
- The BSS assignment explicitly evaluates Prompt Engineering at 25% weight. The Conversation Manager (Module 3) is the highest-impact improvement for this criterion — it directly demonstrates understanding of multi-turn LLM interactions.
- Deployment to GitHub Pages, Vercel, or Netlify is required for submission. GitHub Pages is the simplest option for a static HTML/JS tool with no build step.

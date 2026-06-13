# Issue #4 — Conversation manager: true refinement using previous email as context

## What to build

Currently the Regenerate & Refine button sends a fresh prompt with no memory of the previous email. The AI generates a new email rather than refining the existing one. Fix this by maintaining a `conversationHistory` array that stores the last assistant response and including it in the messages array when refining.

Messages array for normal generation:
```
[system, user (generation prompt)]
```

Messages array for refinement:
```
[system, user (generation prompt), assistant (previous email), user (refinement prompt)]
```

Reset `conversationHistory` when the user clicks Generate (not Regenerate).

## Acceptance criteria

- [ ] A `conversationHistory` array stores the last assistant response after each successful generation
- [ ] When Regenerate & Refine is clicked, the previous email is included as an `assistant` message in the API call
- [ ] The refinement instruction is applied to the actual previous output — not a fresh generation
- [ ] Clicking Generate (not Regenerate) resets `conversationHistory` and starts fresh
- [ ] If no previous email exists and Regenerate is clicked, it falls back to a normal generation
- [ ] The change is invisible to the user — no UI changes required

## Blocked by

Issue #2 — API Service (needs `callGroqAPI` to accept a flexible messages array).

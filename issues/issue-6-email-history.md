# Issue #6 — Email history: localStorage with restore

## What to build

When a recruiter generates a good email and accidentally clicks Generate again, the previous output is lost. Add an email history panel that stores the last 5 generated emails in `localStorage`. Each entry shows a timestamp and the email purpose. Clicking an entry restores it to the output panel.

Each history entry stores:
- Subject line
- Email body
- Timestamp
- Purpose (from the form input at time of generation)

The history panel sits below the output card and is collapsed by default.

## Acceptance criteria

- [ ] Every successful generation is saved to `localStorage` automatically
- [ ] A maximum of 5 entries are kept — oldest entry is dropped when a 6th is added
- [ ] History entries are displayed in a collapsible panel below the output card
- [ ] Each entry shows the purpose and timestamp (e.g. "Interview Scheduling — 2 mins ago")
- [ ] Clicking an entry restores the subject and body to the output panel
- [ ] History persists across page refreshes
- [ ] A "Clear History" button removes all entries from localStorage and the panel
- [ ] If localStorage is unavailable (private browsing), history silently does nothing with no crash

## Blocked by

Issue #1 — Output Parser (needs parsed subject and body to store as separate fields).

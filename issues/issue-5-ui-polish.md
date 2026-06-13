# Issue #5 — UI polish: spinner, button disable, word count, mobile layout, tone tooltips

## What to build

A set of UI improvements that make the tool feel professional and usable for a non-technical recruiter. Each improvement is small but collectively they make the difference between a demo and a real tool.

Improvements:
- Replace "Generating email..." text with a CSS spinner animation
- Disable the Generate and Regenerate buttons while a request is in flight, re-enable on completion or error
- Show a live word count below the output box after generation
- Stack the two-column layout into a single column on screens narrower than 768px
- Add descriptive `title` attributes to each tone option as hover tooltips:
  - Professional → "Warm but businesslike"
  - Friendly → "Conversational and approachable"
  - Formal → "Corporate and polished, no contractions"
  - Assertive → "Direct, confident, action-oriented"

## Acceptance criteria

- [ ] A CSS spinner replaces the plain "Generating email..." text during API calls
- [ ] Generate button is disabled (greyed out, not clickable) while a request is in progress
- [ ] Regenerate & Refine button is disabled while a request is in progress
- [ ] Both buttons re-enable automatically after the request completes or fails
- [ ] Word count is displayed below the output after generation (e.g. "142 words")
- [ ] At screen width below 768px, the two cards stack vertically instead of side by side
- [ ] Tone dropdown options show a tooltip description on hover

## Blocked by

None — can start immediately.

# ✉ AI-Powered Email Generator

A browser-based tool built for the BSS AI Automation Intern assignment. Recruiters can generate professional, ready-to-send emails from simple inputs — no technical knowledge required.

## Which API & Why

**Groq + LLaMA 3.1 (`llama-3.1-8b-instant`)**

Chosen for its free tier (no credit card), fastest inference speed among free options, and output quality sufficient for professional email generation.

## What It Does

- Generates a complete email body + subject line from user inputs
- Supports 4 tones: **Professional, Friendly, Formal, Assertive**
- Supports 3 lengths: **Concise, Standard, Detailed**
- **Regenerate & Refine** — refine the output with a short instruction (e.g. "make it shorter")
- **Quick-Start Templates** — 3 pre-built templates that auto-fill the form:
  - Interview Scheduling
  - Offer Letter Follow-up
  - Client Status Update
- **Copy to Clipboard** — one-click copy with clean paragraph formatting

## Inputs

| Field | Example |
|---|---|
| Email Purpose | Interview Scheduling |
| Recipient Name & Designation | Rahul Sharma, Senior Developer |
| Key Points | Monday interview, 11 AM, Teams link to follow |
| Tone | Professional |
| Length | Concise |

## System Prompt

The system prompt is the core of this tool. Here it is in full:

```
You are a professional email writer for a recruitment firm.
Your job is to write ready-to-send emails based on the inputs provided.

Rules:
- Always output: Subject: <subject line>, then a blank line, then the email body.
- The email must sound like a real person wrote it — not a template.
- Use the recipient's name and designation naturally.
- Incorporate ALL key points provided. Do not invent details not given.
- Match the tone exactly: Professional = warm but formal, Friendly = casual and approachable, Formal = strict and structured, Assertive = direct and confident.
- Match the length: Concise = 3-4 lines body only, Standard = 6-8 lines, Detailed = 3+ paragraphs.
- Do not add filler phrases like "I hope this email finds you well" unless the tone calls for it.
- End with an appropriate sign-off. Do not include a name — leave [Your Name].
- If a refinement instruction is provided, apply it meaningfully. The output must noticeably change.
```

## Edge Cases Handled

- Empty required fields → validation error before API call
- Vague purpose → Groq still generates a reasonable output; fallback message shown
- Refinement box empty → Regenerate works without refinement
- API failure → clear error message shown to user

## Known Limitations

- Groq free tier: 30 requests/minute — unlikely to be hit in normal use
- No login or history — emails are not saved between sessions
- API key must be set by the user (environment variable or config)

## How to Run

No install needed. Open `index.html` in any browser.

Set your Groq API key in `config.js`:
```js
const GROQ_API_KEY = "your-api-key-here"; // do not commit this
```

Or via environment variable if hosted on Vercel/Netlify.

## Live Link

[Insert deployed link here — GitHub Pages / Vercel / Netlify]

## Code Structure

```
email-generator/
├── index.html       ← single-file browser tool
├── config.js        ← API key config (not committed)
└── README.md
```

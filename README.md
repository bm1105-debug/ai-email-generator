# AI Email Generator

A browser-based tool that generates professional, ready-to-send business emails using AI. Built for recruiters, hiring managers, and business professionals who need to write clear, human-sounding emails quickly — without starting from a blank page.

---

## What Problem Does This Solve

Writing professional emails takes time, especially when you are sending multiple variations to different people with slightly different contexts. Recruiters in particular send dozens of emails daily — interview calls, offer follow-ups, client updates — and each one needs to sound personal, not copy-pasted.

This tool takes the key information you already have and turns it into a complete, ready-to-send email in seconds.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| AI Model | LLaMA 3.1 8B via Groq | Free tier, fastest inference, no credit card required |
| Frontend | Vanilla HTML, CSS, JavaScript | No framework needed — runs directly in a browser |
| Storage | Browser localStorage | No backend required for email history |
| API | Groq OpenAI-compatible endpoint | Drop-in compatible with OpenAI SDK patterns |

---

## Features

### Single Email Mode
- Fill in purpose, recipient name, key points, tone, and length
- AI generates a subject line and complete email body
- Output is parsed and displayed separately — subject in one box, body in another
- One-click copy for subject line and email body independently

### Bulk Personalization Mode
- Paste multiple recipient names (one per line)
- The same purpose and key points are used across all emails
- Each recipient gets a fully personalized, individually generated email
- Progress bar shows generation status in real time
- Results appear one by one as they complete
- Per-recipient copy button and a Download All button that exports all emails as a `.txt` file
- Failed recipients show an error without stopping the rest of the batch

### Tone Control
| Tone | Description |
|---|---|
| Professional | Businesslike and respectful |
| Friendly | Warm and approachable |
| Formal | Corporate and polished, no contractions |
| Assertive | Direct, confident, and action-oriented |

### Length Control
| Length | Output |
|---|---|
| Concise | 3-4 short sentences |
| Standard | 1-2 short paragraphs |
| Detailed | Multiple well-structured paragraphs |

### Quick-Start Templates
Three pre-built templates that auto-fill all form fields:
- Interview Scheduling
- Offer Letter Follow-up
- Client Status Update

### Refine and Regenerate
After generating an email, type a short instruction (e.g. "make it more urgent" or "shorten the opening") and click Regenerate and Refine. The tool passes the previous email as context so the AI understands what to improve — not just rewrite from scratch.

### Email History
The last 5 generated emails are saved automatically in the browser. Each entry shows the purpose and how long ago it was generated. Clicking an entry restores the subject and body to the output panel. Persists across page refreshes. Works silently in private browsing — no crash if localStorage is unavailable.

### UI Details
- Live word count after each generation
- Loading spinner during API calls
- Generate and Refine buttons disabled while a request is running
- Mobile-responsive layout — stacks to a single column on screens below 768px
- Hover tooltips on tone options explaining each tone

---

## How the AI Prompting Works

The tool uses a two-layer prompt strategy.

**Layer 1 — System Prompt (fixed behavior rules)**

Sent with every request. Defines the AI's role, writing rules, tone definitions, length definitions, and the exact output format it must follow. This is what controls the quality and consistency of every email.

Key rules enforced:
- Always output `Subject:` on the first line, then `Email:` in the next section
- Use the recipient's name exactly as provided — no shortening, no adding titles
- Never invent facts, dates, or links not provided
- No markdown formatting inside the email body
- No filler phrases like "I hope this email finds you well"

**Layer 2 — User Prompt (per-request context)**

Built dynamically from the form inputs. Contains the purpose, recipient, key points, tone, and length. For refinements, the previous email is included as assistant context so the AI can apply targeted improvements rather than starting over.

This separation — fixed rules in system prompt, variable data in user prompt — is what makes the output consistently professional without manual review.

---

## Project Structure

```
email_generator/
├── index.html       — UI structure and all HTML elements
├── style.css        — All styling, layout, and responsive rules
├── script.js        — All logic: API calls, prompt building, history, bulk mode
├── config.js        — API key (not committed to git)
└── README.md
```

---

## How to Run

No installation required. Works entirely in the browser.

**Step 1** — Get a free Groq API key at console.groq.com

**Step 2** — Create `config.js` in the project folder:
```js
const GROQ_API_KEY = "your-groq-api-key-here";
```

**Step 3** — Open `index.html` in any browser

That is it. No server, no build step, no dependencies.

---

## Limitations

- API key is stored in `config.js` on the client side — safe for personal use, not suitable for public deployment without a backend proxy
- Groq free tier allows 30 requests per minute — sufficient for normal use, bulk mode with many recipients may approach this
- Email history is per-browser — not synced across devices
- No direct email sending — output is copy-paste into your email client

---

## Future Improvements

These are the most important improvements this tool needs to move from a working prototype to a production-ready product.

### 1. Backend API Proxy (Critical)
Currently the Groq API key lives in `config.js` on the client side. Anyone who opens DevTools can read it. A lightweight backend (Node.js or Python FastAPI) that proxies requests to Groq would hide the key entirely. This is the single most important change before any public deployment.

### 2. CSV Upload for Bulk Recipients
Right now bulk mode requires typing names line by line. Recruiters work from spreadsheets. Adding a CSV upload that reads a column of recipient names and designations would eliminate manual data entry and make bulk mode genuinely useful at scale.

### 3. Gmail and Outlook Integration
The biggest friction point is copying the output and switching to your email client. Direct integration using the Gmail API or Outlook Graph API — where the tool drafts the email into your Drafts folder ready to send — would make this a tool people use daily instead of occasionally.

### 4. Per-Recipient Variable Substitution in Bulk Mode
Currently all bulk recipients get the same key points. Real recruiter workflows need per-recipient customization — different job titles, different interview times, different salaries. Supporting placeholders like `{{role}}` or `{{time}}` mapped from a CSV column would make bulk personalization genuinely powerful.

### 5. Custom Template Builder
The three built-in templates are fixed. Users should be able to create, name, and save their own templates for their most common email types. Stored in localStorage, exportable as JSON.

### 6. Feedback Loop for Output Quality
A simple thumbs up or thumbs down on each generated email, stored locally, would allow the tool to track which tones, lengths, and purposes produce the best results. Over time this data could be used to improve the prompt or offer smarter defaults.

---

## Assignment Context

Built as part of the BSS AI Automation Internship assignment. The goal was to demonstrate practical AI integration — not just calling an API, but designing a prompt strategy, handling edge cases, building a usable interface, and thinking about what a real user actually needs.

# Issue #1 — Parse and display Subject/Body separately with copy buttons

## What to build

Currently the generated email is displayed as raw text in a single output box. The API response follows the format `Subject: <subject line>` then `Email: <email body>`. Parse this response and display the subject line and email body in two separate labelled sections, each with its own Copy button.

## Acceptance criteria

- [ ] Subject line is extracted from the API response and displayed in its own labelled box
- [ ] Email body is extracted and displayed in its own labelled box below the subject
- [ ] Each box has an independent Copy button that copies only its content
- [ ] Copy button text changes to "Copied!" for 2 seconds then resets
- [ ] If the response does not contain the expected format, the full raw text is shown as a fallback with no crash
- [ ] The existing single Copy to Clipboard button is removed

## Blocked by

None — can start immediately.

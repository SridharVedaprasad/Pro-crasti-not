# Pro-crasti-not

A voice-first personal operating system.

Speak your thoughts throughout the day. They get transcribed automatically in Google Cloud, land in your personal knowledge base, and become a daily calendar plan reviewed by an AI reasoning layer.

Built for people who think faster than they type, work in reactive environments, and want their AI to know them without endless prompt-writing.

---

## Architecture

Voice mp3 (phone) → Google Drive → Apps Script + Groq Whisper → transcript in `inbox.md` → Claude reads brain.md + inbox.md → proposes daily plan → Google Calendar.

See `ARCHITECTURE.md` for the full diagram and design decisions.

---

## Setup

Coming soon. Currently in v2 rebuild — instructions will be added once the Apps Script deploy is validated end-to-end.

Rough shape:

1. Clone this repo to `~/dev/Pro-crasti-not/`
2. Copy `templates/brain.template.md` to your Google Drive as `brain.md`, fill in your context
3. Create empty `inbox.md` in same Drive location
4. Install [clasp](https://github.com/google/clasp): `npm install -g @google/clasp`
5. `clasp login` → auth to your Google account
6. `clasp create --type standalone --title "Pro-crasti-not Transcription"`
7. `clasp push` — deploys the Apps Script
8. In script.google.com UI: add Groq API key to Script Properties (get one free from console.groq.com)
9. In script.google.com UI: create onChange trigger on your `/voice-inbox/` Drive folder
10. Test by dropping an mp3 into the folder

---

## Philosophy

- **Voice-first.** Typing loses too much context. Speak how you actually think.
- **Boring and robust > clever and fragile.** Simple pipelines, few moving parts.
- **Code is shareable, data is private.** This repo is public. Your brain.md never leaves your Drive.
- **Use the system more than build it.** Every architecture decision earns its complexity.

---

## Status

v2 rebuild in progress. v1 (Node.js watcher on Mac) killed due to Drive lazy-sync issues.

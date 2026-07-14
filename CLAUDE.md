# CLAUDE.md — Instructions for Claude Code in this project

> This file is automatically read by Claude Code at the start of every session in this directory.
> It describes what this project is, what to do, and — importantly — what NOT to do.

---

## What this project is

**Pro-crasti-not** — Sridhar's personal daily operating system.

A voice-first pipeline that captures thoughts via Oppo phone → transcribes in Google Cloud → surfaces as a daily plan on Google Calendar. The reasoning layer uses Claude (Code / Desktop / Mobile) to read a personal context file and propose a plan.

Full architecture in `ARCHITECTURE.md`. Read it before doing any design work.

---

## Repo structure
---

## Hard rules — NEVER do these

- **Do NOT commit brain.md or inbox.md.** These live only in Sridhar's Google Drive, never in git. `.gitignore` enforces this — do not override.
- **Do NOT commit .env or any file containing API keys.** Secrets belong in Apps Script Properties (for Groq key) or local .env (untracked). Never in code.
- **Do NOT use `sed -i` or in-place shell modification tools on any markdown file.** Use the Write or Edit tool only. `sed` has corrupted files in past sessions.
- **Do NOT delete Google Calendar events unless explicitly instructed.** If a duplicate is detected, REPORT it and wait for Sridhar's confirmation on which to keep.
- **Do NOT infer the current date from conversation history or memory.** Run `date` in terminal first. Voice notes may be old — the calendar is always today-forward.
- **Do NOT restart the architecture without asking.** The design is deliberate. If something feels wrong, flag it and ask before changing structure.
- **Do NOT push to remote automatically.** After committing, tell Sridhar what was changed and let him push (`git push`) manually.

---

## How to work in this repo

**When Sridhar asks for a code change:**
1. Read `ARCHITECTURE.md` to understand the system boundary you're touching.
2. Make the change in the relevant file under `src/` or `deploy/`.
3. Run any relevant tests or lints.
4. `git status` to show what changed.
5. Report back — do not commit or push without confirmation.

**When Sridhar asks to `/plan-my-day`:**
1. Run `date` in terminal — state today's date explicitly.
2. Read brain.md from Sridhar's Google Drive (path: `~/Library/CloudStorage/GoogleDrive-*/My Drive/Pro-crasti-not/brain.md`).
3. Read inbox.md from the same Drive location.
4. Check Google Calendar for today via MCP.
5. Propose a plan in a table. DO NOT create events yet.
6. Wait for approval. Only then create events, archive processed inbox entries, append new patterns/preferences to brain.md.

---

## Data boundaries (STRICT)

**Lives in this repo (safe to publish):**
- All code (Apps Script, prompts, deploy configs)
- Templates (empty structures)
- Documentation (ARCHITECTURE.md, README.md, CLAUDE.md)

**NEVER in this repo:**
- brain.md (actual content, has employer names, family details, work initiatives)
- inbox.md (actual content, raw voice reflections)
- .env files (Groq API key)
- mp3 files
- Any file with a real person's name or private info

---

## When in doubt

Ask Sridhar before acting. Ten seconds of clarification beats an hour of undoing.

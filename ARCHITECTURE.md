# Sridhar's Personal Ops System — Architecture

**Owner:** Sridhar Vedaprasad
**Started:** April 2026 (v1) → Rebuild July 2026 (v2)
**Purpose:** Voice-first personal operating system for daily planning, preference tracking, and calendar automation

---

## Core Principles (locked)

1. **Voice-first.** All capture happens by voice on Sridhar's Oppo phone. No typing into text fields.
2. **No Mac dependency for capture.** Transcription runs in Google Cloud (Apps Script). Sridhar's Mac being off/asleep never breaks the pipeline.
3. **Cross-device reasoning.** `/plan-my-day` works from Claude Code on Mac, Claude desktop, Claude mobile — whichever is available.
4. **Code and data are separated.**
   - **Code** → GitHub (public-shareable, no personal data ever)
   - **Data** → Google Drive only (personal, private)
5. **Sridhar uses the system more than he builds it.** Prefer boring-and-robust over clever-and-fragile.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          OPPO PHONE                                      │
│                                                                          │
│   Voice recorder app  →  Share to Drive  →  /voice-inbox/ folder        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
                        (mp3 lands in Drive)
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                       GOOGLE CLOUD (Drive + Apps Script)                 │
│                                                                          │
│   ┌─────────────────────┐        ┌──────────────────────────────────┐   │
│   │  Drive              │        │  Apps Script (standalone)        │   │
│   │  ─────────────      │        │  ─────────────────────────       │   │
│   │  /voice-inbox/      │  ───→  │  onChange trigger fires          │   │
│   │    *.mp3            │        │  Reads mp3 from Drive            │   │
│   │  /voice-inbox/      │  ←───  │  Calls Groq Whisper API          │   │
│   │    processed/       │        │  Appends transcript to inbox.md  │   │
│   │  inbox.md ←─────────┼────────┤  Moves mp3 to processed/         │   │
│   │  brain.md           │        │                                  │   │
│   │  (DATA — never git) │        │  Secrets: Groq key in            │   │
│   │                     │        │           Script Properties      │   │
│   └─────────────────────┘        └──────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓
              (Drive syncs inbox.md + brain.md to Sridhar's devices)
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│              MAC or PHONE (reasoning, on-demand)                         │
│                                                                          │
│   Open Claude (desktop, mobile, or Claude Code)                          │
│   Say: "/plan-my-day"                                                    │
│                                                                          │
│   Claude reads:  brain.md + inbox.md from Drive                         │
│                  current calendar via Google Calendar MCP                │
│                                                                          │
│   Claude proposes plan → Sridhar approves → Claude:                     │
│     • Creates calendar events                                            │
│     • Appends new patterns/preferences to brain.md                       │
│     • Archives processed inbox.md entries                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                  GITHUB (code only — public-shareable)                   │
│                                                                          │
│   sridhar-system/                                                        │
│   ├── src/                                                               │
│   │   ├── transcribe.gs         (Apps Script source)                     │
│   │   └── prompts/                                                       │
│   │       └── plan-my-day.md    (Claude Code slash command)              │
│   ├── templates/                                                         │
│   │   ├── brain.template.md     (empty structure, no personal data)      │
│   │   └── inbox.template.md                                              │
│   ├── deploy/                                                            │
│   │   ├── .clasp.json           (Apps Script deploy config)              │
│   │   └── appsscript.json       (Apps Script manifest)                   │
│   ├── CLAUDE.md                 (guardrails for Claude Code)             │
│   ├── README.md                 (setup guide for anyone adopting this)   │
│   └── .env.example                                                       │
│                                                                          │
│   No brain.md. No inbox.md. No .env. No mp3s. Ever.                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                    MAC — LOCAL DEV FOLDER                                │
│                                                                          │
│   ~/dev/sridhar-system/  (git-cloned)                                    │
│                                                                          │
│   Purpose: where code gets edited, `clasp push` deploys Apps Script     │
│                                                                          │
│   Does NOT contain brain.md or inbox.md. Those stay in Drive only.      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

| Component | Runs Where | Job | Failure Mode |
|-----------|-----------|-----|--------------|
| Voice recorder | Oppo phone | Capture mp3, share to Drive | Manual step by Sridhar |
| Drive `/voice-inbox/` | Google Cloud | Landing zone for mp3s | None (Drive uptime) |
| Apps Script (transcribe.gs) | Google Cloud | Trigger on new mp3 → transcribe → append to inbox.md → move mp3 to processed/ | Errors logged to Apps Script dashboard |
| Groq Whisper API | Groq's cloud | Speech-to-text | Rate limits (free tier is generous) |
| inbox.md | Drive | Rolling log of voice transcripts | None (Drive uptime) |
| brain.md | Drive | Persistent memory: preferences, schedule, patterns | None (Drive uptime) |
| Claude reasoning | Mac / phone / web | Reads brain + inbox, plans day, updates calendar + brain | Sridhar must trigger `/plan-my-day` |
| Google Calendar MCP | Sridhar's Claude interface | Reads/writes calendar events | Auth expiry (rare) |
| GitHub repo | GitHub | Source of truth for code | Version control, deploy via clasp |
| clasp | Local Mac | Deploys Apps Script from git to Google | One-time setup |

---

## Data Boundaries (STRICT)

**Goes in git (safe to publish):**
- Apps Script source code
- Slash command prompts
- CLAUDE.md guardrails
- brain.template.md (empty structure)
- inbox.template.md (empty structure)
- README.md
- Deploy configs

**Never goes in git:**
- Actual brain.md (has employer names, family details, work initiatives)
- Actual inbox.md (raw voice transcripts, personal reflections)
- .env or any file with API keys
- mp3 files
- Anything with a real person's name or private info

**Enforcement:** .gitignore in root of repo will block brain.md, inbox.md, .env, *.mp3 by default. Second layer: pre-commit hook (optional) that greps for known personal terms before allowing push.

---

## Deployment Flow

**Setup (one-time):**
1. `mkdir ~/dev && git clone <repo> ~/dev/sridhar-system`
2. `npm install -g @google/clasp`
3. `clasp login` → auth to Google
4. `clasp create` → creates the Apps Script project in Sridhar's Google account
5. In script.google.com UI: add Groq API key to Script Properties
6. In script.google.com UI: create onChange trigger on /voice-inbox/ folder

**Iterating on code:**
1. Edit `.gs` file in `~/dev/sridhar-system/`
2. `git commit && git push`
3. `clasp push` — deploys new code to Apps Script

**Iterating on brain.md content:**
- Edit directly in Drive (via Docs, mobile, or Drive UI)
- Never edit brain.md from `~/dev/` (it's not there and shouldn't be)

---

## What This Replaces

**Killed:**
- watch.js (local Node.js file watcher) — replaced by Apps Script trigger
- LaunchAgent (macOS service manager) — no longer needed
- ~/sridhar-system → Drive symlink — was a workaround for chat drift, now unnecessary
- Local .env for Groq key — replaced by Apps Script Properties

**Kept:**
- brain.md content (3 months of accumulated context)
- inbox.md archive (historical voice transcripts)
- Google Drive `/voice-inbox/` folder as capture zone
- Google Calendar MCP for calendar writes

---

## Sequencing

1. **Kill v1 infrastructure** (this session) — Mac, Drive code files, GitHub repo
2. **Fresh git repo** — new `sridhar-system` on GitHub, cloned to `~/dev/`
3. **Apps Script (transcribe.gs)** — write, test, deploy via clasp
4. **Deploy trigger** — onChange on `/voice-inbox/` in script.google.com UI
5. **Test end-to-end** — drop mp3 → verify transcript in inbox.md
6. **Slash command `/plan-my-day`** — in `~/dev/.claude/commands/`
7. **First real use** — dictate → transcript → plan-my-day → calendar events

Estimated: 2-3 focused sessions with normal debugging.

---

## Design Decisions Made (locked)

- **Trigger mechanism:** Apps Script `onChange` on Drive folder (not push notifications)
- **Apps Script hosting:** Standalone project in Sridhar's Google account (not container-bound)
- **Transcript destination:** Plain `inbox.md` file in Drive (not Google Doc)
- **Deployment:** clasp (not manual paste)
- **Secrets:** Apps Script Script Properties (not .env, not git)
- **Code + data separation:** GitHub for code, Drive for data — strict, no exceptions
- **v1 cleanup:** Delete all old code + infrastructure, preserve brain.md and inbox.md content

---

## Future Phases (deferred, not now)

- **Phase 2 (config-driven brain.md):** Make brain.md structure a template so others can adopt the system with their own data. Positions the project for public showcase.
- **Phase 3 (server-side reasoning):** Move `/plan-my-day` execution to a scheduled Cloud Run job. Zero-Mac operation. Explore only if daily usage justifies it.

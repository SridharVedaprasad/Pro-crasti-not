# Audit Log Schema

> Referenced by: PROJECT_BRIEF.md ("Non-negotiable" — logging ships with the
> first transcription event, Week 1, not deferred to calendar writes in Week 2).

## Where it lives

- **Schema (this file):** in git — it's structure, not personal data.
- **Actual log file (`audit.jsonl`):** in Google Drive, alongside `brain.md`
  and `inbox.md`. Never committed to git — same reasoning as brain.md/inbox.md,
  entries will contain personal schedule/calendar detail even though the
  schema itself is generic.

## Format

Append-only. One JSON object per line (JSONL) — easy to `grep`, easy to
aggregate, easy to append from Apps Script without parsing the whole file
each time.

```json
{"timestamp":"2026-07-21T14:32:05+08:00","action_type":"inbox_transcribe","trust_tier":"supervised","trigger":"voice_note","input_summary":"mp3 'Tuesday morning thoughts.mp3', 47s","output_summary":"transcript appended to inbox.md, 312 chars","outcome":"success","ambiguity_flag":false,"reversed_at":null,"notes":""}
```

## Fields

| Field | Type | Values | Notes |
|---|---|---|---|
| `timestamp` | string | ISO 8601, Asia/Singapore offset | Always local time, never UTC-only — matches CLAUDE.md's date-handling rule. |
| `action_type` | string | `inbox_transcribe`, `calendar_create`, `calendar_update`, `calendar_delete`, `brain_update`, `inbox_archive` | Extend this list as new action types appear — update this table when you do. |
| `trust_tier` | string | `supervised` \| `autonomous` | `supervised` = human approved before execution. `autonomous` = agent acted without per-action approval, within a Week 3 trust-tier boundary. Everything is `supervised` until Week 3 defines the narrow autonomous slice. |
| `trigger` | string | `voice_note`, `manual_prompt`, `scheduled` | What caused this action to happen. `scheduled` is reserved for proactive scheduling — cut from this project's scope (see PROJECT_BRIEF.md amendment), but the field stays in case it's revived later. |
| `input_summary` | string | free text, short | What prompted the action. Not the full transcript/prompt — a summary. Keep it short enough that the log stays scannable. |
| `output_summary` | string | free text, short | What was actually written or changed. |
| `outcome` | string | `success` \| `failure` \| `reversed` | `reversed` means a later action undid this one — set `reversed_at` when that happens. |
| `ambiguity_flag` | boolean | `true` \| `false` | Was this action taken despite genuine ambiguity in the input? This is the field that lets Week 3's open design question ("does the agent act-and-log or ask, on ambiguity?") get answered with real numbers instead of a guess. Log `true` even for supervised actions where the human had to disambiguate — that's data too. |
| `reversed_at` | string \| null | ISO 8601 or `null` | Set only if `outcome` becomes `reversed`. |
| `notes` | string | free text, optional | Anything that doesn't fit the above. Keep empty unless genuinely useful — don't let this become a dumping ground. |

## Why this shape

- **Same schema for supervised and autonomous actions.** The whole point of
  the audit log, per PROJECT_BRIEF.md, is comparing intervention rate
  before/after autonomy is introduced in Week 3. That comparison is only
  valid if Week 1-2's supervised actions were logged the same way.
- **`ambiguity_flag` exists from day one**, not added retroactively in Week 3.
  Reconstructing "was this ambiguous?" after the fact is guesswork; logging
  it at decision time is data.
- **Capture-layer events count**, not just calendar writes. `inbox_transcribe`
  is a logged action type — Week 1 needs its own numbers (how many
  transcriptions succeeded/failed, how long capture took to stabilise) for
  the eventual failure-mode write-up, same as Week 2-3's calendar actions do.

## How to append (for whoever/whatever is writing this)

Apps Script (`transcribe.gs`) and Claude Code (via `/plan-my-day` and manual
processing) both append to the same `audit.jsonl` in Drive. Always append,
never rewrite the whole file. One line per action, immediately after the
action completes (success or failure) — don't batch.

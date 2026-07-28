# Completions Log Schema

> Referenced by /plan-my-day (the completion-reconciliation step).
> Lives in Google Drive as `completions.jsonl` alongside brain.md / inbox.md /
> audit.jsonl. NEVER in git — it holds personal daily-activity detail.
> Append-only. One JSON object per line.

## Why this exists

Sridhar's real goal is reclaiming time by cutting non-essentials (stated
2026-07-28). That requires answering TWO different questions, which must NOT be
collapsed into one:

1. **Adherence** — of the things I planned, which did I actually do?
2. **Time leakage** — what unplanned things ate my time?

If these share one undifferentiated "completion" record, the data becomes
unanalyzable. The schema keeps them distinct via the `kind` field.

## Format

```json
{"timestamp":"2026-07-28T21:15:00+08:00","date":"2026-07-28","kind":"planned","item":"ETF/stock investing check-in","calendar_event_id":"fnruu2s2g68ak0ms9i9aoqd4sg","status":"skipped","reason":"avoidance — 3rd skip","source":"voice_note","notes":""}
{"timestamp":"2026-07-28T21:15:30+08:00","date":"2026-07-28","kind":"unplanned","item":"read to Vyom","calendar_event_id":null,"status":"done","reason":"","duration_min":60,"source":"voice_note","notes":"not on calendar — time-leakage capture"}
```

## Fields

| Field | Type | Values | Notes |
|---|---|---|---|
| `timestamp` | string | ISO 8601, +08:00 | When the completion was logged. |
| `date` | string | YYYY-MM-DD | The DAY being reported on (may differ from timestamp if reporting next morning). |
| `kind` | string | `planned` \| `unplanned` | THE critical field. `planned` = maps to a calendar event that existed. `unplanned` = happened but was never scheduled (time-leakage). Never guess — if it maps to a calendar event, it's planned; if not, unplanned. |
| `item` | string | free text | What the thing was. For `planned`, use the calendar event's title. |
| `calendar_event_id` | string \| null | event id or null | For `planned`: the reconciled event's id. For `unplanned`: null. |
| `status` | string | `done` \| `partial` \| `skipped` | For `unplanned` it's almost always `done` (it happened). Meaningful mainly for `planned`. |
| `reason` | string | free text, optional | Why skipped/partial. Critical for the future "confront" logic — "avoidance", "reality intervened", "decision-blocked", etc. Leave empty if done and unremarkable. |
| `duration_min` | integer \| null | minutes | Mainly for `unplanned` time-leakage capture. Null if unknown. |
| `source` | string | `voice_note` \| `manual_prompt` | How the completion was reported. |
| `notes` | string | free text, optional | Anything else. |

## How /plan-my-day populates this

When an inbox entry is a COMPLETION REPORT (see plan-my-day.md classification):
1. For each thing mentioned, decide `planned` vs `unplanned` by checking whether
   it maps to a real event on that date's calendar.
2. `planned` → reconcile: find the event, set status (done/partial/skipped) +
   reason, record calendar_event_id.
3. `unplanned` → log as time-leakage: status usually done, capture duration if
   stated, calendar_event_id null.
4. Surface ALL of this at the approval gate BEFORE writing. Sridhar confirms the
   planned-vs-unplanned split and statuses (guards against voice-transcription
   misreads silently corrupting the data).
5. On approval: append lines here, and log the act to audit.jsonl
   (action_type: completion_log).

## What this feeds later (not built yet)

- **Confront logic:** repeated `skipped` on the same `planned` item across days
  → "you've skipped X 3x, cut it?" (essentialism / friction removal).
- **Time-leakage review:** aggregate `unplanned` items → "here's where your time
  actually went vs. what you planned."
Both are the actual prize (reclaiming time). This schema is their fuel.

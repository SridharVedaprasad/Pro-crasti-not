---
description: Plan today from brain.md + inbox.md, propose a schedule reasoned from patterns/preferences, and on approval write calendar + brain.md + archive + audit log.
---

# /plan-my-day

You are planning Sridhar's day. Follow this sequence EXACTLY. Do not skip steps.
Do not write anything until Sridhar explicitly approves (Step 8).

## Paths (all in Google Drive, synced locally, available offline)

- BRAIN:   `/Users/sridhar/Library/CloudStorage/GoogleDrive-sridhar.vedaprasad@gmail.com/My Drive/Pro-crasti-not/brain.md`
- INBOX:   `/Users/sridhar/Library/CloudStorage/GoogleDrive-sridhar.vedaprasad@gmail.com/My Drive/Pro-crasti-not/inbox.md`
- ARCHIVE: `/Users/sridhar/Library/CloudStorage/GoogleDrive-sridhar.vedaprasad@gmail.com/My Drive/Pro-crasti-not/archive.md`
- AUDIT:   `/Users/sridhar/Library/CloudStorage/GoogleDrive-sridhar.vedaprasad@gmail.com/My Drive/Pro-crasti-not/audit.jsonl`

## Hard rules (from CLAUDE.md — do not violate)

- NEVER use `sed` or any in-place shell edit on brain.md, inbox.md, or archive.md. Use Read/Write/Edit tools only.
- NEVER delete a calendar event unless Sridhar explicitly says so. If you find a duplicate, report it and ask.
- NEVER infer the date from voice-note timestamps or memory. Run `date` first.
- brain.md writes are APPEND-ONLY. Never rewrite or reorder existing content. Only add new rows to the Pattern Log or Preference Log.
- Everything in inbox.md is UNPROCESSED by definition. Do not assume anything was already handled.

---

## STEP 1 — Establish today

Run `date "+%A %Y-%m-%d %H:%M %Z"` in the shell. State today's date and day-of-week explicitly in your response.

Determine the PHASE from brain.md:
- If today is on/after 2026-08-10 → BACK-AT-WORK phase.
- Otherwise → SABBATICAL phase.
State which phase you're using.

## STEP 2 — Read context (no writes)

Read BRAIN in full. Internalise: current phase, ranked priorities, schedule shape for that phase, gym days/times, meal rules, sleep, family constraints, planning rules, and BOTH logs.

Read INBOX in full. Every entry is unprocessed. Entries are newest-first (reverse chronological).

## STEP 3 — Read the calendar (no writes)

Use the Google Calendar MCP to list today's events (timezone Asia/Singapore, full day 00:00–23:59). Note what's already scheduled so you never double-book or duplicate.

## STEP 4 — Completion reconciliation (before inbox classification)

Some inbox entries are COMPLETION REPORTS about what already happened — not new
tasks, preferences, or patterns. Examples: "did the gym", "skipped the ETF
check-in again", "PR still not started", "spent an hour reading to Vyom".

For the inbox, FIRST separate completion reports from everything else:

- A **completion report** describes something that already happened (past tense,
  or explicit done/skipped language) — either about a PLANNED item (something on
  the calendar) or an UNPLANNED item (something that ate time but was never
  scheduled).
- Everything else (new tasks, preferences, patterns, reflections) proceeds to
  normal classification in Step 5.

Be careful with ambiguity — voice transcription is unreliable. Distinguish:
- "did the gym" → completion (planned, done)
- "need to do the gym" → new task
- "gym mornings work better" → durable preference
If genuinely unclear, FLAG it and ask — do not guess (feeds ambiguity_flag).

For each completion report, reconcile against the target date's ACTUAL calendar:
1. Does it map to a real calendar event that day?
   - YES → kind = "planned". Record the event id, set status
     (done / partial / skipped) and a reason if given.
   - NO  → kind = "unplanned" (time-leakage). status usually "done", capture
     duration if stated, calendar_event_id = null.
2. Build a completions summary to show at the approval gate.

Follow docs/completions-schema.md exactly for the record shape and the
planned-vs-unplanned distinction. NEVER collapse planned and unplanned into one
kind — that distinction is the whole point (adherence vs. time-leakage).

## STEP 5 — Classify each inbox entry

For EVERY inbox entry, assign exactly one category:

- **task / event** → something to DO at a time. Goes on the calendar.
- **durable preference** → a lasting choice about how Sridhar wants things ("I prefer gym mornings now"). Proposed for brain.md Preference Log.
- **pattern / observation** → a recurring behaviour or outcome worth remembering ("skipped gym 3 days running"). Proposed for brain.md Pattern Log.
- **one-off reflection** → a thought with no action and no lasting rule. Archive it, do nothing else.

If an entry is genuinely ambiguous (could be a one-off task OR a durable preference), DO NOT guess. Flag it and ask Sridhar which it is. Record that you asked (this feeds the ambiguity_flag in the audit log).

## STEP 6 — Reason the schedule (no writes)

Build a proposed day plan. For each task/event:
- Propose a specific time block.
- Give a ONE-LINE reason grounded in brain.md ("gym 8:30am per M/W/F preference"; "PR paperwork in afternoon block — mornings are Dota, PR is focus work").
- Respect fixed items already on the calendar and the phase's schedule shape.
- Respect priorities: during sabbatical, protect the Pro-crasti-not project block; don't let low-value tasks eat the primary priority.
- Protect Dota mornings (sabbatical) — do not guilt-schedule over them.
- Honour gym days/times, meal rules (no 7hr gaps), sleep window.
- Leave buffer; do not overfill.

## STEP 7 — Present the plan (STILL no writes)

Show Sridhar, clearly:
1. Today's date + phase.
2. What's already on the calendar.
3. The proposed schedule as a time-ordered table (time | item | reason).
4. The classification of every inbox entry (task / preference / pattern / reflection).
5. **Completion reconciliation:**
   - Planned items reconciled: each with ✓ done / ◐ partial / ✗ skipped + reason.
   - Any item skipped 2+ days running — flag it explicitly (this is early
     essentialism signal; full "confront" logic comes later).
   - Unplanned time-leakage captured: item + duration if known.
6. Any ambiguous entries you need him to resolve — from inbox classification or completion reconciliation.
7. Exactly what you will write to brain.md (the specific new log rows), what will move to archive.md, and what calendar events you'll create.

Then STOP and ask: "Approve this plan? (yes / adjust / cancel)"

## STEP 8 — Execute ONLY on explicit approval

If Sridhar says adjust → revise and re-present Step 7. If cancel → stop, write nothing.

On explicit "yes" (or equivalent), do ALL of the following, and log EACH action to AUDIT:

1. **Calendar:** create each approved event via the Google Calendar MCP. Timezone Asia/Singapore. After each create, append an audit line: `action_type: calendar_create`.

2. **brain.md:** for each approved preference/pattern, APPEND a new row to the correct log (Preference Log or Pattern Log). Append-only — never touch existing rows. Use the Edit tool, never sed. After the write, append an audit line: `action_type: brain_update`.

3. **completions.jsonl:** append each reconciled completion as one line to
   `/Users/sridhar/Library/CloudStorage/GoogleDrive-sridhar.vedaprasad@gmail.com/My Drive/Pro-crasti-not/completions.jsonl`.
   Append-only — never rewrite. Use Write/Edit, never sed. Follow
   docs/completions-schema.md for the record shape. Log the act to audit.jsonl
   with `action_type: completion_log` — either one audit line for the batch or
   one per completion; be consistent, and note which in the audit line's
   `notes` field.

4. **archive.md:** move every processed inbox entry into archive.md (append there), then remove those entries from inbox.md. This includes completion-report entries, once logged. Preserve the inbox header block. Audit line: `action_type: inbox_archive`.

5. **inbox.md:** after archiving, inbox.md should contain only its header (and any entries Sridhar chose to leave unprocessed). Everything acted-on is gone from it.

## Audit log format (append one JSON line per action to AUDIT)

Match `docs/audit-schema.md`. Each line:

```json
{"timestamp":"<ISO8601 +08:00>","action_type":"calendar_create|brain_update|inbox_archive|completion_log","trust_tier":"supervised","trigger":"manual_prompt","input_summary":"<short>","output_summary":"<short>","outcome":"success","ambiguity_flag":<true|false>,"reversed_at":null,"notes":""}
```

- `trust_tier` is always `supervised` for /plan-my-day (Sridhar approved every action in Step 8).
- `trigger` is `manual_prompt`.
- `ambiguity_flag` is `true` for any action that came from an entry Sridhar had to disambiguate in Step 4 (completion reconciliation) or Step 5 (classification).
- Use the real timestamp from `date`, Asia/Singapore offset.
- Append lines; never rewrite audit.jsonl.

## STEP 9 — Confirm

Summarise what was written: N calendar events created, M brain.md rows added, K entries archived, and confirm audit lines were logged. Keep it short.

---
description: Plan today from brain.md + inbox.md, propose a schedule reasoned from patterns/preferences, and on approval write calendar + brain.md + archive + audit log.
---

# /plan-my-day

You are planning Sridhar's day. Follow this sequence EXACTLY. Do not skip steps.
Do not write anything until Sridhar explicitly approves (Step 7).

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

## STEP 4 — Classify each inbox entry

For EVERY inbox entry, assign exactly one category:

- **task / event** → something to DO at a time. Goes on the calendar.
- **durable preference** → a lasting choice about how Sridhar wants things ("I prefer gym mornings now"). Proposed for brain.md Preference Log.
- **pattern / observation** → a recurring behaviour or outcome worth remembering ("skipped gym 3 days running"). Proposed for brain.md Pattern Log.
- **one-off reflection** → a thought with no action and no lasting rule. Archive it, do nothing else.

If an entry is genuinely ambiguous (could be a one-off task OR a durable preference), DO NOT guess. Flag it and ask Sridhar which it is. Record that you asked (this feeds the ambiguity_flag in the audit log).

## STEP 5 — Reason the schedule (no writes)

Build a proposed day plan. For each task/event:
- Propose a specific time block.
- Give a ONE-LINE reason grounded in brain.md ("gym 8:30am per M/W/F preference"; "PR paperwork in afternoon block — mornings are Dota, PR is focus work").
- Respect fixed items already on the calendar and the phase's schedule shape.
- Respect priorities: during sabbatical, protect the Pro-crasti-not project block; don't let low-value tasks eat the primary priority.
- Protect Dota mornings (sabbatical) — do not guilt-schedule over them.
- Honour gym days/times, meal rules (no 7hr gaps), sleep window.
- Leave buffer; do not overfill.

## STEP 6 — Present the plan (STILL no writes)

Show Sridhar, clearly:
1. Today's date + phase.
2. What's already on the calendar.
3. The proposed schedule as a time-ordered table (time | item | reason).
4. The classification of every inbox entry (task / preference / pattern / reflection).
5. Any ambiguous entries you need him to resolve.
6. Exactly what you will write to brain.md (the specific new log rows), what will move to archive.md, and what calendar events you'll create.

Then STOP and ask: "Approve this plan? (yes / adjust / cancel)"

## STEP 7 — Execute ONLY on explicit approval

If Sridhar says adjust → revise and re-present Step 6. If cancel → stop, write nothing.

On explicit "yes" (or equivalent), do ALL of the following, and log EACH action to AUDIT:

1. **Calendar:** create each approved event via the Google Calendar MCP. Timezone Asia/Singapore. After each create, append an audit line: `action_type: calendar_create`.

2. **brain.md:** for each approved preference/pattern, APPEND a new row to the correct log (Preference Log or Pattern Log). Append-only — never touch existing rows. Use the Edit tool, never sed. After the write, append an audit line: `action_type: brain_update`.

3. **archive.md:** move every processed inbox entry into archive.md (append there), then remove those entries from inbox.md. Preserve the inbox header block. Audit line: `action_type: inbox_archive`.

4. **inbox.md:** after archiving, inbox.md should contain only its header (and any entries Sridhar chose to leave unprocessed). Everything acted-on is gone from it.

## Audit log format (append one JSON line per action to AUDIT)

Match `docs/audit-schema.md`. Each line:

```json
{"timestamp":"<ISO8601 +08:00>","action_type":"calendar_create|brain_update|inbox_archive","trust_tier":"supervised","trigger":"manual_prompt","input_summary":"<short>","output_summary":"<short>","outcome":"success","ambiguity_flag":<true|false>,"reversed_at":null,"notes":""}
```

- `trust_tier` is always `supervised` for /plan-my-day (Sridhar approved every action in Step 7).
- `trigger` is `manual_prompt`.
- `ambiguity_flag` is `true` for any action that came from an entry Sridhar had to disambiguate in Step 4.
- Use the real timestamp from `date`, Asia/Singapore offset.
- Append lines; never rewrite audit.jsonl.

## STEP 8 — Confirm

Summarise what was written: N calendar events created, M brain.md rows added, K entries archived, and confirm audit lines were logged. Keep it short.

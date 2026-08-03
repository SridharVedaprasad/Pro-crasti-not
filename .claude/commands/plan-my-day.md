---
description: Plan today from brain.md + inbox.md, propose a schedule reasoned from patterns/preferences, and on approval write calendar + brain.md + archive + audit log.
---

# /plan-my-day

You are planning Sridhar's day. Follow this sequence EXACTLY. Do not skip steps.
Do not write anything until Sridhar explicitly approves (Step 9).

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

**Date attribution (do this FIRST, before reconciling anything against the calendar):**
Determine which DAY each completion report refers to, in this priority order:
1. If the note explicitly names a day ("yesterday", "on Monday", a date) → use that.
2. Else if dictated before 11:00am local → assume it reports on YESTERDAY (morning-after reflection).
3. Else (dictated 11:00am or later) → assume it reports on TODAY.
4. If still ambiguous → surface at the approval gate and ask Sridhar. Never silently guess.
Use the resolved day as the `date` field in completions.jsonl, and reconcile against THAT day's calendar — not necessarily today's.

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

The two categories below apply to NEW/forward items only, not completion reports (those are handled in Step 4):

- **decision-blocked** → names an action, but doing it requires an unmade decision first ("book October flights" — blocked on price / destination / aligning with wife).
  - Do NOT schedule the action — scheduling it guarantees the skip, since there's nothing to do yet.
  - Surface the blocking decision(s) at the approval gate.
  - Only schedule "make the decision" if it's an actionable SOLO decision. If it needs another person, it's a "raise with X" nudge, not a calendar task.
  - Do NOT try to distinguish "genuinely blocked" from "avoidance dressed as blocked" via cleverness. NAME the assumption at the gate ("treating this as decision-blocked on destination — correct?") and let Sridhar confirm.
- **needs-decomposition** → big, unbounded, no obvious first move, high activation energy ("PR application").
  - Do NOT schedule a big scary block ("PR — 2 hours").
  - Schedule ONLY "define the first small sub-task of X — 15 min."
  - Sub-tasks, once defined, re-enter as normal inbox items later and get scheduled normally.
  - Principle: for a big task, the system's job is to make STARTING cheap, not to allocate time to FINISHING.

If an entry is genuinely ambiguous (could be a one-off task OR a durable preference), DO NOT guess. Flag it and ask Sridhar which it is. Record that you asked (this feeds the ambiguity_flag in the audit log).

## STEP 6 — Confront pass: surface repeat-skip patterns (no writes)

This reads HISTORY, not just today. Read `completions.jsonl` in full.

**Matching rule (v1 — deliberately exact, not fuzzy):**
- Count skips by EXACT item title match across days.
- Do NOT fuzzy/semantically group similar titles. Decomposition intentionally
  produces DIFFERENT sub-task titles as real progress; fuzzy matching would
  wrongly lump them as "same item skipped again" and punish the exact
  decomposition behaviour this system encourages.
- A "skip" = an entry with `kind:"planned"` AND `status:"skipped"`.
- Threshold: 3 or more skips of the SAME exact item title.

**Data-integrity rule — skipped vs never-scheduled:**
- Only count entries that are `kind:"planned"` AND `status:"skipped"`.
- Do NOT infer a skip from the ABSENCE of a completion entry. A missing entry
  means the item was never scheduled or never reported on — NOT that it was
  skipped. (The planner intermittently drops recurring anchors like dinner;
  that's a separate known bug. Never treat a never-scheduled item as a skip.)
- If an item's history is a mix of done and skipped, only the skipped count
  toward the threshold, but MENTION the done count too (e.g. "skipped 3, done
  1") so Sridhar sees the full picture, not a cherry-picked negative.

**When an item hits 3+ skips, infer WHICH of three meanings applies, using the
`reason` field.** Do NOT collapse these — collapsing is harmful (e.g.
suggesting to "cut" medication):

1. **NON-ESSENTIAL → propose CUT.** Signal: reasons like "no time", "didn't
   get to it", "deprioritised", with no real consequence noted. Example: ETF
   check-in. Gate wording: "X skipped 3x (reasons: ...). Looks non-essential.
   Cut it, keep trying, or reschedule differently?"
2. **MATTERS BUT APPROACH BROKEN → propose CHANGE THE MECHANISM, not cut.**
   Signal: reasons like "forgot"; item is clearly important (health, meds).
   Example: reflux pills. Gate wording: "X skipped 3x (reason: forgot). This
   matters — the reminder approach isn't working. Options: stronger/
   rescheduled reminder, habit-stack onto an existing anchor, or change the
   time. NOT proposing to cut."
3. **MATTERS BUT BLOCKED → route to decision-blocked / needs-decomposition.**
   Signal: reasons like "not started", "no first move", or it's a big/
   undecided item. Example: PR application. Gate wording: "X skipped 3x — not
   started each time. This isn't a scheduling problem, it's a
   [decision-blocked / needs-decomposition] problem. Want to surface the
   blocking decision / define a first sub-task instead of re-scheduling the
   same block?"

If the reason signals are ambiguous, present the pattern and ASK which of the
three it is — do not guess.

**Hard safeguard:** Confront NEVER cuts, changes, or reschedules
automatically. It only SURFACES the pattern + inferred category + proposed
action at the gate (Step 8). Sridhar decides. If nothing hits the threshold,
this pass produces nothing to show — no noise at the gate.

## STEP 7 — Reason the schedule (no writes)

Build a proposed day plan. For each task/event:
- Propose a specific time block.
- Give a ONE-LINE reason grounded in brain.md ("gym 8:30am per M/W/F preference"; "PR paperwork in afternoon block — mornings are Dota, PR is focus work").
- Ask the essentialism question: "given the goal is reclaiming time for what matters, does this earn a slot today, or is it a default/non-essential?" Only SURFACE this at the approval gate (e.g. "ETF — 3rd day scheduled, still worth it?") — NEVER auto-cut. Items with 3+ exact-match skips are already handled by the Confront pass (Step 6); this question is for lighter, first/second-time essentialism doubts that don't yet meet that threshold.
- Respect fixed items already on the calendar and the phase's schedule shape.
- Respect priorities: during sabbatical, protect the Pro-crasti-not project block; don't let low-value tasks eat the primary priority.
- Protect Dota mornings (sabbatical) — do not guilt-schedule over them.
- Honour gym days/times, meal rules (no 7hr gaps), sleep window.
- Leave buffer; do not overfill.

## STEP 8 — Present the plan (STILL no writes)

Show Sridhar, clearly, in this order:
1. Today's date + phase.
2. What's already on the calendar.
3. **Confront** (only if the Step 6 pass found anything — omit the section
   entirely if nothing hit the threshold, no noise): for each item hitting 3+
   exact-match skips, show the skip count (+ done count if mixed), the
   reasons, the inferred category, and the proposed action.
4. The proposed schedule as a time-ordered table (time | item | reason).
5. The classification of every inbox entry (task / preference / pattern / reflection / decision-blocked / needs-decomposition):
   - For **decision-blocked** items: show the blocking decision(s), and whether a "make the decision" task is being proposed (or a "raise with X" nudge instead, if it needs another person).
   - For **needs-decomposition** items: show the "define first sub-task" item being scheduled in place of the big block.
6. **Completion reconciliation:**
   - Planned items reconciled: each with ✓ done / ◐ partial / ✗ skipped + reason.
   - Any item skipped 2+ days running (but under the Confront threshold of 3)
     — flag it explicitly as an early essentialism signal.
   - Unplanned time-leakage captured: item + duration if known.
7. Any ambiguous entries you need him to resolve — from inbox classification, completion reconciliation, or the Confront pass.
8. Exactly what you will write to brain.md (the specific new log rows), what will move to archive.md, and what calendar events you'll create.

Then STOP and ask: "Approve this plan? (yes / adjust / cancel)"

## STEP 9 — Execute ONLY on explicit approval

If Sridhar says adjust → revise and re-present Step 8. If cancel → stop, write nothing.

On explicit "yes" (or equivalent), do ALL of the following, and log EACH action to AUDIT:

1. **Calendar:** create each approved event via the Google Calendar MCP. Timezone Asia/Singapore. After each create, append an audit line: `action_type: calendar_create`. If the event came from a **decision-blocked** item (a solo "make the decision" task) or a **needs-decomposition** item (a "define first sub-task" block), say so explicitly in that audit line's `notes` field (e.g. "needs-decomposition: first sub-task of PR application") — reuse `action_type: calendar_create`, do not invent a new action_type.

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

6. **Confront-driven actions:** Confront (Step 6) never acts on its own — it only proposed at the gate (Step 8). If Sridhar approved a Confront proposal:
   - **Cut:** don't schedule the item going forward. Append a brain.md Pattern Log row recording the decision and why, so the history shows a deliberate cut, not a silent drop. Audit line: reuse `action_type: brain_update`.
   - **Mechanism changed:** create/adjust the calendar event per the new mechanism. Audit line: reuse `action_type: calendar_create`.
   - **Routed to decision-blocked / needs-decomposition:** handle per the normal Step 5 rules for that category (surface the blocking decision, or schedule only the "define first sub-task" block).
   - In every case, put `"confront-driven"` + the item + the decision in that audit line's `notes` field. Do NOT invent a new `action_type` — reuse the existing ones above.

## Audit log format (append one JSON line per action to AUDIT)

Match `docs/audit-schema.md`. Each line:

```json
{"timestamp":"<ISO8601 +08:00>","action_type":"calendar_create|brain_update|inbox_archive|completion_log","trust_tier":"supervised","trigger":"manual_prompt","input_summary":"<short>","output_summary":"<short>","outcome":"success","ambiguity_flag":<true|false>,"reversed_at":null,"notes":""}
```

- `trust_tier` is always `supervised` for /plan-my-day (Sridhar approved every action in Step 9).
- `trigger` is `manual_prompt`.
- `ambiguity_flag` is `true` for any action that came from an entry Sridhar had to disambiguate in Step 4 (completion reconciliation) or Step 5 (classification).
- Use the real timestamp from `date`, Asia/Singapore offset.
- Append lines; never rewrite audit.jsonl.

## STEP 10 — Confirm

Summarise what was written: N calendar events created, M brain.md rows added, K entries archived, and confirm audit lines were logged. Keep it short.

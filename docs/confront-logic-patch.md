# Confront Logic — BUILD PATCH (apply to plan-my-day.md)

> The friction-removal engine. Reads completions.jsonl, finds repeat-skips,
> and confronts Sridhar at the gate before proposing the day. Never auto-acts.

## WHERE IT GOES
New step, runs during completion reconciliation / before presenting the plan —
specifically AFTER completion reconciliation (Step 4) and the classification
(Step 5), as part of building the approval-gate presentation (Step 7). It reads
history, not just today. Insert as a distinct "Confront pass" whose output feeds
the approval gate.

## MATCHING RULE (v1 — deliberately exact, not fuzzy)
- Count skips by EXACT item title match across days in completions.jsonl.
- Do NOT fuzzy/semantically group similar titles. Reason: decomposition
  intentionally produces DIFFERENT sub-task titles as real progress; fuzzy
  matching would wrongly lump them as "same item skipped again" and punish the
  exact decomposition behaviour the system encourages.
- A "skip" = a completions.jsonl entry with status "skipped".
- Threshold: 3 or more skips of the SAME exact item title.

## CRITICAL DATA-INTEGRITY RULE — skipped vs never-scheduled
- Only count entries that are kind:"planned" AND status:"skipped".
- Do NOT infer a skip from the ABSENCE of a completion entry. A missing entry
  means the item was never scheduled OR never reported on — NOT that it was
  skipped. (The planner intermittently drops recurring anchors like dinner; that
  is a separate known bug. Confront must never treat a never-scheduled item as a
  skip.)
- If an item's history is a mix of done and skipped, only the skipped count
  toward the threshold, but MENTION the done count too (e.g. "skipped 3, done 1")
  so Sridhar sees the full picture, not a cherry-picked negative.

## WHAT CONFRONT DOES WHEN AN ITEM HITS 3+ SKIPS
Infer WHICH of three meanings applies, using the `reason` field already captured
in completions.jsonl. Do NOT collapse these — collapsing is harmful (e.g.
suggesting to "cut" medication):

1. NON-ESSENTIAL -> propose CUT.
   Signal: reasons like "no time", "didn't get to it", "deprioritised", with no
   real consequence noted. Example: ETF check-in.
   Gate wording: "X skipped 3x (reasons: ...). Looks non-essential. Cut it,
   keep trying, or reschedule differently?"

2. MATTERS BUT APPROACH BROKEN -> propose CHANGE THE MECHANISM, not cut.
   Signal: reasons like "forgot"; item is clearly important (health, meds).
   Example: reflux pills.
   Gate wording: "X skipped 3x (reason: forgot). This matters — the reminder
   approach isn't working. Options: stronger/rescheduled reminder, habit-stack
   onto an existing anchor, or change the time. NOT proposing to cut."

3. MATTERS BUT BLOCKED -> route to decision-blocked / needs-decomposition.
   Signal: reasons like "not started", "no first move", or it's a big/undecided
   item. Example: PR application.
   Gate wording: "X skipped 3x — not started each time. This isn't a scheduling
   problem, it's a [decision-blocked / needs-decomposition] problem. Want to
   surface the blocking decision / define a first sub-task instead of
   re-scheduling the same block?"

If the reason signals are ambiguous, present the pattern and ASK which of the
three it is — do not guess.

## HARD SAFEGUARD
- Confront NEVER cuts, changes, or reschedules automatically.
- It only SURFACES the pattern + inferred category + proposed action at the gate.
- Sridhar decides. Same human-in-the-loop rule as all writes.
- If Sridhar approves a "cut", the item simply isn't scheduled going forward;
  log a brain.md Pattern Log row recording the decision and why (so the history
  shows it was a deliberate cut, not a silent drop).

## AUDIT
- When a confront-driven decision results in an action (cut logged / mechanism
  changed / routed to decomposition), log to audit.jsonl. Reuse existing
  action_type where it fits (brain_update for a logged cut; calendar_create for a
  changed mechanism). Put "confront-driven" + the item + the decision in the
  notes field. Do NOT invent a new action_type.

## GATE PRESENTATION
Add a "Confront" section to the approval gate (Step 7), shown BEFORE the proposed
schedule:
- List each item hitting 3+ exact-match skips.
- For each: skip count (+ done count), the reasons, the inferred category, and
  the proposed action.
- Then the normal plan follows.
- If nothing hits the threshold, omit the section entirely (no noise).

## BUILD DISCIPLINE
1. Apply via Claude Code in one pass.
2. FULL read-back before saving — watch step renumbering + duplicated blocks.
3. Frontmatter intact.
4. Commit via Claude Code only. No web edits.
5. TEST is immediate and real: completions.jsonl already contains PR (skipped
   repeatedly, "not started" -> should route to decomposition), reflux pills
   (skipped, "forgot" -> should propose mechanism change), and check whether any
   item hits the exact-3 threshold. Run /plan-my-day and confirm the Confront
   section fires correctly and categorises each by its real reason.

# Classifier Upgrade — BUILD PATCH (apply to plan-my-day.md today)

> Supersedes the earlier design spec. Three changes, folded into one build.
> Interaction question RESOLVED by real completions.jsonl data (28-30 Jul):
> decomposition happens at PLAN time; completion-logging happens at REPORT time.
> They occur at different points in the cycle and do NOT collide. No precedence
> conflict. Proceed.

## CHANGE 1 — Date attribution rule (in the completion-reconciliation step, STEP 4)

Add this rule at the START of completion reconciliation, before reconciling any
item against the calendar:

"Determine which DAY each completion report refers to, in this priority order:
 1. If the note explicitly names a day ('yesterday', 'on Monday', a date) -> use that.
 2. Else if dictated before 11:00am local -> assume it reports on YESTERDAY
    (morning-after reflection).
 3. Else (dictated 11:00am or later) -> assume it reports on TODAY.
 4. If still ambiguous -> surface at the approval gate and ask Sridhar. Never
    silently guess.
 Use the resolved day as the `date` field in completions.jsonl, and reconcile
 against THAT day's calendar (not necessarily today's)."

Reason: real data showed the system guessing per-entry (one report dictated
2026-07-28 was attributed to 07-27 with an ad-hoc rationale). A firm rule +
gate fallback replaces per-entry guessing.

## CHANGE 2 — Two new classification categories (in classification step, STEP 5)

Add to the category list, AFTER the existing four (task / preference / pattern /
reflection). These apply to NEW/forward items, not completion reports.

### decision-blocked
- Tell: item names an action but requires an unmade decision first.
- Example: 'book October flights' — blocked on price / destination / aligning
  with wife.
- Behaviour:
  * Do NOT schedule the action (scheduling guarantees the skip — nothing to do yet).
  * Surface the blocking decision(s) at the approval gate.
  * Optionally schedule 'make the decision' ONLY if it's an actionable SOLO
    decision. If it needs another person, it's a 'raise with X' nudge, not a
    calendar task.
- Do NOT try to distinguish 'genuinely blocked' from 'avoidance dressed as
  blocked' via cleverness. NAME the assumption at the gate ('treating this as
  decision-blocked on destination — correct?') and let Sridhar confirm.

### needs-decomposition
- Tell: big, unbounded, no obvious first move, high activation energy.
- Example: 'PR application'.
- Behaviour:
  * Do NOT schedule a big block ('PR — 2 hours').
  * Schedule ONLY 'define the first small sub-task of X — 15 min'.
  * Sub-tasks, once defined, re-enter as normal inbox items later.
- Principle: for a big task, the system's job is to make STARTING cheap, not to
  allocate time to FINISHING.

## CHANGE 3 — Essentialism question (in the reasoning step)

For EVERY task being scheduled, add to the reasoning: "Given the goal is
reclaiming time for what matters, does this earn a slot today, or is it a
default/non-essential?" For now ONLY surface the question at the gate
(e.g. 'ETF — 3rd day scheduled, still worth it?'). NEVER auto-cut. Full confront
logic is a later build.

## NOT IN SCOPE TODAY (note for confront build, do NOT build now)
Real data shows a state beyond the categories above: items that were ALREADY
decomposed AND still skipped repeatedly (PR: 'define one small task' framing,
still skipped every day; reflux pills: 'forgot' repeatedly, reminders judged too
weak). That is NOT a planning problem — it's a CONFRONT trigger. Note it, do not
try to solve it in the classifier.

## BUILD DISCIPLINE (this is the largest single edit to the file — take care)
1. Apply all three changes via Claude Code in ONE editing pass.
2. Do a FULL read-back of plan-my-day.md before saving — watch specifically for:
   step renumbering errors, duplicated blocks (burned twice before).
3. Confirm frontmatter (opening + closing ---) intact.
4. Commit via Claude Code only. NO GitHub web edits (caused a force-push cleanup
   last time).
5. Test with: a decision-blocked item (flights), a needs-decomposition item (a
   fresh big task), and a next-morning completion report (to exercise the date rule).

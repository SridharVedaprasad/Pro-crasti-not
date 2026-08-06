# Carry-Forward Unfinished Tasks — BUILD PATCH (apply to plan-my-day.md)

> Fixes the "foot corn" bug: skipped/incomplete one-off tasks silently vanish
> after being archived, instead of re-surfacing until done or explicitly dropped.
> Diagnosed from real data: foot corn scheduled once (28 Jul), skipped
> ("no time"), then never appeared again — not done, not rescheduled, gone.
> For a system whose whole purpose is that things DON'T slip, this is a core hole.

## THE BUG (root cause)
/plan-my-day reconciles what's in inbox + on the calendar. Once a one-off task is
skipped and its inbox entry archived, nothing carries it forward. There is no
"still owed" list. Skipped non-recurring tasks fall into a void.

## WHERE IT GOES
A new pass early in /plan-my-day, during/just after completion reconciliation
(the step that reads completions.jsonl), BEFORE presenting the plan. It produces
a "carry-forward candidates" list that feeds the approval gate.

## THE RULE
1. Read completions.jsonl across all history.
2. Find items where:
   - kind = "planned", AND
   - most recent status for that exact item title is "skipped" or "partial", AND
   - there is NO later entry for that same exact title with status "done".
   (i.e. the task was attempted-and-not-finished and has never since completed.)
3. EXCLUDE:
   - Recurring anchors (dinner, gym, pills, wind-down, breakfast, lunch) — these
     recur by nature; a missed instance isn't an "unfinished task" to carry
     forward. Treat anything that appears on most days, or is tagged as a daily
     anchor in brain.md, as recurring.
   - Anything already re-scheduled on today's calendar (don't double-surface).
   - Anything Sridhar has explicitly dropped (see "dropped list" below).
4. The remaining items are CARRY-FORWARD CANDIDATES: real one-off tasks that were
   started-or-skipped and never finished.

## EXACT-MATCH CONSISTENCY (reuse confront's rule, same reasoning)
- Match by exact item title, NOT fuzzy. Same rationale as confront: real
  decomposition produces genuinely different sub-task titles and must not be
  lumped. (Known shared limitation: cosmetic retitling evades exact-match here
  too. Acceptable for v1; the item_key fix — deferred — would fix both at once.)

## WHAT HAPPENS AT THE GATE
Add a "Carried forward (unfinished)" section to the approval gate, shown with the
plan. For each candidate:
  - item title, when it was last attempted, the skip/partial reason.
  - propose ONE of:
    a) reschedule it today (if it fits and Sridhar wants it), OR
    b) if it has ALSO hit the confront threshold (3+ skips) -> hand off to
       confront's routing instead of just re-proposing the same block
       (non-essential -> cut / matters-broken -> change mechanism /
       blocked -> decompose). Do NOT double-handle: if confront already owns it,
       carry-forward just notes "see Confront above."
  - Sridhar decides per item: reschedule / drop / leave for later.

## THE "DROPPED LIST" (so dropped items don't nag forever)
- If Sridhar says "drop it", the item must NOT keep re-surfacing every day.
- On a drop: append a brain.md Pattern Log row recording the deliberate drop +
  date + (if given) reason. Carry-forward MUST check this before surfacing —
  an item with a logged "dropped" decision is excluded from candidates.
- This makes a drop a deliberate, recorded act (not a silent vanish) — the exact
  opposite of the current bug.

## INTERACTION WITH CONFRONT (keep them clean, no double-handling)
- Carry-forward = "unfinished, surface it so it doesn't vanish" (fires on 1+ miss).
- Confront = "repeatedly skipped, something's wrong, route it" (fires on 3+).
- If an item qualifies for BOTH: Confront owns the recommendation; carry-forward
  just ensures it's visible and defers to Confront's routing. One item, one
  recommendation at the gate — never two competing ones.

## AUDIT
- When a carried-forward item is rescheduled -> normal calendar_create, note
  "carry-forward" in notes.
- When dropped -> brain_update (the Pattern Log drop row), note "carry-forward
  drop" + reason. No new action_type.

## HARD SAFEGUARDS
- Carry-forward NEVER auto-reschedules or auto-drops. Surfaces + proposes only.
  Sridhar decides each. Same human-in-the-loop rule as everything else.
- NEVER infer a skip from an ABSENT completions entry (same data-integrity rule
  as confront). Only act on explicit kind:"planned" status:"skipped"/"partial".
  A never-scheduled item is not an unfinished task. (Protects against the missing-
  dinner bug corrupting this too.)

## BUILD DISCIPLINE
1. Apply via Claude Code in one pass.
2. FULL read-back before saving — watch step renumbering + duplicated blocks
   (burned before; the file is getting long, extra care).
3. Frontmatter intact.
4. Commit via Claude Code only. No web edits.
5. TEST is immediate + real: foot corn is in completions.jsonl (skipped 28 Jul,
   never done since) -> should appear as a carry-forward candidate at the gate.
   Confirm: (a) it surfaces, (b) recurring anchors like dinner/pills do NOT
   surface as carry-forward, (c) PR — if it's hit 3+ skips — is handled by
   Confront, not double-surfaced here.

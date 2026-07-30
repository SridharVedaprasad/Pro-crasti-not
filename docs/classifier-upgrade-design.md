# Classifier Upgrade — Design Spec (for build TOMORROW, not tonight)

> Drafted 2026-07-28 while examples fresh. Review with clear head before building.
> Addresses the reframe: scheduling was never the bottleneck. Activation energy
> on big tasks + decisions-disguised-as-tasks are. This upgrade targets both.

## Two new classification categories in /plan-my-day (Step 5)

### decision-blocked
- **Tell:** names an action, but doing it requires an unmade decision.
- **Example:** "book October flights" — blocked on price threshold, destination,
  alignment with wife.
- **Behaviour:**
  - Do NOT schedule the action (scheduling it guarantees the skip — nothing to do yet).
  - Surface the blocking decision(s) at the approval gate.
  - Optionally schedule "make the decision" ONLY if it's an actionable solo decision.
    If it needs another person (e.g. wife), it's a "raise with X" nudge, not a
    calendar task.
- **Hard part:** "genuinely blocked" vs "calling indecision a blocker to avoid
  starting" look identical in text. DO NOT try to solve with cleverness. System
  NAMES its assumption at the gate ("treating this as decision-blocked on
  destination — correct?") and lets Sridhar confirm. Human-in-the-loop, same as
  everything else.

### needs-decomposition
- **Tell:** big, unbounded, no obvious first move, high activation energy.
- **Example:** "PR application" — real deadline, can't do in one sitting, never starts.
- **Behaviour:**
  - Do NOT schedule a big scary block ("PR — 2 hours").
  - Schedule ONLY "define the first small sub-task of X — 15 min."
  - Sub-tasks, once defined, re-enter as normal inbox items and get scheduled normally.
- **Principle to state in the command:** for a big task, the system's job is to make
  STARTING cheap, not to allocate time to FINISHING.

## Essentialism lens (reasoning step, not a category)
- Add to reasoning for EVERY task: "given the goal is reclaiming time for what
  matters, does this earn a slot today, or is it a default/non-essential?"
- For now: only SURFACE the question at the gate ("ETF — 3rd day scheduled, still
  worth it?"). NEVER auto-cut. Full confront logic is a later build (needs data).

## THE UNSOLVED INTERACTION — design carefully tomorrow, do NOT rush
- decision-blocked and needs-decomposition must interact cleanly with:
  (a) the existing 4 categories (task / preference / pattern / reflection)
  (b) the completion loop's planned-vs-unplanned reconciliation.
- Concrete ambiguity: "PR application still not started" — is that a completion
  report (planned-skipped) OR a needs-decomposition signal? Possibly BOTH.
- This is exactly the kind of overlap that produces a spec contradiction if rushed
  (cf. the "STEP 4.5" ordering bug from earlier today).
- RESOLVE explicitly tomorrow: define precedence/ordering between completion
  reconciliation (Step 4), new-category classification (Step 5), and how a single
  entry can legitimately produce BOTH a completion record AND a decomposition action.

## Build sequence tomorrow
1. Resolve the interaction above FIRST (on paper, before touching the command).
2. Patch plan-my-day.md Step 5 with the two new categories.
3. Add the essentialism question to the reasoning step.
4. Review full file read-back (watch for renumbering / duplication — burned twice already).
5. Commit via Claude Code, push (edit in ONE place — no web edits).
6. Test with a real decision-blocked item (flights) and a needs-decomposition item (PR).

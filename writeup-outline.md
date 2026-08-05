# Pro-crasti-not — Write-up Outline & Framing
# (Captured 2026-08-XX. Draft from THIS tomorrow — don't reconstruct the thinking.)

## What this is
- Consulting-credibility piece. Publish: LinkedIn (short teaser) + Substack (long form).
- Audience: prospective consulting clients — mid-sized telco software vendors navigating AI.
- Tone: authentic. The personal failure (PR avoidance) is IN, on purpose. Authenticity
  is what earns the right to make the bold consulting claim at the end.

## The core reframe (this is what makes it consulting IP, not a build-log)
- It is NOT "I built a productivity tool." It IS "I ran an experiment on the hardest,
  least-forgiving user I had — myself — about the real problem of AI agents:
  calibrated trust in a self-correcting model of the person being served."
- The build is EVIDENCE. The point is the point of view.

## The through-line (one sentence)
A truthful, self-correcting model of the user + calibrated trust in that model =
the actual hard problem of AI agents. Everyone's underinvesting in it.

## Spine (6 sections)

### 1. Hook — the mirror moment
Open mid-scene with the PR-avoidance finding. Draft line to react to:
"I built an AI system to plan my days. Three weeks in, it quietly informed me I'd
been avoiding one task for seven days straight — and had been renaming it a little
differently each morning so I wouldn't notice."
Why it works: nobody expects the productivity-tool post to open with the tool
catching its builder lying to himself. Stops the scroll.

### 2. The turn — I was solving the wrong problem
- Set out to build a scheduler. It worked perfectly and changed nothing.
- Scheduling was never the bottleneck: activation energy on big tasks, decisions
  disguised as to-dos, non-essentials eating time.
- Reframe: from "organize my time" to "remove friction and confront avoidance."

### 3. Personalization is a feedback loop, not a preferences file
- The system got useful NOT when I told it my preferences, but when it tracked the
  GAP between what I planned and what I actually did.
- Preferences I *set* were often aspirational fiction (I "prefer" PR in the evening —
  never did it). The preferences that mattered were INFERRED from behaviour.
- Time optimisation / focus didn't come from better scheduling — from the system
  noticing where time actually leaked and where intention diverged from behaviour.
- Consulting hook: most companies ship an AI agent with an onboarding questionnaire
  and call it personalization. Real personalization is a loop that CLOSES — act,
  observe outcome, update the model. The preferences file is the least important part.

### 4. The real subject — trust boundaries for AI agents
- Every design choice — approval gate, audit log, supervised-vs-autonomous,
  confront-never-auto-cuts — was really about ONE question: how much do you let the
  agent decide, and how do you stay in the loop without drowning in approvals?
- Ties to #3: you can't fully automate because the model of the user is always
  provisional and sometimes wrong (exact-match hole, miscategorisations). A human
  stays in the loop to correct the model. Trust boundaries and personalization are
  the SAME problem.

### 5. Honest limitations (this earns credibility for 1-4)
- The exact-match hole: confront's blind spot was exactly where it mattered most —
  PR hid by being cosmetically retitled daily. The best feature had a hole at the
  worst place.
- Mac-dependency failures, the silent capture drops.
- The point: including the failures is what makes the claims trustworthy.

### 6. Close — the so-what (make it HEAVY; this was the weak part, now fixed)
Three moves, in order:
  a. NAME the expensive mistake: companies race to make agents more AUTONOMOUS,
     when the thing blocking adoption is that the agent's model of the user/business
     is wrong in ways nobody measures — and every confident-but-wrong action burns
     trust that's expensive to rebuild.
  b. The PRESCRIPTION (counterintuitive): you don't earn the right to automate by
     making the agent smarter. You earn it by instrumenting the GAP between what the
     agent thinks and what actually happened, and letting that measured gap govern
     how much autonomy you grant. Autonomy = f(measured trust), not f(capability).
     Most companies turn up autonomy based on how impressive the demo was. Backwards.
  c. The PROOF: I didn't theorise this. I ran it on the least-forgiving user I had —
     myself. The system's most valuable output wasn't efficiency. It was catching me
     lying to myself — which is exactly the capability every business needs from an
     agent and nobody's building: the willingness to surface the uncomfortable truth
     instead of optimising around it.
Posture: this is an ASSERTION, not a musing. The authenticity in #1 and #5 earns it.

## Draft order tomorrow (decompose — don't "write the write-up")
1. FIRST: draft the opening hook only (~30 min). If it lands, the rest follows.
2. Then section 6 (the so-what) — it's the spine's destination; write it early so
   everything points at it.
3. Then 2 -> 3 -> 4 -> 5 to connect hook to close.
4. Substack long form first (~1500-2500 words). LinkedIn teaser is cut from it after.

## Watch-outs
- Don't let "personalization" go fluffy — it's an epistemic claim (truthful self-
  correcting model), not a feature claim.
- Don't lead with architecture. Architecture is evidence, deployed only where it
  proves a point about trust/personalization.
- Don't hedge the close. A consulting-credibility piece that softens its central
  claim isn't credible.

## ============================================================
## HOOK — DRAFTED (react-to-able opening, 2 versions)
## ============================================================

### Structural decision: abstract hook, concrete reveal later
- Open ABSTRACT (task described by its SHAPE, not its identity) so every reader
  maps their own avoided task onto it — "I do that."
- REVEAL the real, lightly-disguised task later (§2 or §3): e.g. "a residency
  application that had sat open for months — real deadline, real consequences,
  no clean first move." Lightly disguised, not fully anonymous (relatability).
- Sequence: abstraction earns the recognition; specificity earns the trust.
  Also gives the long Substack read a second beat of intimacy partway through.
- DON'T FORGET: the hook sets up a debt the piece must pay off — surface the
  concrete task in §2/§3, don't leave it abstract the whole way.

### Version A — LinkedIn (punchy; NOTE: wants a punchier rework later)
"I spent my sabbatical building an AI system to plan my days. Three weeks in, it
told me something I'd been hiding from myself: there was a task — the kind
everyone has one of, important and overdue and somehow never the thing you do
today — that I hadn't touched in seven days. Not once. And every morning, without
quite admitting why, I'd been renaming it on my list, a slightly different label
each day, just different enough that I wouldn't notice it was the same thing I
kept refusing to do.

The system noticed. That was the moment I realized I'd built the wrong thing —
and stumbled into something far more useful."

[TODO later: make the LinkedIn open punchier — shorter first line, faster to the
mirror. The above is the Substack-flavoured version; LinkedIn wants more snap.]

### Version B — Substack (slower burn; thesis planted in beats 2-3)
"I set out to build an AI system that would make me more productive on my
sabbatical. It worked, in the narrow sense: my days filled with tidy, sensible
calendar blocks. Gym at 8:30, project work after lunch, wind-down before bed.
Everything in its place.

And it changed almost nothing about what I actually got done.

The system's most valuable act had nothing to do with scheduling. Three weeks in,
it quietly pointed out that I'd avoided one task for seven straight days — the
kind everyone has one of, important and overdue and never quite today's problem.
And that I'd been renaming it each morning, a little differently each time, so I
wouldn't have to notice I kept refusing to start. It was the one thing I least
wanted to see, and the only thing worth seeing."

Why B is the stronger consulting open: beats 2-3 ("it worked... and changed
almost nothing") plant the whole "solving the wrong problem" thesis before it's
ever named. The reader FEELS the gap between working and useful before you argue
it. A spends the confession as entertainment; B spends it as evidence.

### Anchor phrase (the concrete-but-universal bit)
Chosen: "the kind everyone has one of, important and overdue and somehow never
the thing you do today." "Everyone has one of" does the relatability work
explicitly; "never the thing you do today" is the texture of avoidance with no
specifics. Punchier fallback for LinkedIn: "important, overdue, and never quite
today's problem."

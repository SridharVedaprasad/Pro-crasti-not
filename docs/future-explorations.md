# Future Explorations (parked — do NOT act on during current sabbatical scope)

> Ideas worth revisiting after the current project ships (post Aug 10).
> Parked deliberately to avoid shiny-object scope creep mid-sabbatical.

---

## Monetization: "personal ops / declutter" as a product

**Raised:** 22 Jul 2026, mid-build.

**The idea:** Turn Pro-crasti-not into a monetizable app that helps people plan
their days and declutter their lives.

**The reframe (important):** The instinct to split brain.md's sections (gym,
nutrition, sleep, family, leisure) into separate apps is a trap — that rebuilds
the crowded, commoditized wellness-app market. The actually-differentiated thing
here is the **orchestration layer**: reasoning ACROSS categories about tradeoffs
("gym at 8:30, PR paperwork due, you crash without a mid-morning snack → here's
the sequence"). The categories are commodity; the cross-category reasoning is
the moat.

**Biggest risks to de-risk BEFORE writing any product code:**
1. **Daily-discipline problem.** The core loop asks users to do two effortful
   things every day (capture + approve). Most people won't. This — not features —
   is the likely killer. Retention is the whole game.
2. **Sample size of one.** No evidence anyone but Sridhar wants this. Pattern-
   matching from a single unusually-motivated user mid-sabbatical is a hypothesis,
   not a market.

**How to test cheaply (no engineering):**
- Give 5 STRANGERS (not friends) a stripped-down / Wizard-of-Oz version where
  Sridhar manually plays the "AI." See if even 1 in 5 will dictate for a week.
- If 4/5 drop off by day 3, answer's clear, zero code spent.

**Architectural reality if pursued:** Current design (Apps Script in Sridhar's
own Google account, single brain.md, personal Groq key, markdown files) does NOT
scale into a product by growing — it gets rebuilt: auth, per-user data isolation,
real backend + database, per-user secrets. The markdown-file simplicity that
makes this elegant for one user is exactly what doesn't survive multi-tenancy.
Monetizing means keeping the IDEA and rewriting most of the implementation.

**Strategic note:** The higher-value output of this project is likely the
consulting credibility + public write-up (already in PROJECT_BRIEF.md), not a
wellness app competing with Notion/Motion/Reclaim/etc. Revisit the product
question with the 5-stranger test AFTER the sabbatical ships — not as a mid-
sabbatical pivot.

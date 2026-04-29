# Kelp UX Review — Process Notes

## The Brief

Evaluate the home screen of Kelp, an enterprise platform used by Private Equity professionals. Identify what works, what doesn't, and recommend improvements — either through cross-domain references or low-fidelity explorations. Time constraint: 4 hours.

---

## What We Actually Did

The 4-hour brief became something closer to a full design sprint. We treated the constraint as a forcing function for prioritisation, not a ceiling on depth.

### Phase 1 — Domain Research

Before touching the interface, we grounded the critique in domain knowledge. PE deal teams are not generic knowledge workers. They manage 4–8 active deals simultaneously at different risk stages, operate under IC deadlines, manage counterparty relationships, and work in a seniority structure where decision accountability and execution responsibility sit at different levels. A missed signal in this context isn't a productivity issue — it's measured in deal value.

We also researched Kelp directly — product positioning, integration ecosystem, stated AI capabilities. This created an immediate tension: Kelp markets itself as an AI-powered decision intelligence platform, but the provided screenshot showed no visible evidence of AI. One buried label ("suggestion based on your meeting") was the only exception. This gap became the central finding.

### Phase 2 — Persona Development

Rather than generic user archetypes, we built two personas derived from three sources simultaneously: the visible UI (what features exist tells you who the product thinks its user is), PE firm domain knowledge, and Kelp's own product positioning.

**Priya, VP — Decision Maker.** Opens Kelp at 7am, 20 minutes before back-to-back calls, managing 4–6 active deals. Needs to know what requires her specifically — not what's happening, but what's blocked without her. Thinks in deals and risk, not tasks and dates.

**Rohan, Analyst — Executor.** Gets to his desk and checks what's been assigned overnight across deals from two VPs. Needs priority with context — not "urgent" but "urgent because IC is in 4 days." Currently executing blind: same flat list as Priya, no context for why tasks matter.

The design tension between them — Priya needs signals to decide, Rohan needs context to execute — became the frame for every recommendation.

### Phase 3 — Heuristic Review

We reviewed each panel against what it was trying to do versus what it actually did, with direct comparison to how other tools solve the same problem.

**Relevant Links** was diagnosed as a browser bookmark bar — answering "where have I been?" instead of "where should I go?" The DPM/TPM/My Deals tabs were identified as org-chart navigation fragments, not work-mode filters. The one AI suggestion was present but visually indistinguishable from recency-sorted history items.

**Deadlines & Follow Ups** had its hierarchy completely inverted — the backlog (inventory, 20 items) was the most prominent element on screen, while New Requests (decisions needed right now, 3 items) were a small count in the header. Date sorting was identified as the wrong axis for PE: urgency in this domain is signal-based, not time-based. Tasks carried no consequence framing — facts without decisions.

**Schedule** was a narrower Google Calendar. The JOIN button and inline RSVP controls were the only elements that added something the user didn't already have on their phone. The vertical layout required scrolling to see a full day, which meant the day-overview panel failed at giving an overview precisely on busy days — when you needed it most. Meetings were entirely disconnected from deals, tasks, and prep context.

### Phase 4 — Synthesis

Every panel was failing the same way. We articulated it as a single thesis: the screen records activity, it does not generate insight. This became the spine of the case study.

We derived five design principles from the failure modes — Signal over history, Consequence over date, Decisions not data, Intelligence must be visible, Context travels with work — each mapped to specific panels and used to justify every recommendation.

### Phase 5 — Prototype Exploration

To validate that the recommendations were achievable and not just theoretical, we built a working prototype called Deal OS. The brief asked for low-fidelity — we went further because we needed to test whether the intelligence-first model actually worked in practice.

The prototype implemented:

- A **context mode system** — Deal Execution, Portfolio Monitoring, Sourcing — replacing the DPM/TPM org-chart tabs. Each mode reframes the entire screen, not just filters it. Different editorial lens, not different data.
- A **decision-weighted work queue** — New Requests as an acceptance inbox (accept/reassign/defer), Active Work consequence-sorted with signal on every card, Backlog collapsed and surfaced by staleness.
- **Contextual action cards** in the deal detail view — each task carries its signal, what's at stake, and a pre-written next action specific to the task type (follow-up drafts, document summaries, escalation paths).
- A **deal intelligence feed** connected to tasks — each signal row has "→ Create task" that opens the task modal with deal, urgency, signal, and context pre-filled. Gap between "system detected something" and "user took action" collapses to one click.
- A **time intelligence layer** — compact timeline (full day visible without scrolling), AI-protected focus blocks with reasoning, meetings connected to deals.
- An **AI command bar** — the interface proof point for the product's core claim. Querying "What are the biggest risks today?" returns "Highest risk: Nebula SaaS counterparty silent 48h. Recommend follow-up before 11am." That is what an AI-powered home screen should look like.

The prototype was built as a React component with full interactivity — toasts, slide panels, modals, functional task acceptance, backlog scheduling, filter composition, mode switching, and deal detail views with per-deal data.

### Phase 6 — Documentation

The case study was built as a self-contained HTML file with 23 embedded screenshots — no external assets required. The document was designed to be read in 2 minutes by a senior evaluator.

We went through two full rebuilds of the document. The first version was textually heavy — analysis-style prose that read like a report. The second version cut prose by ~65% and restructured every section around the skim-read path: thesis → screenshot + annotation chips → compact comparison table → reference screenshots → one-line persona impact.

Cross-domain references were rendered as UI mockups (Linear, Superhuman, Slack, Notion AI, GitHub PRs, Fantastical, Reclaim.ai) — built accurately from the real UI patterns since external sites were inaccessible from the build environment. This was actually a better approach: the mockups use PE-context data, making the pattern immediately legible to the target reader.

---

## Key Decisions Made

**On the AI assumption:** We surfaced it prominently and early — not buried in an assumptions log but placed inside the core insight block where it lands with maximum impact. The framing was deliberate: "Talking about AI and building an AI-powered interface are two different things."

**On DPM/TPM:** Rather than assuming these were arbitrary abbreviations, we traced what they likely represent in a PE context (Deal Pipeline Management, Transaction Pipeline Management) and critiqued them not as wrong categories but as the wrong navigation model — org chart navigation versus work-mode navigation.

**On the prototype scope:** The brief asked for low-fi. We went higher fidelity because the most important claim — that an intelligence-first home screen is achievable, not just theoretical — needed to be demonstrated, not described. The prototype is the recommendation made tangible.

**On document density:** The senior UX evaluator reading this has seen hundreds of case studies. Long prose reads as a student trying to show work. Short, confident statements backed by visuals reads as a designer with a clear point of view. The rebuild prioritised the latter.

---

## What We'd Do Differently

The time constraint meant some things were left as assumptions rather than validated findings. In a real engagement:

- Contextual inquiry sessions with VPs and Analysts separately — watching the actual morning routine, not asking about it
- Signal inventory — auditing what data Kelp actually has access to before specifying what should be surfaced
- Card sorting on task taxonomy to validate the three-layer architecture
- Testing the acceptance inbox pattern for New Requests against actual VP behaviour
- Validating whether the mode-switching model matches how users actually context-switch during a deal day

The prototype also only fully builds out the Acme Corp Buyout deal — the other three deals (Nebula SaaS, Optima Logistics, Project Titan) have data and rail entries but less depth in their detail views. A production version would need full parity across all deals.

---

## Tools Used

- Claude — research, critique, prompt engineering, copywriting, HTML/CSS, React architecture
- Google AI Studio (Gemini) — React component generation from prompts
- Playwright — headless browser screenshots of the live prototype
- Python / Node.js — local serving, image encoding, file manipulation

---

## Files Delivered

| File | Description |
|---|---|
| `kelp-ux-review.html` | Self-contained case study (2.5MB, 23 embedded screenshots) |
| `deal-os-dashboard.zip` | Working React prototype source code |
| `process-notes.md` | This document |

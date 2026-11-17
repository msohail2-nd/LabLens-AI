# Project Prototype Revision — LabLens AI
**Milestone due:** November 19, 2026  
**Evidence status:** Draft documentation. Where a hands-on manual run has not been independently confirmed, the actual-result cell clearly says so. Do not present planned tests as conducted tests.

## 1. Target user and central task

Graduate students and research groups often need to reconstruct an experiment when notebooks, instrument results, and spreadsheet revisions disagree. LabLens AI is intended to help them retrieve evidence, summarize what the records support, and flag unresolved changes rather than silently inventing an explanation.

**Current implementation:** interactive sample records and simple local rule-based matching/flagging, plus beta signup. There is no deployed generative-model service. The illustrative dashboard is a mockup, not evidence of live AI synthesis.

## 2. Two or three priority improvements

1. **Make the core workflow testable.** Replace the former static-only Explore view with an interactive NiO-17 sample record flow that displays attributed source excerpts and an unresolved solvent-ratio question. This directly addresses peers unable to try record-to-summary interaction.
2. **Add controlled input and transparency.** Offer small, browser-local TXT/CSV inspection, distinguish sample/static/functional behavior, and state data-handling limits at the point of use. Avoid a server-side upload of confidential materials.
3. **Make results and limitations inspectable.** Add reproducible automated tests, README, risk response, five-scenario evaluation, and a draft AI-use disclosure. Prior feedback awarded no tests/limitations/README evidence.

## 3. Anonymized response to peer feedback

| Feedback / observation | Decision | What changed / why |
| --- | --- | --- |
| Explore product was an illustrative example, not a testable record-to-summary workflow | **Acted on** | Interactive fictional notes, source-linked excerpts, and a flagged contradiction; no claim of a real LLM |
| Visitors could not try their own data | **Adapted** | Optional local-only TXT/CSV proof of concept, with small-file limits. Broader PDF/instrument/multimodal ingestion deferred due to scope and confidentiality risk |
| AI should clarify conflicting or missing sources | **Acted on** | Display contrary ratio records and unresolved question rather than choosing a value; researcher can acknowledge review but not resolve/persist it |
| Users need to know what is working versus simulated | **Acted on** | Explicit prototype/status labels and limitations in site and documentation |
| Confidential research data raises trust questions | **Acted on in limited form** | Local-only sample parsing, no file persistence by design, and caution against sensitive uploads; a formal security audit remains undone |
| No README/tests/disclosure | **Acted on** | Replit code audit previously reported root README, 8 unit tests, limitation notes. GitHub must still receive the latest code before submission |

These are summaries of anonymous peer comments; no classmate names are published.

## 4. Five required evaluation cases

**Test notation:** Automated suite: Replit inspection on November 17 reported two test files and eight passing tests, but did not provide a per-case transcript establishing each scenario below. These scenarios require a final manual check in the built prototype. **Never equate a planned scenario with a completed trial.**

| Case | Input / action | Expected result / success criterion (set before trial) | Actual evidence available | Result | Implication / next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | Load fictional NiO-17 notes and search for solvent conditions | See readable source-linked notes and exact, attributable ratios | Replit code-level audit reports that sample reconstruction returns attributed 3:1 and 1:1 excerpts | **Partial — code audit; manual verification pending** | Run in browser and capture result screenshot |
| Typical 2 | Select a benign .txt or .csv file in local demo | Parse and display its text/rows without server upload or persistence | Replit audit reports local parsing for up to 3 files, 500 KB each; no observed browser/network check yet | **Partial — implementation reported; privacy check pending** | Use synthetic file; verify behavior and network requests |
| Challenge | Reconstruct experiment from records with conflicting 3:1 versus 1:1 solvent ratios | Show both supported sources and flag question as unresolved, without choosing a ratio | Replit code audit says a narrow solvent-ratio rule detects this contradiction | **Partial — code audit; manual verification pending** | Observe output and test an unsupported conflict pattern |
| Invalid / empty | No notes, unsupported extension, malformed or oversize file | Informative failure or empty-state without fabricated summary or crash | Test suite exists but exact scenario-by-scenario outputs were not provided | **Not yet verified** | Execute with empty input and invalid file, record actual message |
| Risk | Supply disagreeing research records; use review acknowledgement; monitor local-file network behavior | No unsupported experimental conclusion, original source still visible, no disclosure of file content to backend | Replit audit says review acknowledgement does not resolve/swap source and local parser is browser-only | **Partial — audit; end-to-end check pending** | Verify with browser Network tab; note absence of full security audit |

**Final operator instructions:** Before submitting, run each scenario against the exact public build, replace every placeholder with observed behavior and classify **Pass**, **Partial** or **Fail** using firsthand evidence. Record date, screenshot, console notes if relevant, and whether the test was manual or automated. If a scenario fails, keep its failure and explain the revision or deferral.

### Automated checks recorded during Replit inspection (not a replacement for five manual scenarios)
- Website tests: `pnpm --filter @workspace/lablens-ai run test` — **reported 2 files, 8 passing tests** on November 17.
- Website typecheck: `pnpm --filter @workspace/lablens-ai run typecheck` — **reported pass**.
- API typecheck: `pnpm --filter @workspace/api-server run typecheck` — **reported pass**.
- Production build: previous README reported successful build with minor warnings; **not independently rerun** in that inspection.
- API smoke checks: earlier audit reported health HTTP 200 and invalid beta signup HTTP 400, no real signup created.

Run these commands again against the final synced code and record the date, failures and logs.

## 5. Same-task before and after

**Task:** "Reconstruct the experiment's recorded conditions and explain which source supports them."

**Before (peer-observed older version):** Clicking Explore the product showed an illustrative dashboard; peers could examine a prepared suggestion but could not execute the record-to-summary step. The task could not be tested to completion.

**After (current Replit implementation described in code audit):** User loads fictional NiO-17 notes and CSV revision, then triggers a local deterministic reconstruction. Output references separate 3:1 and 1:1 solvent-ratio sources, and explicitly leaves the change unresolved. This is a meaningful interaction improvement, **not** proof of actual model accuracy. The revised flow still requires an end-to-end manual trial and screenshot.

## 6. Concrete risk response: research integrity and privacy

**Who is affected:** Researchers, advisors and research collaborators who might unknowingly reuse incorrect experimental conditions, and laboratories whose research files may contain confidential information.

**Failure mode:** A model-style summary could confidently choose one of two contradictory solvent ratios or imply a reason for a change without evidence. A careless upload feature could expose unpublished data.

**Implemented / demonstrated response per Replit audit:** The sample flow displays supporting excerpts, flags the contradictory ratio as unresolved, and permits review acknowledgement without rewriting the source or inventing a reason. Optional TXT/CSV files are intended to remain in browser memory and not be transmitted via the beta API. The UI states limits where the user is interacting.

**Residual risks:** Conflict detection is narrow, source association may be incomplete, the review action is not a persistent signed approval, and a browser-local implementation is not an independent security certification. The full confidentiality claim needs a network-level/manual check. This responds to course themes of **privacy, ownership, and over-reliance on AI**.

## 7. Evidence interpretation

The Replit audit supports that a narrow fictional record reconstruction and source-linked conflict display have been implemented; this should make the intended value easier to understand than a static dashboard. However, independent end-to-end user trials, network verification, accuracy on broader input varieties, and handling of authentic instrument datasets remain incomplete. Eight automated checks offer early engineering evidence, not proof of product reliability or of real AI performance. Next priorities: (1) finish five browser-level evaluations and document failures, (2) sync and verify current GitHub sources, (3) pilot the workflow with synthetic varied scientific records before contemplating secure model-assisted integration.

## 8. Demo script and recording checklist (2–3 minutes)

- **0:00–0:25 — User/problem.** "LabLens AI is for graduate researchers who inherit scattered notebook entries, CSV revisions and instrument files. Reconstructing what changed can be frustrating."
- **0:25–1:20 — Complete workflow.** Open demo, select fictional notes, initiate local reconstruction, read actual dated evidence excerpts. Point to conflicting 3:1/1:1 ratios and the unresolved prompt.
- **1:20–1:45 — Revision from feedback.** "Peers could only see the static example. We made record-to-source retrieval interactive and testable and included limited TXT/CSV input."
- **1:45–2:10 — AI role / ethics.** "The intended AI would connect and summarize records with citations. Today's working demo uses local deterministic rules; the dashboard is illustrative, and no LLM is connected. Researchers must confirm claims."
- **2:10–2:30 — Limitation and next step.** "The current conflict detector recognizes only narrow patterns. Next I will test more source conflicts and explore secure integrations."

Record voice and screen legibly. Use fictional records only. Upload the MP4 or MOV to Google Drive, grant viewing access to **ehughes8@nd.edu** and **ghuang3@nd.edu**, add the URL under README **Demo Video**, and submit the actual video file and GitHub repo link together in Canvas. The video is **not yet recorded**.

## 9. Remaining priorities and submission blockers

1. **Source synchronization:** GitHub main was on October 6, 2026 commit as of the last check; recent Replit changes need safe sync without overwriting history or exposing secrets.
2. **Manual verification:** Finish the five actual trial observations; re-run tests on synced source, update statuses and before/after evidence.
3. **Narrated demo / access:** Record demo, insert real Google Drive URL, grant both instructors access, submit MP4/MOV with repo to Canvas.

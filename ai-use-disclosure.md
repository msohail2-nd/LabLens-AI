# Draft AI-Use Disclosure — LabLens AI

**Status:** Draft for the November 19, 2026 Project Prototype Revision. The student should check this against their own development history and edit any inaccurate attribution before submitting. This account distinguishes verified tool actions from personal decisions that cannot be inferred.

## Tools and tasks

- **ChatGPT (OpenAI):** Used in this conversation to compare LabLens with LIMS, plan improvements from peer feedback and course instructions, draft explanations and request Replit updates, and prepare a reviewable set of assignment documents. The exact underlying model variant was not independently recorded in the project.
- **Replit Agent:** Used to inspect the React/Vite and Express/PostgreSQL project, revise the site and its interactive sample-note workflow, configure tests, and maintain Replit-side documentation. Replit code audit reported local rule-based retrieval and no live LLM integration.
- **GitHub connector in ChatGPT:** Used to inspect the public repository and prepare documentation on a separate submission branch. This is repository management assistance, not AI inside LabLens.

## Representative prompting and subsequent revision

| Representative request from the project conversation | Purpose / reported output | Scope or verification decision |
| --- | --- | --- |
| "position LabLens as an AI-powered research continuity and knowledge-retrieval platform that complements existing LIMS and electronic lab notebooks" | Clarify differentiation and website messaging | Avoid unsupported claims that LabLens replaces LIMS, beats competitors or already integrates with instruments |
| "Make one record-to-summary interaction testable" / "Try sample notes" | Request interactive fictional notes linked to evidence and an unresolved question | Rule-based local sample flow, not a real LLM output or verified model accuracy |
| "Tests (−17): none. Limitations (−13): none. AI role (−5): working-vs-simulated not stated" | Request runnable tests, a limitations/privacy section and a root README | Report actual runs only; disclose untested scenarios instead of claiming model reliability |

These prompt excerpts summarize actual conversational requests and peer/grader feedback. Any AI-generated code, documents and interface wording should be reviewed and revised by the student prior to submission.

## Human judgment and scope choices

The project direction deliberately does **not** infer which of two contradictory experimental solvent ratios is correct; it presents both attributed source records and flags the issue for researcher review. It also favors a limited browser-local TXT/CSV demo over uploading real confidential scientific data into an unverified backend. These are project design constraints carried through the instructions to Replit Agent. The student should add a firsthand account here of any specific AI suggestion personally rejected or edited, describing what they changed and why; do not present these conversational constraints as independent evidence of completed student verification.

## AI inside the product: intended versus current

**Intended AI task:** Receive authorized notebook excerpts, experimental metadata, instrument-data references, and revision history; identify related records, reconstruct a source-cited overview of the experiment, and flag conflicts or missing reasons. The intended value is faster, more accountable recovery of research context, subject to human review and appropriate data-handling safeguards.

**Current functional prototype:** Local deterministic text search, sample data and limited rule-based solvent-ratio conflict highlighting. The fictional sample material and dashboard illustrate the future experience. There is **no configured generative LLM, model-derived scientific conclusion, production multimodal synthesis, or evaluated model accuracy** in this prototype.

**Planned:** Model-driven synthesis with evidence/citation checking, researcher approval, access controls, integration with selected existing systems, evaluation on diverse de-identified cases and formal data-security analysis. These are not demonstrated capabilities.

## Verification and remaining checks

A Replit code-level audit on November 17 reported **8 passing automated tests across 2 files**, and passing website/API typechecks. Its earlier API checks reported health HTTP 200 and invalid-signup HTTP 400. The recorded tests verify limited software behavior; they do **not** establish accuracy of a generative model. The five required distinct end-to-end evaluations in [revision.md](revision.md) still need actual recorded manual outcomes.

Before submission:
- Review actual current code against this account and rerun tests.
- Test the complete workflow in the published prototype; record what happened in all five required cases.
- Verify local-file data flow through browser network inspection if claiming files do not leave the browser.
- Confirm GitHub and Replit source synchronization.
- Remove any credentials, private lab records, names of peer reviewers, and identifying beta signups from public materials.
- Add specific personal human decisions and real verification evidence as appropriate.

## Limitations

The current system is a prototype and is not suitable for confidential experiments or regulated laboratory operations. It has narrow data formats and conflict rules, does not connect to a real ELN/LIMS or NMR/XRD data source, and its review acknowledgement is not an auditable approval. No live model output was tested.

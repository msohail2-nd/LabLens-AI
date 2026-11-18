# AI-Use Disclosure (Draft for Student Review)

This disclosure describes the AI assistance visible in this Replit project history. Review and correct it before submitting; do not claim personal verification that you did not perform.

## Tools used

- **Replit Agent:** Used in this Replit workspace to inspect and revise the LabLens page, add deterministic browser-side demo code and automated tests, and draft project documentation.
- **Underlying model name:** Not available in the project history, so no model name is claimed.
- **ChatGPT and GitHub connector:** ChatGPT helped plan the LIMS comparison and prototype revisions, interpret peer and rubric feedback, draft the narrated demo script and course documentation, inspect the public repository, and update files through the connected GitHub tool. These actions are documented in the project conversation. The student should still review and correct this disclosure before submission.

## Representative instructions

These short excerpts are taken from the project prompts:

1. “Update my existing LabLens AI landing page to position LabLens as an AI-powered research continuity and knowledge-retrieval platform that complements existing LIMS and electronic lab notebooks, rather than replacing them.”
2. “Add a prominent interactive 'Try the research demo' or 'Try sample notes' flow linked from the hero/Explore product.”
3. “The previously requested demo + 8 passing tests are already there; reuse and expand rather than redesign.”

The third excerpt is a historical instruction from before the five evaluation cases were added. The latest recorded suite has **13 passing tests across 3 files**; “8” is not the current count.

## Assistance and resulting work

Replit Agent helped inspect the existing React/Vite site and Express/PostgreSQL signup flow; implement the local deterministic NiO-17 evidence demo and TXT/CSV parser; add Vitest/React Testing Library coverage; and draft the README, evaluation report, and recording storyboard. The course instructions and repository task supplied the product scope and constraints.

The demo behavior is rule-based TypeScript, not AI output. No model-generated research summary, model endpoint, or multimodal processing is present. The static dashboard is illustrative.

## Human direction and decisions

The project instructions specified that LabLens should complement LIMS/ELNs, not claim to replace them; that the demo must not guess which conflicting solvent ratio is correct; and that optional files should be handled locally rather than uploaded. Those constraints were implemented. In response to a peer suggestion to upload arbitrary data, the implemented scope was deliberately adapted to limited browser-local TXT/CSV handling rather than sending confidential research records to a new server. This document does not claim that the student independently reviewed every code change or personally performed the automated tests.

The no-guessing and local-only choices are prompt-specified design decisions for the student to review before submission; they are not evidence of a separate post-implementation approval.

The report’s “after” observations are primarily tied to the automated tests in `revision.md`. The project owner also personally opened the published demo, inspected NiO-17 evidence and the unresolved review question, and shared screenshots from that browser walkthrough on November 17. The owner recorded a narrated demonstration and reports sharing it with the instructors. This user testing is narrower than a full code review or security audit.

## Verification and outstanding work

The executed checks and their outcomes are recorded in `revision.md` and `README.md`. The test harness verifies five representative cases, including a local file-input component path; it is not a manual test in a real browser and does not establish scientific correctness or comprehensive privacy protection.

Outstanding: the student should review this disclosure in their own words, verify that the invited instructors can play the linked Google Drive recording, confirm the published site and GitHub links, and submit the actual video file plus repository URL to Canvas. The GitHub source merge is already published. No complete real-browser upload/network audit or live AI-model evaluation has been performed.

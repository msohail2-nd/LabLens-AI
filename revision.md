# Project Prototype Revision

**Course revision due:** November 19, 2026
**Project:** LabLens AI
**Prototype:** [Open the current LabLens AI site](https://lab-lens-ai-landing-page.replit.app)
**Audience:** Graduate researchers, academic laboratories, and industrial R&D teams

## Product, intended user, and problem

LabLens AI is a proposed research-continuity and knowledge-retrieval layer intended to complement LIMS and electronic lab notebooks (ELNs), not replace them. Research evidence can be split across notebooks, instrument exports, PDFs, spreadsheets, and project folders. The current site is a beta-interest landing page with an interactive, local rule-based prototype. It does not connect to real laboratory systems or use generative AI.

## Prioritized revisions

1. **Make the research-record workflow executable.** Visitors can load fictional notes and a dated revision CSV, search for the experiment, and inspect evidence cards with exact excerpts, dates, and attributions. This responds to feedback that the site previously showed only a landing page and static product concept.
2. **Make uncertainty and privacy visible in the interaction.** The demo exposes the 3:1/1:1 conflict and missing reason, does not choose a value, and keeps the review question open after acknowledgement. Optional TXT/CSV files are parsed in page memory, not submitted to the beta form or API.
3. **Make evaluation and implementation status inspectable.** Added five named automated evaluation cases, a revision report, this AI-use disclosure, and a timed recording storyboard. README explains how to run checks and what remains simulated or planned.

## Anonymized feedback and response

| Anonymous feedback / grading signal | Decision | What changed |
| --- | --- | --- |
| Peer requested a testable record-to-summary flow with source excerpt and unresolved question. | Acted | Added “Try sample notes,” deterministic search, source cards, and an open review question. |
| Peer asked for a user-upload test and privacy transparency. | Adapted | Added optional local `.txt`/`.csv` parsing with file-count and size limits. Files remain in page memory; automated UI tests assert no `fetch` call in the tested flow. No confidential files should be used. |
| Peers wanted conflicts to be visible rather than silently reconciled. | Acted | Sample notes and CSV contain different solvent ratios. The result shows both and says it will not choose or infer an answer. |
| Peer requested clarity on trust, limitations, and data handling. | Acted | Added explicit source-supported facts, “Needs review,” “Works today / Simulated here / Planned,” and limitations/privacy language. |
| Peer requested a README describing working vs. simulated features and signup data flow. | Acted | Added root README with architecture, setup, user journey, privacy/data flow, limitations, tests, video placeholder, and Git sync instructions. |
| Prior grading feedback: Tests −17, Limitations −13, AI role −5, Flow −5, README −3. | Acted | Added repeatable tests, a five-case evaluation, explicit non-LLM disclosure, an interactive path, and linked documentation. This report does not claim a new grade or predict a grading outcome. |

## Five executed evaluation cases

All five cases below are **automated component-level tests** run with Vitest, jsdom, and React Testing Library. Their inputs, actions, and expected criteria are encoded in `artifacts/lablens-ai/src/components/research-demo.evaluation.test.tsx`. The browser-file harness supplies the `File.text()` method because jsdom does not consistently implement that browser API. No manual evaluation in a real browser is claimed here.

Executed command: `pnpm --filter @workspace/lablens-ai run test`.

| Case | Input / action | Expected success criterion | Actual observed result | Outcome | Implication / next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 — sample retrieval | Click **Try sample notes**, then **Find record** for the prefilled NiO-17 query. | Result includes a dated source, fictional attribution, and source excerpt containing its referenced NMR file. | Test found “Notebook · NiO-17 baseline,” date `2026-04-14`, attribution “Fictional researcher: Mira Chen,” and `nmr_NiO17_01.csv` in the rendered evidence overview. | Pass | The sample-to-evidence interaction is executable and source-labeled. This is not a test of cross-tool retrieval. |
| Typical 2 — local TXT/CSV | Select a TXT note and CSV revision file through the file input, search `NiO-22`. | Render the note evidence in-page and make no `fetch` request for the selected file content. | UI test loaded two selected files, rendered `Temperature: 40 C`, and its stubbed `fetch` spy was not called. | Pass | The component flow uses local parsing. The harness does not test every browser egress path or a production network proxy. |
| Challenge — conflicting conditions | Load the bundled NiO-17 notes and CSV, then inspect the result. | Show both 3:1 and 1:1, surface the missing rationale, and do not choose or infer a correct value. | Test found both ratios, the “reason for the change is not recorded” message, and “will not choose or infer an answer.” | Pass | The intended uncertainty behavior is covered for this specific solvent-ratio pattern only. |
| Invalid/empty — safe failure | Select an empty TXT file, malformed CSV with inconsistent columns, and unsupported PDF in turn. | Each input produces a visible error rather than an evidence result. | The UI displayed the empty-file, equal-column-count, and allowed-extension errors for the respective inputs. | Pass | These representative failures are handled. This is not exhaustive validation of every malformed spreadsheet encoding. |
| Risk — guessed conditions / disclosure | Load NiO-17, inspect both ratio excerpts, acknowledge review, and observe the unresolved issue and `fetch` spy. | Keep both excerpts visible, keep the question open after review, and send no request from this interaction. | Test found both exact ratio excerpts, the “Needs review” section, an acknowledgement that says the question remains open, and zero calls to the stubbed `fetch`. | Pass | A specific over-reliance safeguard is exercised. This does not prove privacy against browser extensions, all telemetry channels, or future code changes. |

### Same task: before and after

**Task used for comparison:** “Locate the supporting records for an experiment whose conditions changed, and identify whether the reason for the change is documented.” This keeps the **user task** constant between versions. The before-view illustration used B7–B8; the revised executable demonstration uses fictional NiO-17, so this is **not** an identical-input experiment or a controlled comparison.

**Before:** Peer feedback and the prior project view described a static illustrative dashboard. Its concept text mentioned the B7–B8 exclusion and asked for researcher confirmation, but it did not execute a record search or reconstruct the evidence. This is a project-history / peer-feedback observation, not a controlled benchmark.

**After:** In the executed NiO-17 demo case, the local search displays a dated baseline note with a 3:1 ratio and 25 °C, a follow-up note with a 1:1 ratio and 60 °C, and a revision CSV showing the ratio change with a blank reason. It does **not** answer why the condition changed; it exposes the absent rationale and asks the researcher to review the conflicting evidence. The automated results above verify those UI assertions. The demo does not contain a B7–B8 sample record.

### Additional browser walkthrough evidence (November 17, 2026)

The project owner opened the published LabLens AI website and shared screenshots showing the NiO-17 local evidence overview, three source records with dated notebook excerpts, and the 3:1 / 1:1 solvent-ratio discrepancy. A second screenshot showed the **Needs review** message and **“Review acknowledged — question remains open”** after the review control was used. These observations supplement the automated **Typical 1**, **Challenge**, and **Risk** cases for the bundled sample only. They are **not** an independent anonymous-student test, a real-browser TXT/CSV upload, a scientific validation, or a complete network/privacy audit.

### Measured interpretation

- **Works:** The bundled sample flow returns source-labeled excerpts and raises a specific conflict for human review. The tested TXT/CSV UI path parses selected files locally in the component harness.
- **Unreliable or untested:** Search is deterministic token matching; conflict detection recognizes a narrow solvent-ratio pattern. No manual real-browser upload, large spreadsheet, instrument source, LIMS/ELN connector, model output, persistent review, or production network-observation test was performed for this report.
- **Value supported:** The tests support that this small example can make evidence and uncertainty visible. They do not establish time savings, scientific correctness, general retrieval quality, or researcher adoption.
- **Next improvement:** Test additional synthetic records for missing evidence and other conflict types, and arrange a manual browser review of the file-selection path before using any non-synthetic data.

### Verification run

- Web tests: **3 test files, 13 tests passed**.
- Web TypeScript check: passed (`pnpm --filter @workspace/lablens-ai run typecheck`).
- API TypeScript check: passed (`pnpm --filter @workspace/api-server run typecheck`).
- Production web build: passed (`PORT=19992 BASE_PATH=/ pnpm --filter @workspace/lablens-ai run build`). Vite emitted sourcemap-location warnings for the existing tooltip and label modules; the build completed.
- Signup API smoke check from the implementation session: `/api/healthz` returned HTTP 200; an intentionally invalid signup returned HTTP 400. No valid signup was sent.

## AI role and research-integrity risk

### What the planned AI would do

The proposed future AI task is to synthesize a researcher-reviewed answer from records gathered across existing tools. Possible inputs would be authorized notebook text, dated CSVs, instrument exports, and document text; possible outputs would be a source-cited timeline, condition summary, and explicit unresolved questions for a researcher to review. That model-powered function is **not implemented**.

### What is implemented versus simulated

- The search, excerpts, ratio comparison, unresolved question, and acknowledgement control are functioning deterministic browser interactions.
- The product dashboard is a **Wizard-of-Oz / illustrative concept**: its displayed workspace and AI summary are static example content, not generated or connected to records.
- No generative AI/LLM, model endpoint, or multimodal synthesis is wired into the current product. Deterministic test results are not measurements of model reliability.

### Concrete risks and response

Graduate researchers, academic laboratories, and industrial R&D teams could be harmed if a guessed ratio or condition were mistaken for the experimental record: a researcher might repeat the wrong procedure, misreport a result, or weaken reproducibility. Uploading confidential notes could also disclose unpublished research, participant-related material, intellectual property, or collaborators’ work without permission.

The sample workflow responds to the first risk by showing the actual conflicting excerpts and leaving the question unresolved; the researcher acknowledgement does not close it. The optional file flow is intended to reduce the second risk by reading TXT/CSV in page memory and not sending it to the beta endpoint. Automated risk tests exercise the displayed evidence/review behavior and assert no component `fetch` call. The app warns not to use confidential files.

**Remaining risk:** This is not secure storage or a security certification. The automated test does not inspect every browser/network channel, extensions, hosting logs, or future telemetry. Users should use only synthetic/non-confidential files. Any future server ingestion would need a reviewed consent, access, retention, deletion, and security design before it is added.

## Links and submission status

- [Root README](README.md)
- [AI-use disclosure draft](ai-use-disclosure.md)
- [Demo recording storyboard](docs/demo-recording-storyboard.md)
- [Current prototype](https://lab-lens-ai-landing-page.replit.app)
- [Existing public GitHub repository](https://github.com/msohail2-nd/LabLens-AI)
- **Demo video:** [Narrated LabLens AI recording on Google Drive](https://drive.google.com/file/d/1dLYZAlL1SUArmibqInzlryDiN2-Ro1ja/view?usp=drive_link), recorded November 17, 2026 (approximately 2 minutes 49 seconds). The owner reports sharing it with both course instructors; their actual ability to play it has not been independently verified here. The video file itself must also be uploaded to Canvas.
- **GitHub synchronization:** Public GitHub `main` was verified after the merge at `e641774df9ada947251af529d3543ce1c1579f77`, with the interactive demo, sample CSV, five-case tests and course documentation present. Subsequent documentation-only commits added the video link and corrected status notes.

The five evaluations above are automated component-level tests, supplemented by the limited published-site browser walkthrough described above; they are not five independent participant studies. The separate [demo storyboard](docs/demo-recording-storyboard.md) retains the course's 2–3 minute recording sequence and Canvas/Drive checklist.

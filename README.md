# LabLens AI

LabLens AI is a landing page and beta-interest site for a planned research-continuity and knowledge-retrieval platform. The intended product would complement existing laboratory information management systems (LIMS) and electronic lab notebooks (ELNs), helping researchers connect evidence that is spread across tools. It is not a replacement for those systems.

The website includes a deterministic, local-only record-to-evidence prototype to make the concept testable. It does not use an AI model.

## Course revision resources

- [Project Prototype Revision report](revision.md) — prioritized changes, anonymized feedback response, five executed evaluation cases, before/after comparison, and research-integrity risk.
- [AI-use disclosure draft](ai-use-disclosure.md) — tools, representative prompts, assistance provided, verification, and student-review reminders.
- [Demo recording storyboard](docs/demo-recording-storyboard.md) — timed 2–3 minute speaker notes and submission checklist.
- [Current prototype](https://lab-lens-ai-landing-page.replit.app)
- [Public GitHub repository](https://github.com/msohail2-nd/LabLens-AI)
- [Replit development project](https://replit.com/@msohailnd/LabLens-AI-landing-page)

**Course milestone:** Project Prototype Revision, due November 19, 2026.

## Target users

- Graduate researchers
- Academic laboratories
- Industrial research and development teams

## Quick start

This project is in a pnpm workspace. From the repository root:

```sh
pnpm install
```

Run the web app with the Vite variables required by its config:

```sh
PORT=19992 BASE_PATH=/ pnpm --filter @workspace/lablens-ai run dev
```

The beta signup API is a separate Express service. It requires the configured PostgreSQL connection and API environment in this Replit workspace:

```sh
PORT=19991 pnpm --filter @workspace/api-server run dev
```

Run the website checks and production build:

```sh
pnpm --filter @workspace/lablens-ai run test
pnpm --filter @workspace/lablens-ai run typecheck
PORT=19992 BASE_PATH=/ pnpm --filter @workspace/lablens-ai run build
```

The API service can be typechecked with:

```sh
pnpm --filter @workspace/api-server run typecheck
```

Do not use real or confidential research records in the prototype or beta interest form.

## Architecture

| Area | Implementation |
| --- | --- |
| Web | React, TypeScript, Vite, Tailwind CSS |
| Web form | React Hook Form, Zod validation, generated API client |
| API | Node.js, Express 5, JSON routes |
| Persistence | PostgreSQL through Drizzle ORM |
| Shared API contracts | Workspace-generated Zod schemas and API client |
| Demo retrieval | Deterministic TypeScript functions running in the browser |
| Automated checks | Vitest, jsdom, React Testing Library |

The web app is in `artifacts/lablens-ai`. The signup service is in `artifacts/api-server`. Shared API contracts and client code live under `lib/`.

## User journey

1. Use **Try the research demo** in the hero, or scroll to **Try the research demo**.
2. Select **Try sample notes** to load bundled, fictional NiO-17 records. The sample includes two dated notes and a revision CSV that records solvent-ratio values of 3:1 and 1:1 without an explanation.
3. Search for `NiO-17` and inspect the exact displayed excerpts, dates, and fictional attributions.
4. Review the disagreement under **Needs review**. The rule-based demo flags the conflict and does not decide which ratio is correct.
5. Select **I reviewed this evidence**. This acknowledges review in the page only; it does not close the question or change the source record.
6. Optionally open up to three small local `.txt` or `.csv` files. Search those locally, then decide separately whether to submit beta interest. The beta form is not for research records.

The downloadable fictional CSV is also linked from the demo. The product dashboard elsewhere on the page remains an illustrative concept, not a working workspace.

## Demo video

**[Watch the narrated LabLens AI prototype demo (Google Drive)](https://drive.google.com/file/d/1dLYZAlL1SUArmibqInzlryDiN2-Ro1ja/view?usp=drive_link)**

Recorded November 17, 2026 (approximately 2 minutes 49 seconds). The video demonstrates the fictional NiO-17 record-to-evidence workflow, conflicting solvent ratios, review acknowledgement, and limitations. [Timed recording storyboard](docs/demo-recording-storyboard.md).

**Sharing and submission:** The project owner reports sharing the video with `ehughes8@nd.edu` and `ghuang3@nd.edu`. Their actual Viewer permissions and playback have not been independently checked here. The video file must also be uploaded **directly to Canvas** alongside the public GitHub repository URL; linking Google Drive in this README alone is not a Canvas submission.

## Public GitHub repository sync

On November 17, 2026, the original public repository's `main` branch was verified at merged prototype commit `e641774df9ada947251af529d3543ce1c1579f77`. The public tree includes the current research demo, fictional sample CSV, automated tests, README, revision report, AI-use disclosure, and recording storyboard. Later README-only updates (including this video link) are separate commits. Confirm GitHub and prototype access while signed out before Canvas submission.

## What works, sample behavior, and future plans

| Capability | Status | Details |
| --- | --- | --- |
| Landing page, sections, responsive navigation | Working | Static page sections and in-page navigation. |
| Beta-interest form | Working | Browser-side validation and submission through the API. |
| Signup validation, duplicate handling, persistence | Working | API validates the existing fields, normalizes email, stores accepted signup details in PostgreSQL, and returns a conflict for duplicate email. |
| Fictional NiO-17 record search | Working local prototype | Rule-based search over the bundled fictional notes and CSV; produces source excerpts and flags the conflicting ratios. |
| Local TXT/CSV test | Working local prototype | Reads `.txt` and `.csv` content in the browser, with per-file size and file-count limits. It is not uploaded or saved. |
| Dashboard / concept record | Illustrative only | Example interface and content; not connected to data or controls. |
| Model-powered synthesis, unified cross-tool search, record reconstruction | Planned | These features are not implemented. |
| Instrument integrations, secure research storage, enterprise deployment | Planned | No connectors, research-file storage, or enterprise deployment is implemented. |

The prototype is explicitly labeled: **“Interactive prototype — local, rule-based demo; not AI-generated.”** No LLM client, model endpoint, or model call is wired into the project. The local demo uses deterministic search and limited pattern matching. It is not a validated scientific system and does not establish that an experiment record is complete.

## Privacy and data flow

### Local demo files

- Accepted extensions: `.txt` and `.csv` only.
- Maximum: 3 files in one selection; 500 KB per file.
- Text is parsed and searched in the browser. The app does not send file contents to the API, analytics, or beta form and does not persist them. They remain in page memory until the page is reloaded or left.
- Displayed file text is treated as untrusted text, not executed as markup or instructions. Malformed or empty files produce an error instead of a result.
- Use only non-confidential files. This prototype is not secure research storage.

### Beta interest form

The beta form is separate from the local demo. It collects name, email address, research field, graduate program, and a description of the user's recordkeeping challenge. On submission, those fields are sent to the Express API and an accepted signup is stored in PostgreSQL. The API validates the request and handles duplicate email addresses. Do not put confidential research information in the form.

## Limitations and next steps

- Search is a simple deterministic text match, not semantic retrieval or AI.
- Conflict detection only recognizes a narrow solvent-ratio pattern; it is not general scientific reasoning.
- The demo only searches sources loaded into the current page. It does not connect notebooks, instruments, PDFs, LIMS, ELNs, or project drives.
- TXT/CSV parsing is a small prototype, not a full spreadsheet import or secure ingestion pipeline.
- Review acknowledgement is a transient UI state; it is not a saved approval or audit record.
- The bundled records are fictional and must not be treated as experimental guidance.
- Future model-powered synthesis would require explicit product, privacy, security, evaluation, and researcher-review decisions before implementation.

## Tests and verification

The web test suite covers local evidence excerpts and conflict flags, no-match behavior, TXT/CSV parsing, quoted CSV handling, malformed/empty/unsupported input, text sanitization, the existing signup schema without database writes, the interactive sample flow, researcher review acknowledgement, key landing-page links, and the five separately named course evaluation cases in `revision.md`.

Commands:

```sh
pnpm --filter @workspace/lablens-ai run test
pnpm --filter @workspace/lablens-ai run typecheck
PORT=19992 BASE_PATH=/ pnpm --filter @workspace/lablens-ai run build
pnpm --filter @workspace/api-server run typecheck
```

Verification for this revision:

- `pnpm --filter @workspace/lablens-ai run test` — passed, 3 test files and 13 tests.
- `pnpm --filter @workspace/lablens-ai run typecheck` — passed.
- `PORT=19992 BASE_PATH=/ pnpm --filter @workspace/lablens-ai run build` — passed. Vite reported sourcemap-location warnings for the existing tooltip and label UI modules, but completed the build.
- `pnpm --filter @workspace/api-server run typecheck` — passed.
- API smoke check — `/api/healthz` returned HTTP 200; an intentionally invalid signup body returned HTTP 400. No valid signup was submitted and no signup row was created for testing.

No valid signup is used in the automated test suite, so those tests do not add rows to the signup database.

The course report distinguishes automated component tests from manual browser tests. On November 17, the project owner also demonstrated the published NiO-17 evidence view and acknowledged the unresolved question in browser screenshots; this does not establish real-browser TXT/CSV upload behavior or a full privacy audit. The narrated video has been recorded and linked above. Before course submission, verify that the instructors can open and play the video, check public GitHub and prototype accessibility, and submit the repository URL plus the actual video file to Canvas.

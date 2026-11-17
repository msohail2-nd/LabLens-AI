import { useState, type ChangeEvent } from "react";
import {
  buildEvidenceOverview,
  LocalFileError,
  MAX_LOCAL_FILE_BYTES,
  MAX_LOCAL_FILES,
  parseLocalFile,
  SAMPLE_RESEARCH_SOURCES,
  type EvidenceOverview,
  type LocalResearchSource,
} from "@/lib/research-demo";
import { Check, Download, FileText, Search, Upload } from "lucide-react";

const sampleDownload = `${import.meta.env.BASE_URL}samples/nio-17-revisions.csv`;

export function ResearchDemo() {
  const [sources, setSources] = useState<LocalResearchSource[]>([]);
  const [query, setQuery] = useState("");
  const [overview, setOverview] = useState<EvidenceOverview | null>(null);
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("No notes loaded");

  function loadSamples() {
    setSources(SAMPLE_RESEARCH_SOURCES);
    setQuery("NiO-17");
    setSourceLabel("Fictional NiO-17 sample notes and revision CSV");
    setOverview(null);
    setError("");
    setReviewed(false);
  }

  async function readLocalFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    setError("");
    setOverview(null);
    setReviewed(false);
    if (!files.length) return;
    if (files.length > MAX_LOCAL_FILES) {
      setError(`Select no more than ${MAX_LOCAL_FILES} files at a time.`);
      return;
    }

    try {
      const parsed = await Promise.all(
        files.map(async (file) => {
          if (file.size > MAX_LOCAL_FILE_BYTES) {
            throw new LocalFileError(
              `${file.name} exceeds the 500 KB per-file limit.`,
            );
          }
          return parseLocalFile(file.name, await file.text());
        }),
      );
      setSources(parsed);
      setQuery("");
      setSourceLabel(
        `${parsed.length} local file${parsed.length === 1 ? "" : "s"} loaded in this browser`,
      );
    } catch (cause) {
      setSources([]);
      setSourceLabel("No notes loaded");
      setError(
        cause instanceof Error
          ? cause.message
          : "The selected files could not be read. Try a small TXT or CSV file.",
      );
    }
  }

  function findRecord() {
    setError("");
    setReviewed(false);
    const next = buildEvidenceOverview(sources, query);
    if (!next.query) {
      setOverview(null);
      setError("Enter an experiment ID or a search term from the notes.");
      return;
    }
    setOverview(next);
  }

  return (
    <section className="section research-demo" id="research-demo">
      <div className="container">
        <div className="demo-heading">
          <span className="eyebrow eyebrow-line">INTERACTIVE PROTOTYPE</span>
          <h2 className="display">Try the research demo</h2>
          <p>
            Load fictional notes or inspect a small TXT/CSV file locally. The
            rule-based demo shows source excerpts and flags a disagreement
            without choosing which value is correct.
          </p>
          <div className="demo-status">
            Interactive prototype — local, rule-based demo; not AI-generated
          </div>
        </div>

        <div className="demo-panel">
          <div className="demo-controls">
            <div className="demo-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={loadSamples}
                data-testid="button-load-sample-notes"
              >
                <FileText size={16} aria-hidden="true" />
                Try sample notes
              </button>
              <a
                className="demo-download"
                href={sampleDownload}
                download="nio-17-revisions.csv"
                data-testid="link-download-sample-csv"
              >
                <Download size={14} aria-hidden="true" />
                Download fictional CSV
              </a>
            </div>
            <label className="local-file-control">
              <span><Upload size={15} aria-hidden="true" /> Open local TXT or CSV</span>
              <input
                type="file"
                accept=".txt,.csv,text/plain,text/csv"
                multiple
                onChange={readLocalFiles}
                aria-label="Open local TXT or CSV files"
                data-testid="input-local-research-files"
              />
            </label>
            <p className="local-file-help">
              Up to {MAX_LOCAL_FILES} files, {MAX_LOCAL_FILE_BYTES / 1000} KB each.
              Read and searched in this browser only; not uploaded or saved.
            </p>
            <label className="demo-query-label" htmlFor="research-query">
              Experiment ID or search term
            </label>
            <div className="demo-query">
              <input
                id="research-query"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="For example, NiO-17"
                data-testid="input-research-query"
              />
              <button
                type="button"
                className="demo-search-button"
                onClick={findRecord}
                disabled={!sources.length}
                data-testid="button-find-record"
              >
                Find record <Search size={15} aria-hidden="true" />
              </button>
            </div>
            <p className="demo-source-state" aria-live="polite">
              {sourceLabel}
            </p>
            {error && (
              <p className="demo-error" role="alert" data-testid="status-demo-error">
                {error}
              </p>
            )}
          </div>

          <div className="demo-results" aria-live="polite">
            {!overview ? (
              <div className="demo-empty">
                <span className="demo-empty-mark"><Search size={18} /></span>
                <h3>Load notes to begin</h3>
                <p>
                  Start with the fictional sample, then search for NiO-17 to see
                  dated evidence and a condition conflict.
                </p>
              </div>
            ) : (
              <div className="demo-result-content" data-testid="panel-evidence-overview">
                <div className="demo-result-heading">
                  <div>
                    <span className="demo-result-kicker">LOCAL EVIDENCE OVERVIEW</span>
                    <h3>Results for “{overview.query}”</h3>
                  </div>
                  <span className="demo-source-count">
                    {overview.sources.length} matching source
                    {overview.sources.length === 1 ? "" : "s"}
                  </span>
                </div>

                <section className="evidence-group" aria-labelledby="supported-heading">
                  <h4 id="supported-heading">
                    <Check size={15} aria-hidden="true" />
                    Source-supported facts
                  </h4>
                  {overview.excerpts.length ? (
                    <div className="evidence-list">
                      {overview.excerpts.map(({ source, excerpt }, index) => (
                        <article className="evidence-item" key={`${source.id}-${index}`}>
                          <div className="evidence-source">
                            <span>{source.title}</span>
                            <span>{source.date} · {source.author}</span>
                          </div>
                          <blockquote>{excerpt}</blockquote>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="demo-no-results">
                      No matching source was found. Nothing was inferred.
                    </p>
                  )}
                </section>

                <section className="review-group" aria-labelledby="review-heading">
                  <h4 id="review-heading">Needs review</h4>
                  <ul>
                    {overview.unresolvedQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="review-button"
                    onClick={() => setReviewed((current) => !current)}
                    data-testid="button-mark-reviewed"
                  >
                    {reviewed ? "Review acknowledged — question remains open" : "I reviewed this evidence"}
                  </button>
                  {reviewed && (
                    <p className="review-ack" role="status">
                      Review acknowledged. The prototype does not resolve or alter
                      any source value.
                    </p>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>

        <p className="demo-privacy">
          Local file contents stay in page memory and are cleared when you leave
          or reload. They are not sent to the API, beta form, or analytics. Treat
          file text as untrusted content; it is displayed as text, never executed.
          Do not use confidential research files in this prototype.
        </p>
      </div>
    </section>
  );
}

export function DemoHowToTest() {
  return (
    <section className="section demo-howto" id="demo-how-to">
      <div className="container demo-howto-layout">
        <div>
          <span className="eyebrow eyebrow-line">HOW TO TEST THE PROTOTYPE</span>
          <h2 className="display">Follow the evidence yourself.</h2>
        </div>
        <ol>
          <li><span>01</span> Load the fictional NiO-17 notes.</li>
          <li><span>02</span> Search NiO-17 and inspect the dated source excerpts.</li>
          <li><span>03</span> Confirm the 3:1 vs 1:1 conflict is flagged, not decided.</li>
          <li><span>04</span> Mark it reviewed; the unresolved question remains open.</li>
        </ol>
      </div>
    </section>
  );
}

export function CapabilityStatus() {
  return (
    <section className="section capability-status" id="capability-status">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow eyebrow-line">WHAT IS REAL TODAY</span>
          <h2 className="display">Clear about what works.</h2>
        </div>
        <div className="status-columns">
          <article>
            <h3>Works today</h3>
            <p>Landing page, working beta signup, and the local rule-based notes demo.</p>
          </article>
          <article>
            <h3>Simulated here</h3>
            <p>The dashboard is illustrative. Sample research content is fictional and bundled with the site.</p>
          </article>
          <article>
            <h3>Planned</h3>
            <p>Model-powered synthesis, multimodal instrument integration, secure research storage, and enterprise deployment.</p>
          </article>
        </div>
        <div className="limitations-panel" id="limitations">
          <h3>Limitations and privacy</h3>
          <p>
            This deterministic demo searches only the text loaded in this page. It
            is not an LLM, a validated scientific system, or a complete search of
            a lab record. Local TXT/CSV files are neither uploaded nor saved. Beta
            signup is separate: its contact and research-interest fields are sent
            to the API and stored in PostgreSQL. Do not submit confidential
            research data in the beta form or use confidential files in this demo.
          </p>
        </div>
      </div>
    </section>
  );
}

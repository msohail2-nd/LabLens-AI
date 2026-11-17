export const MAX_LOCAL_FILE_BYTES = 500_000;
export const MAX_LOCAL_TEXT_CHARS = 100_000;
export const MAX_LOCAL_FILES = 3;

export type LocalResearchSource = {
  id: string;
  title: string;
  type: "note" | "csv" | "txt";
  date: string;
  author: string;
  text: string;
  excerpts: string[];
  rows?: string[][];
};

export type EvidenceOverview = {
  query: string;
  sources: LocalResearchSource[];
  excerpts: Array<{ source: LocalResearchSource; excerpt: string }>;
  sourceSupportedFacts: string[];
  unresolvedQuestions: string[];
};

export const SAMPLE_RESEARCH_SOURCES: LocalResearchSource[] = [
  {
    id: "notebook-2026-04-14",
    title: "Notebook · NiO-17 baseline",
    type: "note",
    date: "2026-04-14",
    author: "Fictional researcher: Mira Chen",
    text: [
      "Experiment NiO-17 — nickel oxidation baseline.",
      "Solvent ratio: ethanol:water = 3:1. Temperature: 25 °C.",
      "Collected NMR file nmr_NiO17_01.csv after the baseline run.",
    ].join("\n"),
    excerpts: [
      "Experiment NiO-17 — nickel oxidation baseline.",
      "Solvent ratio: ethanol:water = 3:1. Temperature: 25 °C.",
      "Collected NMR file nmr_NiO17_01.csv after the baseline run.",
    ],
  },
  {
    id: "notebook-2026-04-16",
    title: "Notebook · NiO-17 follow-up",
    type: "note",
    date: "2026-04-16",
    author: "Fictional researcher: Jo Alvarez",
    text: [
      "Experiment NiO-17 follow-up.",
      "Solvent ratio: ethanol:water = 1:1. Temperature: 60 °C.",
      "XRD file xrd_NiO17_revB.csv collected. Reason for changed conditions not recorded in this note.",
    ].join("\n"),
    excerpts: [
      "Experiment NiO-17 follow-up.",
      "Solvent ratio: ethanol:water = 1:1. Temperature: 60 °C.",
      "XRD file xrd_NiO17_revB.csv collected. Reason for changed conditions not recorded in this note.",
    ],
  },
  {
    id: "revision-log-2026-04-17",
    title: "Spreadsheet · NiO-17 revisions",
    type: "csv",
    date: "2026-04-17",
    author: "Fictional lab revision log",
    text: [
      "experiment_id,date,field,previous_value,new_value,author,reason",
      "NiO-17,2026-04-17,solvent_ratio,3:1,1:1,Jo Alvarez,",
    ].join("\n"),
    excerpts: [
      "NiO-17,2026-04-17,solvent_ratio,3:1,1:1,Jo Alvarez,",
    ],
    rows: [
      ["experiment_id", "date", "field", "previous_value", "new_value", "author", "reason"],
      ["NiO-17", "2026-04-17", "solvent_ratio", "3:1", "1:1", "Jo Alvarez", ""],
    ],
  },
];

export class LocalFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalFileError";
  }
}

export function sanitizeLocalText(input: string): string {
  return input
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, MAX_LOCAL_TEXT_CHARS);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ",") {
      row.push(field.trim());
      field = "";
    } else if (char === "\n") {
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (quoted) throw new LocalFileError("CSV has an unclosed quoted field.");
  row.push(field.trim());
  if (row.some((cell) => cell.length > 0)) rows.push(row);
  if (rows.length < 2) {
    throw new LocalFileError("CSV needs a header row and at least one data row.");
  }
  const width = rows[0].length;
  if (width < 2 || rows.slice(1).some((dataRow) => dataRow.length !== width)) {
    throw new LocalFileError("CSV rows must have the same number of columns.");
  }
  return rows;
}

function quoteCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function parseLocalFile(
  filename: string,
  rawText: string,
): LocalResearchSource {
  const safeName = filename.split(/[\\/]/).pop()?.slice(0, 120) || "local file";
  const extension = safeName.toLowerCase().split(".").pop();
  if (extension !== "txt" && extension !== "csv") {
    throw new LocalFileError("Choose a plain-text .txt or .csv file.");
  }

  const text = sanitizeLocalText(rawText);
  if (!text.trim()) throw new LocalFileError("The selected file is empty.");

  if (extension === "txt") {
    const excerpts = text.split("\n").map((line) => line.trim()).filter(Boolean);
    return {
      id: `upload-${safeName}`,
      title: safeName,
      type: "txt",
      date: "Date not provided",
      author: "Attribution not provided",
      text,
      excerpts,
    };
  }

  const rows = parseCsv(text);
  const excerpts = rows.slice(1).map((row) => row.map(quoteCsvCell).join(","));
  return {
    id: `upload-${safeName}`,
    title: safeName,
    type: "csv",
    date: "Date not provided",
    author: "Attribution not provided",
    text,
    excerpts,
    rows,
  };
}

function normalizeForSearch(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function solventRatios(source: LocalResearchSource): string[] {
  const values = new Set<string>();
  const prose = /solvent(?:\s+ratio|_ratio)\s*[:=,]\s*(?:ethanol\s*[:/]\s*water\s*=\s*)?(\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?)/gi;
  for (const match of source.text.matchAll(prose)) values.add(match[1].replace(/\s/g, ""));

  if (source.rows) {
    const headers = source.rows[0].map((header) => header.toLowerCase());
    const fieldColumn = headers.findIndex((header) => ["field", "condition"].includes(header));
    const previousColumn = headers.findIndex((header) => header === "previous_value");
    const nextColumn = headers.findIndex((header) => header === "new_value");
    for (const row of source.rows.slice(1)) {
      if (row[fieldColumn]?.toLowerCase().replace(/[_\s]/g, "") === "solventratio") {
        if (row[previousColumn]) values.add(row[previousColumn].replace(/\s/g, ""));
        if (row[nextColumn]) values.add(row[nextColumn].replace(/\s/g, ""));
      }
    }
  }
  return [...values];
}

export function buildEvidenceOverview(
  sources: LocalResearchSource[],
  query: string,
): EvidenceOverview {
  const safeQuery = sanitizeLocalText(query).trim();
  const terms = normalizeForSearch(safeQuery).split(/\s+/).filter(Boolean);
  const matches = terms.length
    ? sources.filter((source) =>
        terms.every((term) => normalizeForSearch(source.text).includes(term)),
      )
    : [];
  const excerpts = matches.flatMap((source) => {
    const matchingLines = source.excerpts.filter((line) =>
      terms.some((term) => normalizeForSearch(line).includes(term)),
    );
    const evidenceLines = matchingLines.length
      ? [
          ...matchingLines,
          ...source.excerpts.filter((line) =>
            /\b(solvent|temperature|condition|nmr|xrd|reason|previous_value|new_value)\b/i.test(
              line,
            ),
          ),
        ]
      : source.excerpts;
    return [...new Set(evidenceLines)]
      .slice(0, 3)
      .map((excerpt) => ({ source, excerpt: excerpt.slice(0, 800) }));
  });
  const ratios = [...new Set(matches.flatMap(solventRatios))];
  const unresolvedQuestions =
    ratios.length > 1
      ? [
          `Sources record solvent ratios ${ratios.join(" and ")}. Which condition is authoritative? This prototype will not choose one.`,
        ]
      : matches.length === 0
        ? ["No matching source was found. Try a record ID or a term from the notes."]
        : [
            "No specific conflict was detected in the excerpts. That does not establish that the record is complete.",
          ];

  return {
    query: safeQuery,
    sources: matches,
    excerpts,
    sourceSupportedFacts: excerpts.map(
      ({ source, excerpt }) => `${source.date} · ${source.author}: “${excerpt}”`,
    ),
    unresolvedQuestions,
  };
}

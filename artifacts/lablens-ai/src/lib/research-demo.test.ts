import { describe, expect, it } from "vitest";
import {
  buildEvidenceOverview,
  LocalFileError,
  parseLocalFile,
  SAMPLE_RESEARCH_SOURCES,
  sanitizeLocalText,
} from "./research-demo";
import { CreateBetaSignupBody } from "@workspace/api-zod";

describe("local research evidence prototype", () => {
  it("returns dated, attributable source excerpts and flags conflicting ratios", () => {
    const overview = buildEvidenceOverview(SAMPLE_RESEARCH_SOURCES, "NiO-17");

    expect(overview.sources).toHaveLength(3);
    expect(overview.excerpts.map((item) => item.source.date)).toContain("2026-04-14");
    expect(overview.excerpts.map((item) => item.source.author)).toContain(
      "Fictional researcher: Mira Chen",
    );
    expect(overview.sourceSupportedFacts.join("\n")).toContain("3:1");
    expect(overview.sourceSupportedFacts.join("\n")).toContain("1:1");
    expect(overview.sourceSupportedFacts.join("\n")).toContain("Temperature: 25 °C");
    expect(overview.sourceSupportedFacts.join("\n")).toContain("Temperature: 60 °C");
    expect(overview.unresolvedQuestions[0]).toContain("will not choose one");
  });

  it("returns a clear no-match question for empty or unknown searches", () => {
    expect(buildEvidenceOverview(SAMPLE_RESEARCH_SOURCES, "").sources).toHaveLength(0);
    expect(
      buildEvidenceOverview(SAMPLE_RESEARCH_SOURCES, "unlisted-compound")
        .unresolvedQuestions[0],
    ).toContain("No matching source");
  });

  it("parses local TXT and CSV fixtures without network access", () => {
    const note = parseLocalFile(
      "notes.txt",
      "NiO-17\nSolvent ratio: 3:1\nQuestion: why did conditions change?",
    );
    const csv = parseLocalFile(
      "revisions.csv",
      "experiment_id,field,previous_value,new_value\nNiO-17,solvent_ratio,3:1,1:1",
    );

    expect(note.excerpts).toContain("Solvent ratio: 3:1");
    expect(csv.rows?.[1]).toEqual(["NiO-17", "solvent_ratio", "3:1", "1:1"]);
    expect(
      buildEvidenceOverview([note, csv], "NiO-17").unresolvedQuestions[0],
    ).toContain("3:1 and 1:1");
  });

  it("handles quoted CSV fields and rejects malformed, empty, or unsupported files", () => {
    const parsed = parseLocalFile(
      "sample.csv",
      'id,note\nNiO-17,"Changed, reason unknown"\n',
    );
    expect(parsed.rows?.[1][1]).toBe("Changed, reason unknown");
    expect(() => parseLocalFile("bad.csv", "id,name\nNiO-17")).toThrow(LocalFileError);
    expect(() => parseLocalFile("empty.txt", " \n ")).toThrow(/empty/);
    expect(() => parseLocalFile("sample.pdf", "text")).toThrow(/plain-text/);
  });

  it("removes control characters and caps untrusted text", () => {
    expect(sanitizeLocalText("safe\u0000 text")).toBe("safe text");
    expect(sanitizeLocalText("x".repeat(100_010))).toHaveLength(100_000);
    expect(parseLocalFile("note.txt", "<script>alert(1)</script>").text).toContain(
      "<script>",
    );
  });
});

describe("beta signup API contract", () => {
  it("accepts the existing signup fields and rejects invalid email without database writes", () => {
    const valid = {
      name: "Test Researcher",
      email: "researcher@example.edu",
      researchField: "Materials science",
      graduateProgram: "PhD",
      biggestChallenge: "Locating source files",
    };
    expect(CreateBetaSignupBody.safeParse(valid).success).toBe(true);
    expect(
      CreateBetaSignupBody.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });
});

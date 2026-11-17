import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResearchDemo } from "./research-demo";

function browserFile(name: string, text: string): File {
  const file = new File([text], name, { type: "text/plain" });
  // jsdom does not consistently implement File.text(); preserve the real UI
  // selection path while supplying the browser API used by the component.
  Object.defineProperty(file, "text", { value: async () => text });
  return file;
}

function selectFiles(...files: File[]) {
  fireEvent.change(screen.getByTestId("input-local-research-files"), {
    target: { files },
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("course evaluation cases", () => {
  it("Typical 1: sample notes return source-linked, dated evidence", () => {
    render(<ResearchDemo />);
    fireEvent.click(screen.getByTestId("button-load-sample-notes"));
    fireEvent.click(screen.getByTestId("button-find-record"));

    const result = screen.getByTestId("panel-evidence-overview");
    expect(result.textContent).toContain("Notebook · NiO-17 baseline");
    expect(result.textContent).toContain("2026-04-14");
    expect(result.textContent).toContain("Fictional researcher: Mira Chen");
    expect(result.textContent).toContain("nmr_NiO17_01.csv");
    expect(result.textContent).toContain("Spreadsheet · NiO-17 revisions");
    expect(result.textContent).toContain("2026-04-17");
  });

  it("Typical 2: selected TXT and CSV files are searched in the browser", async () => {
    const fetchSpy = vi.fn();
    const persistSpy = vi.spyOn(Storage.prototype, "setItem");
    vi.stubGlobal("fetch", fetchSpy);
    render(<ResearchDemo />);
    selectFiles(
      browserFile("run-notes.txt", "NiO-22\nTemperature: 40 C\nNMR: run22.csv"),
      browserFile(
        "run-revision.csv",
        "experiment_id,field,previous_value,new_value,reason\nNiO-22,temperature,25 C,40 C,",
      ),
    );

    await waitFor(() =>
      expect(screen.getByText(/2 local files loaded in this browser/)).toBeTruthy(),
    );
    fireEvent.change(screen.getByTestId("input-research-query"), {
      target: { value: "NiO-22" },
    });
    fireEvent.click(screen.getByTestId("button-find-record"));

    expect(screen.getByTestId("panel-evidence-overview").textContent).toContain(
      "Temperature: 40 C",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(persistSpy).not.toHaveBeenCalled();
  });

  it("Challenge: conflicting ratios and missing rationale stay unresolved", () => {
    render(<ResearchDemo />);
    fireEvent.click(screen.getByTestId("button-load-sample-notes"));
    fireEvent.click(screen.getByTestId("button-find-record"));

    const result = screen.getByTestId("panel-evidence-overview");
    expect(result.textContent).toContain("3:1");
    expect(result.textContent).toContain("1:1");
    expect(result.textContent).toContain("reason for the change is not recorded");
    expect(result.textContent).toContain("will not choose or infer an answer");
  });

  it("Invalid/empty: empty, malformed, and unsupported files fail visibly", async () => {
    render(<ResearchDemo />);
    selectFiles(browserFile("empty.txt", "  \n"));
    expect((await screen.findByRole("alert")).textContent).toContain("empty");

    selectFiles(browserFile("malformed.csv", "id,name\nNiO-17"));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "same number of columns",
    );

    selectFiles(browserFile("records.pdf", "not a supported text file"));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "plain-text .txt or .csv",
    );
  });

  it("Risk: source evidence is visible, review leaves the conflict open, and no request is sent", () => {
    const fetchSpy = vi.fn();
    const persistSpy = vi.spyOn(Storage.prototype, "setItem");
    vi.stubGlobal("fetch", fetchSpy);
    render(<ResearchDemo />);
    fireEvent.click(screen.getByTestId("button-load-sample-notes"));
    fireEvent.click(screen.getByTestId("button-find-record"));

    const result = screen.getByTestId("panel-evidence-overview");
    expect(result.textContent).toContain("Solvent ratio: ethanol:water = 3:1.");
    expect(result.textContent).toContain("Solvent ratio: ethanol:water = 1:1.");
    expect(result.textContent).toContain("Needs review");

    fireEvent.click(screen.getByTestId("button-mark-reviewed"));
    expect(screen.getByText(/question remains open/)).toBeTruthy();
    expect(screen.getByText(/does not resolve or alter any source value/)).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(persistSpy).not.toHaveBeenCalled();
  });
});

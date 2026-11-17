import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { ResearchDemo } from "./research-demo";
import Home from "@/pages/home";

function renderWithQueryClient(element: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{element}</QueryClientProvider>,
  );
}

describe("research demo interaction", () => {
  it("loads sample notes, shows conflicting source excerpts, and preserves the open review question", () => {
    render(<ResearchDemo />);
    fireEvent.click(screen.getByTestId("button-load-sample-notes"));
    fireEvent.change(screen.getByTestId("input-research-query"), {
      target: { value: "NiO-17" },
    });
    fireEvent.click(screen.getByTestId("button-find-record"));

    expect(screen.getByTestId("panel-evidence-overview").textContent).toContain(
      "Solvent ratio: ethanol:water = 3:1.",
    );
    expect(screen.getByTestId("panel-evidence-overview").textContent).toContain(
      "Solvent ratio: ethanol:water = 1:1.",
    );
    expect(screen.getByText(/Which condition is authoritative/)).toBeTruthy();

    fireEvent.click(screen.getByTestId("button-mark-reviewed"));
    expect(screen.getByText(/question remains open/)).toBeTruthy();
    expect(screen.getByText(/does not resolve or alter any source value/)).toBeTruthy();
  });
});

describe("landing page navigation regression", () => {
  it("keeps the hero demo and beta calls to action connected to existing sections", () => {
    renderWithQueryClient(<Home />);

    expect(screen.getByTestId("link-hero-demo").getAttribute("href")).toBe(
      "#research-demo",
    );
    expect(screen.getByTestId("link-hero-beta").getAttribute("href")).toBe("#beta");
    expect(screen.getByTestId("link-nav-product").getAttribute("href")).toBe(
      "#product",
    );
    expect(screen.getByTestId("panel-beta-form")).toBeTruthy();
  });
});

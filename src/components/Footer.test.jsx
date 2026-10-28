import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the project name", () => {
    render(<Footer />);

    expect(screen.getByText("LOGIC GPA TRACKER")).toBeInTheDocument();
  });

  it("renders the footer tagline", () => {
    render(<Footer />);

    expect(
      screen.getByText("Turning academic data into smarter decisions."),
    ).toBeInTheDocument();
  });

  it("renders a semantic footer element", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});

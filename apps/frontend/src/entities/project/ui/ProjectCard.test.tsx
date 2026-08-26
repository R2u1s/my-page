import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { ProjectInfo } from "../model/config";

const baseProject: ProjectInfo = {
  id: "1",
  title: "Test project",
  description: "Test description",
  url: "https://example.com",
  imageUrl: null,
  isPlaceholder: false,
  sortOrder: 0,
};

describe("ProjectCard", () => {
  it("renders a clickable link for a real project", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("Test project")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders a non-clickable card for a placeholder project", () => {
    render(<ProjectCard project={{ ...baseProject, isPlaceholder: true, url: null }} />);

    expect(screen.getByText("Test project")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

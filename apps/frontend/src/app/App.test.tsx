import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Project } from "@my-page/shared-types";

vi.mock("../shared/api/graphqlClient", () => ({
  graphqlClient: { request: vi.fn() },
}));

import { graphqlClient } from "../shared/api/graphqlClient";
import { App } from "./App";
import { profile } from "../entities/profile";

describe("App", () => {
  it("renders the landing page with hero and projects sections", async () => {
    const projects: Project[] = [
      {
        id: "1",
        title: "Demo project",
        description: "",
        url: "https://example.com",
        imageUrl: null,
        isPlaceholder: false,
        sortOrder: 0,
      },
    ];
    vi.mocked(graphqlClient.request).mockResolvedValue({ projects });

    render(<App />);

    expect(screen.getByText(`${profile.firstName} ${profile.lastName}`)).toBeInTheDocument();
    expect(screen.getByText("Проекты")).toBeInTheDocument();
    expect(await screen.findByText("Demo project")).toBeInTheDocument();
  });
});

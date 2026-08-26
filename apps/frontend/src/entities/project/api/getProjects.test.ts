import { describe, it, expect, vi } from "vitest";
import type { Project } from "@my-page/shared-types";

vi.mock("../../../shared/api/graphqlClient", () => ({
  graphqlClient: { request: vi.fn() },
}));

import { graphqlClient } from "../../../shared/api/graphqlClient";
import { getProjects } from "./getProjects";

describe("getProjects", () => {
  it("returns the projects from the GraphQL response", async () => {
    const projects: Project[] = [
      {
        id: "1",
        title: "Test project",
        description: "",
        url: null,
        imageUrl: null,
        isPlaceholder: false,
        sortOrder: 0,
      },
    ];
    vi.mocked(graphqlClient.request).mockResolvedValue({ projects });

    const result = await getProjects();

    expect(result).toEqual(projects);
  });
});

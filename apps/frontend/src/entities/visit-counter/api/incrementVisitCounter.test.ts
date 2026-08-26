import { describe, it, expect, vi } from "vitest";
import type { VisitCounter } from "@my-page/shared-types";

vi.mock("../../../shared/api/graphqlClient", () => ({
  graphqlClient: { request: vi.fn() },
}));

import { graphqlClient } from "../../../shared/api/graphqlClient";
import { incrementVisitCounter } from "./incrementVisitCounter";

describe("incrementVisitCounter", () => {
  it("returns the visit counter from the GraphQL response", async () => {
    const counter: VisitCounter = { id: "main", count: 129 };
    vi.mocked(graphqlClient.request).mockResolvedValue({ incrementVisitCount: counter });

    const result = await incrementVisitCounter();

    expect(result).toEqual(counter);
  });
});

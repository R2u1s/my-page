import { ProjectsService } from "./projects.service";
import { PrismaService } from "../prisma/prisma.service";
import { Project } from "./models/project.model";

describe("ProjectsService", () => {
  it("returns projects ordered by sortOrder", async () => {
    const projects: Project[] = [
      {
        id: "1",
        title: "Project one",
        description: "",
        url: null,
        imageUrl: null,
        isPlaceholder: false,
        sortOrder: 0,
      },
    ];
    const findMany = jest.fn().mockResolvedValue(projects);
    const prisma = { project: { findMany } } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    const result = await service.findAllOrdered();

    expect(findMany).toHaveBeenCalledWith({ orderBy: { sortOrder: "asc" } });
    expect(result).toBe(projects);
  });
});

import { ProjectsResolver } from "./projects.resolver";
import { ProjectsService } from "./projects.service";
import { Project } from "./models/project.model";

describe("ProjectsResolver", () => {
  it("delegates to ProjectsService.findAllOrdered", async () => {
    const projects: Project[] = [];
    const findAllOrdered = jest.fn().mockResolvedValue(projects);
    const service = { findAllOrdered } as unknown as ProjectsService;
    const resolver = new ProjectsResolver(service);

    const result = await resolver.projects();

    expect(findAllOrdered).toHaveBeenCalled();
    expect(result).toBe(projects);
  });
});

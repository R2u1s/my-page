import { Query, Resolver } from "@nestjs/graphql";
import { Project } from "./models/project.model";
import { ProjectsService } from "./projects.service";

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project])
  projects(): Promise<Project[]> {
    return this.projectsService.findAllOrdered();
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Project } from "./models/project.model";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrdered(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }
}

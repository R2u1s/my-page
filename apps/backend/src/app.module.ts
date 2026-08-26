import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { AppGraphQLModule } from "./graphql/graphql.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { VisitCounterModule } from "./visit-counter/visit-counter.module";

@Module({
  imports: [PrismaModule, HealthModule, AppGraphQLModule, ProjectsModule, VisitCounterModule],
})
export class AppModule {}

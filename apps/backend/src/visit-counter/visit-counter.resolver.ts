import { Mutation, Resolver } from "@nestjs/graphql";
import { VisitCounter } from "./models/visit-counter.model";
import { VisitCounterService } from "./visit-counter.service";

@Resolver(() => VisitCounter)
export class VisitCounterResolver {
  constructor(private readonly visitCounterService: VisitCounterService) {}

  @Mutation(() => VisitCounter)
  incrementVisitCount(): Promise<VisitCounter> {
    return this.visitCounterService.incrementAndGet();
  }
}

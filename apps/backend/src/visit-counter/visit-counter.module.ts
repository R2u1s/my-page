import { Module } from "@nestjs/common";
import { VisitCounterResolver } from "./visit-counter.resolver";
import { VisitCounterService } from "./visit-counter.service";

@Module({
  providers: [VisitCounterResolver, VisitCounterService],
})
export class VisitCounterModule {}

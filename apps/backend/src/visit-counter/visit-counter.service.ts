import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VisitCounter } from "./models/visit-counter.model";

const VISIT_COUNTER_ID = "main";

@Injectable()
export class VisitCounterService {
  constructor(private readonly prisma: PrismaService) {}

  async incrementAndGet(): Promise<VisitCounter> {
    return this.prisma.visitCounter.upsert({
      where: { id: VISIT_COUNTER_ID },
      update: { count: { increment: 1 } },
      create: { id: VISIT_COUNTER_ID, count: 1 },
    });
  }
}

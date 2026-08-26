import { VisitCounterService } from "./visit-counter.service";
import { PrismaService } from "../prisma/prisma.service";
import { VisitCounter } from "./models/visit-counter.model";

describe("VisitCounterService", () => {
  it("increments and returns the visit counter", async () => {
    const counter: VisitCounter = { id: "main", count: 5 };
    const upsert = jest.fn().mockResolvedValue(counter);
    const prisma = { visitCounter: { upsert } } as unknown as PrismaService;
    const service = new VisitCounterService(prisma);

    const result = await service.incrementAndGet();

    expect(upsert).toHaveBeenCalledWith({
      where: { id: "main" },
      update: { count: { increment: 1 } },
      create: { id: "main", count: 1 },
    });
    expect(result).toBe(counter);
  });
});

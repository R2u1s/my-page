import { Controller, Get } from "@nestjs/common";
import type { HealthCheckResponse } from "@my-page/shared-types";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthCheckResponse {
    return this.healthService.check();
  }
}

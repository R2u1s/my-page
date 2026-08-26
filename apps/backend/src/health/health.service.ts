import { Injectable } from "@nestjs/common";
import type { HealthCheckResponse } from "@my-page/shared-types";

@Injectable()
export class HealthService {
  check(): HealthCheckResponse {
    return { status: "ok" };
  }
}

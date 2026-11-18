import "server-only";
import type { HealthService } from "@/server/services/health-service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  get() {
    return Response.json(this.healthService.getStatus(), {
      headers: { "Cache-Control": "no-store" },
    });
  }
}

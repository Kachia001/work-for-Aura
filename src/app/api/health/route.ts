import { container } from "@/server/di/container";
import { TOKENS } from "@/server/di/tokens";
import type { HealthController } from "@/server/controllers/health-controller";

export const runtime = "nodejs";

export function GET() {
  return container.get<HealthController>(TOKENS.healthController).get();
}

import "server-only";

export class HealthService {
  getStatus() {
    return { status: "ok" as const };
  }
}

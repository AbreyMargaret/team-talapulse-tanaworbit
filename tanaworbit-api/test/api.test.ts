import { describe, expect, it } from "vitest";
import app from "../src/index";

const env = { ENVIRONMENT: "development" } as const;

type HealthBody = {
  ok: boolean;
  medicalDevice: boolean;
  persistsCheckIns: boolean;
  environment: string;
};

type CrewBody = {
  synthetic: boolean;
  records: { id: string; crewId?: string }[];
};

type ErrorBody = {
  error: string;
  records?: unknown[];
};

async function read<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("tanaworbit-api", () => {
  it("reports a synthetic read-only service", async () => {
    const response = await app.request("/health", {}, env);
    expect(response.status).toBe(200);
    const body = await read<HealthBody>(response);
    expect(body.ok).toBe(true);
    expect(body.medicalDevice).toBe(false);
    expect(body.persistsCheckIns).toBe(false);
    expect(body.environment).toBe("development");
    expect(response.headers.get("X-TanawOrbit-Data")).toBe("synthetic");
  });

  it("publishes the simulation crew profiles", async () => {
    const response = await app.request("/api/crew", {}, env);
    expect(response.status).toBe(200);
    const body = await read<CrewBody>(response);
    expect(body.synthetic).toBe(true);
    expect(body.records).toHaveLength(5);
    expect(body.records.map((record) => record.id)).toContain("crew-ef");
  });

  it("filters health records by crew id", async () => {
    const response = await app.request("/api/health-records?crewId=crew-ef", {}, env);
    const body = await read<CrewBody>(response);
    expect(response.status).toBe(200);
    expect(body.records.length).toBeGreaterThan(0);
    expect(body.records.every((record) => record.crewId === "crew-ef")).toBe(true);
  });

  it("returns no records for a malformed crew id", async () => {
    const response = await app.request("/api/health-records?crewId=../secret", {}, env);
    const body = await read<ErrorBody>(response);
    expect(body.records).toEqual([]);
  });

  it("refuses to store a check-in", async () => {
    const response = await app.request("/api/health-records", { method: "POST", body: "{}" }, env);
    expect(response.status).toBe(405);
    const body = await read<ErrorBody>(response);
    expect(body.error).toBe("read_only");
  });

  it("does not invent routes", async () => {
    const response = await app.request("/api/diagnose", {}, env);
    expect(response.status).toBe(404);
  });

  it("verifies the synthetic feature datasets", async () => {
    const response = await app.request("/api/verify", {}, env);
    expect(response.status).toBe(200);
    const body = await read<{ ok: boolean; checks: { ok: boolean }[] }>(response);
    expect(body.ok).toBe(true);
    expect(body.checks.length).toBeGreaterThan(5);
    expect(body.checks.every((item) => item.ok)).toBe(true);
  });

  it("publishes a 14-day baseline for one crew member", async () => {
    const response = await app.request("/api/trends?crewId=crew-ef", {}, env);
    const body = await read<{
      trend: { sampleCount: number; baseline: { heart: number } };
    }>(response);
    expect(response.status).toBe(200);
    expect(body.trend.sampleCount).toBe(14);
    expect(body.trend.baseline.heart).toBeGreaterThan(0);
  });

  it("publishes cabin, orbit, biodata, and nutrition fixtures", async () => {
    const cabin = await app.request("/api/cabin", {}, env);
    const orbit = await app.request("/api/orbital", {}, env);
    const bio = await app.request("/api/biodata", {}, env);
    const food = await app.request("/api/nutrition?crewId=crew-ef", {}, env);
    expect(cabin.status).toBe(200);
    expect(orbit.status).toBe(200);
    expect((await read<{ records: unknown[] }>(bio)).records).toHaveLength(5);
    expect((await read<{ records: unknown[] }>(food)).records.length).toBeGreaterThan(0);
  });
});

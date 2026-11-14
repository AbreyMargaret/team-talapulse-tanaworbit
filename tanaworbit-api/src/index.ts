import { Hono } from "hono";
import { cors } from "hono/cors";
import { accuracyReport, trendFor } from "./accuracy";
import {
  DISCLAIMER,
  accessRoles,
  biodata,
  cabinConditions,
  crew,
  crewIdFrom,
  exerciseCatalog,
  exerciseRecords,
  faq,
  filterByCrew,
  healthRecords,
  mission,
  monitorParameters,
  monitoringRules,
  nutritionItems,
  nutritionRecords,
  orbitalConditions,
  toolkit,
} from "./fixtures";

const READ_ONLY = {
  error: "read_only",
  message:
    "TanawOrbit does not store check-ins or health records. This API only publishes synthetic fixtures.",
  disclaimer: DISCLAIMER,
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "HEAD", "OPTIONS"],
  }),
);

app.use("*", async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    return c.json(READ_ONLY, 405);
  }
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-TanawOrbit-Data", "synthetic");
  c.header("Cache-Control", "public, max-age=300");
});

app.onError((error, c) => {
  console.error(
    JSON.stringify({
      message: "request failed",
      method: c.req.method,
      path: c.req.path,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  return c.json({ error: "unavailable", disclaimer: DISCLAIMER }, 500);
});

function published<T>(body: T) {
  return { disclaimer: DISCLAIMER, synthetic: true, persistsCheckIns: false, ...body };
}

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "tanaworbit-api",
    environment: c.env.ENVIRONMENT,
    synthetic: true,
    medicalDevice: false,
    persistsCheckIns: false,
    disclaimer: DISCLAIMER,
  }),
);

app.get("/api", (c) =>
  c.json(
    published({
      resources: [
        "/health",
        "/api/mission",
        "/api/crew",
        "/api/health-records",
        "/api/exercise-records",
        "/api/exercise-catalog",
        "/api/monitoring-rules",
        "/api/monitor-parameters",
        "/api/biodata",
        "/api/cabin",
        "/api/orbital",
        "/api/nutrition",
        "/api/trends",
        "/api/verify",
        "/api/access",
        "/api/toolkit",
        "/api/guide",
      ],
    }),
  ),
);

app.get("/api/mission", (c) => c.json(published({ mission })));
app.get("/api/crew", (c) => c.json(published({ records: crew })));
app.get("/api/exercise-catalog", (c) => c.json(published({ records: exerciseCatalog })));
app.get("/api/monitoring-rules", (c) => c.json(published({ rules: monitoringRules })));
app.get("/api/toolkit", (c) => c.json(published({ toolkit })));
app.get("/api/guide", (c) => c.json(published({ guide: faq })));

app.get("/api/health-records", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(healthRecords, crewId) }));
});

app.get("/api/exercise-records", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(exerciseRecords, crewId) }));
});

app.get("/api/biodata", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(biodata, crewId) }));
});

app.get("/api/monitor-parameters", (c) => c.json(published({ records: monitorParameters })));
app.get("/api/cabin", (c) => c.json(published({ records: cabinConditions })));
app.get("/api/orbital", (c) => c.json(published({ records: orbitalConditions })));
app.get("/api/nutrition", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(
    published({ crewId, items: nutritionItems, records: filterByCrew(nutritionRecords, crewId) }),
  );
});
app.get("/api/access", (c) =>
  c.json(
    published({
      roles: accessRoles,
      note: "These demo codes are public fixtures. They do not authenticate a person.",
    }),
  ),
);
app.get("/api/trends", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  if (!crewId) {
    return c.json(published({ trends: crew.map((person) => trendFor(person.id)) }));
  }
  const trend = trendFor(crewId);
  if (!trend) return c.json(published({ error: "unknown_crew", crewId }), 404);
  return c.json(published({ trend }));
});
app.get("/api/verify", (c) => {
  const report = accuracyReport();
  return c.json(published(report), report.ok ? 200 : 422);
});

app.notFound((c) => c.json({ error: "not_found", disclaimer: DISCLAIMER }, 404));

export default app;

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (name) =>
  JSON.parse(await readFile(new URL(`../datasets/${name}.json`, import.meta.url), "utf8"));
const [
  { mission },
  { records: crew },
  { records: health },
  { records: exercises },
  { records: catalog },
  rules,
] = await Promise.all(
  [
    "mission",
    "crew",
    "health-records",
    "exercise-records",
    "exercise-catalog",
    "monitoring-rules",
  ].map(read),
);
const unique = (records, label) =>
  assert.equal(
    new Set(records.map((record) => record.id)).size,
    records.length,
    `${label} IDs must be unique`,
  );
const bounded = (value, min, max, label) =>
  assert.ok(Number.isFinite(value) && value >= min && value <= max, `${label}: ${value}`);
unique(crew, "Crew");
unique(health, "Health");
unique(exercises, "Exercise");
unique(catalog, "Activity");
assert.equal(crew.length, 5);
assert.equal(health.length, 150);
assert.equal(exercises.length, 25);
assert.equal(new Set(crew.map((person) => person.demoPin)).size, crew.length);
const ids = new Set(crew.map((person) => person.id));
const activities = new Set(catalog.map((activity) => activity.id));
for (const person of crew) {
  assert.equal(person.missionId, mission.id);
  assert.match(person.demoPin, /^\d{4}$/);
  const rows = health.filter((record) => record.crewId === person.id);
  assert.equal(rows.length, 30, `${person.name}: expected 30 fixture days`);
  assert.equal(new Set(rows.map((record) => record.missionDay)).size, 30);
  for (let day = mission.day - 29; day <= mission.day; day++)
    assert.ok(
      rows.some((record) => record.missionDay === day),
      `Missing ${person.id} day ${day}`,
    );
  assert.equal(
    rows.filter(
      (record) =>
        record.missionDay < mission.day &&
        record.missionDay >= mission.day - rules.baselineWindowDays,
    ).length,
    rules.baselineWindowDays,
  );
}
for (const record of health) {
  assert.ok(ids.has(record.crewId));
  assert.equal(record.missionId, mission.id);
  assert.equal(record.source, "synthetic_fixture");
  assert.ok(!Number.isNaN(Date.parse(record.recordedAt)));
  const r = record.reading;
  bounded(r.heart, 30, 220, record.id);
  bounded(r.systolic, 60, 250, record.id);
  bounded(r.diastolic, 30, 160, record.id);
  assert.ok(r.systolic > r.diastolic);
  bounded(r.sleep, 0, 24, record.id);
  bounded(r.fatigue, 1, 5, record.id);
  assert.equal(typeof r.mood, "string");
  assert.equal(typeof r.notes, "string");
  // New fields
  bounded(record.spo2, 1, 100, `${record.id} spo2`);
  bounded(record.glucoseMgDl, 1, 400, `${record.id} glucose`);
}
for (const record of exercises) {
  assert.ok(ids.has(record.crewId));
  assert.ok(activities.has(record.activityId));
  assert.equal(record.missionId, mission.id);
  assert.equal(record.source, "synthetic_fixture");
  bounded(record.missionDay, mission.day - 6, mission.day, record.id);
  bounded(record.durationMinutes, 1, 180, record.id);
  bounded(record.effort, 1, 10, record.id);
}
for (const value of [
  rules.heartDifferenceBpm,
  rules.pressureDifferenceMmHg,
  rules.sleepDecreaseHours,
  rules.fatigueIncreasePoints,
])
  assert.ok(value > 0);
console.log(
  "PASS: 5 simulation crew profiles, 150 synthetic health records, 25 exercise records, unique IDs, relationships, units/ranges, dates, and complete baseline/chart windows.",
);
await import("./verify-toolkit.mjs");
await import("./verify-features.mjs");

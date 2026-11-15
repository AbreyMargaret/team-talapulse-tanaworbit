import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (name) =>
  JSON.parse(await readFile(new URL(`../datasets/${name}.json`, import.meta.url), "utf8"));
const toolkit = await read("health-toolkit");
const faq = await read("assistant-faq");
const unique = (items, label) =>
  assert.equal(
    new Set(items.map((item) => item.id)).size,
    items.length,
    `${label} IDs must be unique`,
  );
assert.equal(toolkit.meta.synthetic, true);
assert.equal(faq.meta.synthetic, true);
for (const [items, label] of [
  [toolkit.sources, "source"],
  [toolkit.measurements, "measurement"],
  [toolkit.contexts, "context"],
  [toolkit.hazards, "hazard"],
  [toolkit.routines, "routine"],
  [faq.records, "FAQ"],
])
  unique(items, label);
const sourceIds = new Set(toolkit.sources.map((item) => item.id));
const hazardIds = new Set(toolkit.hazards.map((item) => item.id));
for (const source of toolkit.sources) {
  assert.ok(source.scope.length > 20);
  if (source.url) assert.equal(new URL(source.url).protocol, "https:");
}
const expectedMetrics = ["heart", "pressure", "sleep", "fatigue", "mood", "exercise"];
assert.deepEqual(
  toolkit.measurements.map((item) => item.id),
  expectedMetrics,
);
for (const item of toolkit.measurements) {
  assert.equal(item.steps.length, 4);
  assert.ok(item.limit.length > 30);
  for (const step of item.steps) assert.ok(step.title && step.text);
  for (const id of item.sourceIds) assert.ok(sourceIds.has(id));
}
assert.deepEqual(
  toolkit.contexts.map((item) => item.id),
  ["orbital", "transit", "lunar", "mars"],
);
assert.equal(toolkit.hazards.length, 5);
for (const context of toolkit.contexts) {
  assert.ok(context.measurementNote.length > 30);
  for (const id of context.hazardIds) assert.ok(hazardIds.has(id));
}
for (const hazard of toolkit.hazards) {
  assert.ok(hazard.limit.length > 30);
  for (const id of hazard.sourceIds) assert.ok(sourceIds.has(id));
}
assert.deepEqual(
  toolkit.routines.map((item) => item.id),
  ["checkin", "exercise", "guidance"],
);
const actions = new Set(["measure", "routine", "body", "context", "evidence", "exercise"]);
const templateKeys = new Set([
  "name",
  "heart",
  "heartBaseline",
  "systolic",
  "diastolic",
  "systolicBaseline",
  "diastolicBaseline",
  "sleep",
  "sleepBaseline",
  "fatigue",
  "fatigueBaseline",
  "mood",
  "glucose",
  "temperature",
  "spo2",
  "respiration",
  "context",
  "window",
]);
for (const record of faq.records) {
  assert.ok(record.question && record.answer && record.actionLabel);
  assert.ok(record.keywords.length);
  assert.ok(actions.has(record.action));
  for (const id of record.sourceIds) assert.ok(sourceIds.has(id));
  for (const [, key] of record.answer.matchAll(/\{\{(\w+)\}\}/g)) assert.ok(templateKeys.has(key));
}
assert.match(faq.safetyResponse, /cannot assess urgent symptoms/);
assert.match(faq.fallbackResponse, /written topics|fixed educational topics/);
console.log(
  "PASS: 6 four-step walkthroughs, 4 context previews, 5 hazards, 3 routine tasks, source links/IDs, FAQ actions/templates, and explicit clinical limitations.",
);

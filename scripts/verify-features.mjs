import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (name) =>
  JSON.parse(await readFile(new URL(`../datasets/${name}.json`, import.meta.url), "utf8"));
const [biodata, access, cabin, orbital, nutrition, parameters, { mission }, { records: crew }] =
  await Promise.all(
    [
      "biodata",
      "access",
      "cabin-conditions",
      "orbital-conditions",
      "nutrition",
      "monitor-parameters",
      "mission",
      "crew",
    ].map(read),
  );
const ids = new Set(crew.map((person) => person.id));
const bounded = (value, min, max, label) =>
  assert.ok(Number.isFinite(value) && value >= min && value <= max, `${label}: ${value}`);
const param = (id) => parameters.records.find((item) => item.id === id);

assert.equal(biodata.records.length, 4);
assert.equal(new Set(biodata.records.map((row) => row.crewId)).size, 4);
for (const row of biodata.records) {
  assert.ok(ids.has(row.crewId));
  bounded(row.ageYears, 18, 80, row.id);
  bounded(row.statureCm, 140, 220, row.id);
  bounded(row.massKg, 40, 150, row.id);
}

assert.deepEqual(
  access.roles.map((role) => role.id),
  ["admin", "tester"],
);
for (const role of access.roles) assert.match(role.demoCode, /^\d{4}$/);

assert.equal(cabin.records.length, 8);
assert.equal(orbital.records.length, 8);
for (let day = mission.day - 7; day <= mission.day; day++) {
  assert.ok(cabin.records.some((row) => row.missionDay === day), `cabin day ${day}`);
  assert.ok(orbital.records.some((row) => row.missionDay === day), `orbit day ${day}`);
}
for (const row of cabin.records) {
  for (const [id, key] of [
    ["pressureKpa", "pressureKpa"],
    ["co2MmHg", "co2MmHg"],
    ["o2Percent", "o2Percent"],
    ["cabinTemperatureC", "temperatureC"],
    ["humidityPercent", "humidityPercent"],
  ]) {
    const bounds = param(id);
    bounded(row[key], bounds.demoMin, bounds.demoMax, row.id);
  }
}
for (const row of orbital.records) {
  bounded(row.altitudeKm, param("altitudeKm").demoMin, param("altitudeKm").demoMax, row.id);
  bounded(row.velocityKms, param("velocityKms").demoMin, param("velocityKms").demoMax, row.id);
  assert.ok(row.lighting === "sunlight" || row.lighting === "eclipse");
}

assert.equal(nutrition.items.length, 6);
assert.equal(nutrition.records.length, 28);
const menu = new Set(nutrition.items.map((item) => item.id));
for (const row of nutrition.records) {
  assert.ok(ids.has(row.crewId));
  assert.equal(row.missionId, mission.id);
  assert.ok(row.itemIds.every((id) => menu.has(id)));
  bounded(row.kcal, param("kcal").demoMin, param("kcal").demoMax, row.id);
  bounded(row.waterMl, param("waterMl").demoMin, param("waterMl").demoMax, row.id);
}

assert.ok(parameters.records.length >= 16);
for (const id of ["heart", "systolic", "sleep", "fatigue", "pressureKpa", "altitudeKm", "kcal"])
  assert.ok(param(id), id);

console.log(
  "PASS: biodata, monitor parameters, cabin samples, orbital samples, nutrition logs, and public backend demo codes.",
);

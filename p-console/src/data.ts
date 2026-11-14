import crewData from "../../datasets/crew.json";
import missionData from "../../datasets/mission.json";
import healthData from "../../datasets/health-records.json";
import exerciseData from "../../datasets/exercise-records.json";
import catalogData from "../../datasets/exercise-catalog.json";
import rulesData from "../../datasets/monitoring-rules.json";
import biodataFile from "../../datasets/biodata.json";
import accessFile from "../../datasets/access.json";
import cabinFile from "../../datasets/cabin-conditions.json";
import orbitalFile from "../../datasets/orbital-conditions.json";
import nutritionFile from "../../datasets/nutrition.json";
import parameterFile from "../../datasets/monitor-parameters.json";

export const crew = crewData.records;
export type CrewMember = (typeof crew)[number];
export const mission = missionData.mission;
export const rules = rulesData;
export const exerciseCatalog = catalogData.records;

export type Reading = {
  heart: number;
  systolic: number;
  diastolic: number;
  sleep: number;
  fatigue: number;
  mood: string;
  notes: string;
};
export type HealthRecord = {
  id: string;
  crewId: string;
  missionId: string;
  missionDay: number;
  recordedAt: string;
  source: string;
  reading: Reading;
  temperatureC: number;
  respiration: number;
};
export type ExerciseRecord = {
  id: string;
  crewId: string;
  missionId: string;
  missionDay: number;
  activityId: string;
  durationMinutes: number;
  effort: number;
  notes: string;
  source: string;
};
export const healthRecords: HealthRecord[] = healthData.records;
export const initialExercises: ExerciseRecord[] = exerciseData.records;

export function historyFor(crewId: string, days = 30): HealthRecord[] {
  return healthRecords
    .filter(
      (record) =>
        record.crewId === crewId &&
        record.missionId === mission.id &&
        record.missionDay > mission.day - days &&
        record.missionDay <= mission.day,
    )
    .sort((a, b) => a.missionDay - b.missionDay);
}

export function latestRecord(crewId: string): HealthRecord {
  const history = historyFor(crewId);
  const latest = history[history.length - 1];
  if (!latest) throw new Error(`Missing synthetic history for ${crewId}`);
  return latest;
}

export function personalBaseline(crewId: string): Reading {
  const records = healthRecords.filter(
    (record) =>
      record.crewId === crewId &&
      record.missionId === mission.id &&
      record.missionDay < mission.day &&
      record.missionDay >= mission.day - rules.baselineWindowDays,
  );
  if (!records.length) throw new Error(`Missing synthetic baseline history for ${crewId}`);
  const mean = (key: "heart" | "systolic" | "diastolic" | "sleep" | "fatigue") =>
    Math.round(
      (records.reduce((total, record) => total + record.reading[key], 0) / records.length) * 10,
    ) / 10;
  return {
    heart: mean("heart"),
    systolic: mean("systolic"),
    diastolic: mean("diastolic"),
    sleep: mean("sleep"),
    fatigue: mean("fatigue"),
    mood: "Reference",
    notes: "",
  };
}

export function observationFlags(reading: Reading, baseline: Reading) {
  return {
    heart: Math.abs(reading.heart - baseline.heart) > rules.heartDifferenceBpm,
    pressure:
      Math.abs(reading.systolic - baseline.systolic) > rules.pressureDifferenceMmHg ||
      Math.abs(reading.diastolic - baseline.diastolic) > rules.pressureDifferenceMmHg,
    sleep: baseline.sleep - reading.sleep > rules.sleepDecreaseHours,
    fatigue: reading.fatigue - baseline.fatigue > rules.fatigueIncreasePoints,
  };
}

export function crewStatus(index: number, reading: Reading): "Stable" | "Observe" | "Attention" {
  if (crew[index].reviewRequested) return "Attention";
  const flags = observationFlags(reading, personalBaseline(crew[index].id));
  return Object.values(flags).some(Boolean) ? "Observe" : "Stable";
}

export const biodata = biodataFile.records;
export const accessRoles = accessFile.roles;
export const cabinConditions = [...cabinFile.records].sort((a, b) => a.missionDay - b.missionDay);
export const orbitalConditions = [...orbitalFile.records].sort((a, b) => a.missionDay - b.missionDay);
export const nutritionItems = nutritionFile.items;
export const nutritionRecords = nutritionFile.records;
export const monitorParameters = parameterFile.records;

export function biodataFor(crewId: string) {
  const row = biodata.find((item) => item.crewId === crewId);
  if (!row) throw new Error(`Missing synthetic biodata for ${crewId}`);
  return row;
}

export function nutritionFor(crewId: string) {
  return nutritionRecords
    .filter((record) => record.crewId === crewId && record.missionId === mission.id)
    .sort((a, b) => a.missionDay - b.missionDay);
}

export function trendWindow(crewId: string): HealthRecord[] {
  return historyFor(crewId, rules.baselineWindowDays + 1).filter(
    (record) => record.missionDay < mission.day,
  );
}

export function trendCalculation(crewId: string, current: Reading) {
  const window = trendWindow(crewId);
  const baseline = personalBaseline(crewId);
  const flags = observationFlags(current, baseline);
  const rows = (
    [
      ["heart", "Heart rate", "bpm", flags.heart, `Absolute difference above ${rules.heartDifferenceBpm}`],
      ["systolic", "Systolic pressure", "mmHg", flags.pressure, `Absolute difference above ${rules.pressureDifferenceMmHg}`],
      ["diastolic", "Diastolic pressure", "mmHg", flags.pressure, `Absolute difference above ${rules.pressureDifferenceMmHg}`],
      ["sleep", "Sleep", "hours", flags.sleep, `Decrease above ${rules.sleepDecreaseHours}`],
      ["fatigue", "Fatigue", "1–5", flags.fatigue, `Increase above ${rules.fatigueIncreasePoints}`],
    ] as const
  ).map(([key, label, unit, flagged, rule]) => ({
    key,
    label,
    unit,
    flagged,
    rule,
    current: current[key],
    baseline: baseline[key],
    delta: Math.round((current[key] - baseline[key]) * 10) / 10,
  }));
  return { window, baseline, rows };
}

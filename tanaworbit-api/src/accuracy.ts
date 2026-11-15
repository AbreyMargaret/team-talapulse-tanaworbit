import {
  biodata,
  cabinConditions,
  crew,
  exerciseCatalog,
  exerciseRecords,
  healthRecords,
  mission,
  monitorParameters,
  monitoringRules,
  nutritionItems,
  nutritionRecords,
  orbitalConditions,
} from "./fixtures";

export type AccuracyCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

type ReadingKey = "heart" | "systolic" | "diastolic" | "sleep" | "fatigue";

const readingKeys: ReadingKey[] = ["heart", "systolic", "diastolic", "sleep", "fatigue"];

function mean(values: number[]): number {
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
}

function check(id: string, label: string, ok: boolean, detail: string): AccuracyCheck {
  return { id, label, ok, detail };
}

export function baselineFor(crewId: string) {
  const window = healthRecords.filter(
    (record) =>
      record.crewId === crewId &&
      record.missionId === mission.id &&
      record.missionDay < mission.day &&
      record.missionDay >= mission.day - monitoringRules.baselineWindowDays,
  );
  const value = (key: ReadingKey) => mean(window.map((record) => record.reading[key]));
  return {
    sampleCount: window.length,
    heart: value("heart"),
    systolic: value("systolic"),
    diastolic: value("diastolic"),
    sleep: value("sleep"),
    fatigue: value("fatigue"),
  };
}

export function latestHealth(crewId: string) {
  return healthRecords
    .filter((record) => record.crewId === crewId && record.missionId === mission.id)
    .sort((a, b) => a.missionDay - b.missionDay)
    .at(-1);
}

export type JudgeReading = {
  heart: number;
  systolic: number;
  diastolic: number;
  sleep: number;
  fatigue: number;
};

export function judgeReading(crewId: string, reading: JudgeReading) {
  const person = crew.find((item) => item.id === crewId);
  const baseline = baselineFor(crewId);
  if (!person || baseline.sampleCount === 0) return null;
  const gap = (value: number, from: number) => Math.round((value - from) * 10) / 10;
  const flags = {
    heart: Math.abs(reading.heart - baseline.heart) > monitoringRules.heartDifferenceBpm,
    pressure:
      Math.abs(reading.systolic - baseline.systolic) > monitoringRules.pressureDifferenceMmHg ||
      Math.abs(reading.diastolic - baseline.diastolic) > monitoringRules.pressureDifferenceMmHg,
    sleep: baseline.sleep - reading.sleep > monitoringRules.sleepDecreaseHours,
    fatigue: reading.fatigue - baseline.fatigue > monitoringRules.fatigueIncreasePoints,
  };
  const numberStatus = Object.values(flags).some(Boolean) ? "Observe" : "Stable";
  const status = person.reviewRequested ? "Attention" : numberStatus;
  const label = status === "Attention" ? "Flagged" : status === "Observe" ? "Different" : "Usual";
  return {
    crewId: person.id,
    name: person.name,
    reviewRequested: person.reviewRequested,
    baseline,
    reading,
    flags,
    numberStatus,
    status,
    label,
    stored: false,
    checks: [
      {
        id: "heart",
        fired: flags.heart,
        text: `Heart rate ${reading.heart} is ${gap(reading.heart, baseline.heart)} bpm from the 14-day average ${baseline.heart}. It is marked when the difference is more than ${monitoringRules.heartDifferenceBpm} bpm.`,
      },
      {
        id: "pressure",
        fired: flags.pressure,
        text: `Blood pressure ${reading.systolic}/${reading.diastolic} is ${gap(reading.systolic, baseline.systolic)} / ${gap(reading.diastolic, baseline.diastolic)} mmHg from ${baseline.systolic}/${baseline.diastolic}. It is marked when either number differs by more than ${monitoringRules.pressureDifferenceMmHg} mmHg.`,
      },
      {
        id: "sleep",
        fired: flags.sleep,
        text: `Sleep ${reading.sleep} hrs is ${gap(reading.sleep, baseline.sleep)} hrs from the 14-day average ${baseline.sleep}. It is marked only when sleep is more than ${monitoringRules.sleepDecreaseHours} hour shorter.`,
      },
      {
        id: "fatigue",
        fired: flags.fatigue,
        text: `How tired ${reading.fatigue} is ${gap(reading.fatigue, baseline.fatigue)} from the 14-day average ${baseline.fatigue}. It is marked when it is more than ${monitoringRules.fatigueIncreasePoints} higher.`,
      },
      {
        id: "review",
        fired: person.reviewRequested,
        text: person.reviewRequested
          ? "This person is marked for a second look, so the label is Flagged even when the numbers are close."
          : "This person is not marked for a second look. The label follows the four number rules.",
      },
    ],
  };
}

export function trendFor(crewId: string) {
  const latest = latestHealth(crewId);
  if (!latest) return null;
  const judged = judgeReading(crewId, latest.reading);
  if (!judged) return null;
  return {
    crewId,
    missionDay: mission.day,
    windowDays: monitoringRules.baselineWindowDays,
    sampleCount: judged.baseline.sampleCount,
    baseline: judged.baseline,
    latest: latest.reading,
    flags: judged.flags,
  };
}

function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function accuracyReport(): { ok: boolean; checks: AccuracyCheck[] } {
  const checks: AccuracyCheck[] = [];
  const crewIds = new Set(crew.map((person) => person.id));
  const push = (item: AccuracyCheck) => checks.push(item);

  push(
    check(
      "crew-count",
      "Simulation crew profiles",
      crew.length === 5 && new Set(crew.map((person) => person.demoPin)).size === 5,
      `${crew.length} profiles, ${new Set(crew.map((person) => person.demoPin)).size} public demo PINs`,
    ),
  );
  push(
    check(
      "health-count",
      "150 health records, 30 days each",
      healthRecords.length === 150 &&
        crew.every(
          (person) => healthRecords.filter((record) => record.crewId === person.id).length === 30,
        ),
      `${healthRecords.length} health records`,
    ),
  );
  push(
    check(
      "baseline-window",
      "14 prior days available for every crew baseline",
      crew.every((person) => baselineFor(person.id).sampleCount === monitoringRules.baselineWindowDays),
      `Window is ${monitoringRules.baselineWindowDays} mission days before day ${mission.day}`,
    ),
  );
  push(
    check(
      "exercise-links",
      "Exercise records point at real crew and activities",
      exerciseRecords.length === 25 &&
        exerciseRecords.every(
          (record) =>
            crewIds.has(record.crewId) &&
            exerciseCatalog.some((activity) => activity.id === record.activityId),
        ),
      `${exerciseRecords.length} exercise records`,
    ),
  );
  push(
    check(
      "biodata",
      "One biodata row per crew, inside demo body ranges",
      biodata.length === crew.length &&
        crew.every((person) =>
          biodata.some(
            (row) =>
              row.crewId === person.id &&
              inRange(row.ageYears, 18, 80) &&
              inRange(row.statureCm, 140, 220) &&
              inRange(row.massKg, 40, 150),
          ),
        ),
      `${biodata.length} biodata rows`,
    ),
  );

  const parameter = (id: string) => monitorParameters.find((item) => item.id === id);
  const healthInside = healthRecords.every((record) =>
    readingKeys.every((key) => {
      const bounds = parameter(key);
      return bounds ? inRange(record.reading[key], bounds.demoMin, bounds.demoMax) : false;
    }),
  );
  push(
    check(
      "monitor-parameters",
      "Crew readings sit inside the published monitor bounds",
      healthInside && ["heart", "systolic", "diastolic", "sleep", "fatigue"].every((id) => parameter(id)),
      `${monitorParameters.length} monitor parameters`,
    ),
  );

  const cabinOk = cabinConditions.length === 8 && cabinConditions.every((row) => {
    const pressure = parameter("pressureKpa");
    const co2 = parameter("co2MmHg");
    const oxygen = parameter("o2Percent");
    const temperature = parameter("cabinTemperatureC");
    const humidity = parameter("humidityPercent");
    return (
      pressure &&
      co2 &&
      oxygen &&
      temperature &&
      humidity &&
      inRange(row.pressureKpa, pressure.demoMin, pressure.demoMax) &&
      inRange(row.co2MmHg, co2.demoMin, co2.demoMax) &&
      inRange(row.o2Percent, oxygen.demoMin, oxygen.demoMax) &&
      inRange(row.temperatureC, temperature.demoMin, temperature.demoMax) &&
      inRange(row.humidityPercent, humidity.demoMin, humidity.demoMax)
    );
  });
  push(check("cabin", "Cabin samples match the monitor bounds", cabinOk, `${cabinConditions.length} cabin samples`));

  const orbitOk =
    orbitalConditions.length === 8 &&
    orbitalConditions.every((row) => {
      const altitude = parameter("altitudeKm");
      const velocity = parameter("velocityKms");
      return (
        altitude &&
        velocity &&
        inRange(row.altitudeKm, altitude.demoMin, altitude.demoMax) &&
        inRange(row.velocityKms, velocity.demoMin, velocity.demoMax) &&
        (row.lighting === "sunlight" || row.lighting === "eclipse")
      );
    });
  push(
    check(
      "orbit",
      "Orbital samples stay in the scripted demo bounds",
      orbitOk,
      `${orbitalConditions.length} orbital samples`,
    ),
  );

  const itemIds = new Set(nutritionItems.map((item) => item.id));
  const nutritionOk =
    nutritionRecords.length === 35 &&
    nutritionRecords.every((row) => {
      const energy = parameter("kcal");
      const water = parameter("waterMl");
      return (
        crewIds.has(row.crewId) &&
        energy &&
        water &&
        row.itemIds.every((id) => itemIds.has(id)) &&
        inRange(row.kcal, energy.demoMin, energy.demoMax) &&
        inRange(row.waterMl, water.demoMin, water.demoMax)
      );
    });
  push(
    check(
      "nutrition",
      "Nutrition logs reference the menu and stay inside demo bounds",
      nutritionOk,
      `${nutritionRecords.length} intake rows, ${nutritionItems.length} menu items`,
    ),
  );

  const trendOk = crew.every((person) => {
    const trend = trendFor(person.id);
    return trend !== null && trend.sampleCount === 14 && readingKeys.every((key) => Number.isFinite(trend.baseline[key]));
  });
  push(
    check(
      "trend-math",
      "Personal baselines are means of the previous 14 synthetic days",
      trendOk,
      "Rounded to one decimal. Not a medical norm.",
    ),
  );

  return { ok: checks.every((item) => item.ok), checks };
}

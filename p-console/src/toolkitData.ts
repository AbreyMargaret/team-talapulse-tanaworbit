import toolkit from "../../datasets/health-toolkit.json";
import faq from "../../datasets/assistant-faq.json";
import { observationFlags, type BodySample, type Reading } from "./data";

export type ToolkitTab = "measure" | "routine" | "body" | "context" | "evidence";
export type MetricId = "heart" | "pressure" | "sleep" | "fatigue" | "mood" | "exercise";
export type MeasurementGuide = {
  id: MetricId;
  title: string;
  unit: string;
  method: string;
  why: string;
  limit: string;
  sourceIds: string[];
  steps: { title: string; text: string }[];
};
export const measurementGuides = toolkit.measurements as MeasurementGuide[];
export const knowledgeSources = toolkit.sources;
export const missionContexts = toolkit.contexts;
export const spaceHazards = toolkit.hazards;
export const routineDefinitions = toolkit.routines;
export const toolkitVersion = toolkit.meta.contentVersion;
export type MissionContext = (typeof missionContexts)[number];
export type FaqRecord = {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  sourceIds: string[];
  action: ToolkitTab | "exercise";
  actionLabel: string;
};
export const guideQuestions = faq.records as FaqRecord[];
export const safetyResponse = faq.safetyResponse;
export const fallbackResponse = faq.fallbackResponse;

export function sourceFor(id: string) {
  const source = knowledgeSources.find((item) => item.id === id);
  if (!source) throw new Error(`Missing educational source ${id}`);
  return source;
}

export function metricValue(id: MetricId, reading: Reading) {
  if (id === "heart") return `${reading.heart} bpm`;
  if (id === "pressure") return `${reading.systolic}/${reading.diastolic} mmHg`;
  if (id === "sleep") return `${reading.sleep} hours`;
  if (id === "fatigue") return `${reading.fatigue} / 5`;
  if (id === "mood") return reading.mood;
  return "Manual session log";
}

export function describeObservations(reading: Reading, baseline: Reading) {
  const flags = observationFlags(reading, baseline);
  const delta = (value: number) => Number(value.toFixed(1));
  return [
    {
      id: "sleep" as MetricId,
      flagged: flags.sleep,
      title: "Sleep context",
      summary: `${reading.sleep} hours recorded; ${baseline.sleep} hours in the synthetic example baseline.`,
      difference: `${Math.abs(delta(reading.sleep - baseline.sleep))} hours ${reading.sleep < baseline.sleep ? "below" : "above"} the example baseline.`,
      next: "Check the reporting period and units, add interruption or workload context, and review the sleep explanation. A duration alone is not a diagnosis.",
    },
    {
      id: "fatigue" as MetricId,
      flagged: flags.fatigue,
      title: "Reported fatigue",
      summary: `${reading.fatigue}/5 recorded; ${baseline.fatigue}/5 in the example baseline.`,
      difference: `${Math.abs(delta(reading.fatigue - baseline.fatigue))} points of difference on this demo scale.`,
      next: "Confirm the scale meaning and review recent sleep and activity context. This self-report is not a medical severity or fitness-for-duty score.",
    },
    {
      id: "heart" as MetricId,
      flagged: flags.heart,
      title: "Heart-rate context",
      summary: `${reading.heart} bpm recorded; ${baseline.heart} bpm in the example baseline.`,
      difference: `${Math.abs(delta(reading.heart - baseline.heart))} bpm of difference from the example baseline.`,
      next: "Verify the source, units, and measurement conditions using the approved procedure, then record recent activity or other context. This comparison cannot identify a cause or establish safety.",
    },
    {
      id: "pressure" as MetricId,
      flagged: flags.pressure,
      title: "Blood-pressure context",
      summary: `${reading.systolic}/${reading.diastolic} mmHg recorded; ${baseline.systolic}/${baseline.diastolic} mmHg in the example baseline.`,
      difference: "The two components are compared separately using the unvalidated demo rules.",
      next: "Read back systolic and diastolic, check units and instrument conditions, and follow the actual mission procedure for any concern. The app does not prescribe a correction or medication.",
    },
  ];
}

export function selectGuideAnswer(query: string) {
  const text = query.toLowerCase();
  if (
    /(chest\s*pain|collaps|can.?t breathe|cannot breathe|suicid|medicat|dosage|\bdose\b|diagnos|emergenc)/i.test(
      text,
    )
  ) {
    return { text: safetyResponse, record: null };
  }
  const ranked = guideQuestions
    .map((record) => ({
      record,
      score: record.keywords.filter((word) => text.includes(word)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score
    ? { text: ranked[0].record.answer, record: ranked[0].record }
    : { text: fallbackResponse, record: null };
}

export function fillGuideTemplate(
  text: string,
  name: string,
  reading: Reading,
  baseline: Reading,
  sample: BodySample,
  context: string,
  window: number,
) {
  const values: Record<string, string> = {
    name,
    heart: String(reading.heart),
    heartBaseline: String(baseline.heart),
    systolic: String(reading.systolic),
    diastolic: String(reading.diastolic),
    systolicBaseline: String(baseline.systolic),
    diastolicBaseline: String(baseline.diastolic),
    sleep: String(reading.sleep),
    sleepBaseline: String(baseline.sleep),
    fatigue: String(reading.fatigue),
    fatigueBaseline: String(baseline.fatigue),
    mood: reading.mood,
    glucose: String(sample.glucoseMgDl),
    temperature: String(sample.temperatureC),
    spo2: String(sample.spo2),
    respiration: String(sample.respiration),
    context,
    window: String(window),
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");
}

import crewData from "../../datasets/crew.json";
import missionData from "../../datasets/mission.json";
import healthData from "../../datasets/health-records.json";
import exerciseData from "../../datasets/exercise-records.json";
import catalogData from "../../datasets/exercise-catalog.json";
import rulesData from "../../datasets/monitoring-rules.json";
import toolkitData from "../../datasets/health-toolkit.json";
import faqData from "../../datasets/assistant-faq.json";
import biodataFile from "../../datasets/biodata.json";
import accessFile from "../../datasets/access.json";
import cabinFile from "../../datasets/cabin-conditions.json";
import orbitalFile from "../../datasets/orbital-conditions.json";
import nutritionFile from "../../datasets/nutrition.json";
import parameterFile from "../../datasets/monitor-parameters.json";

export const DISCLAIMER =
  "Synthetic educational fixtures for the TanawOrbit prototype. Not a medical device, not a diagnosis, not NASA telemetry, and not a clinical record. Demo PINs are public and are not authentication.";

export const crew = crewData.records;
export const mission = missionData.mission;
export const healthRecords = healthData.records;
export const exerciseRecords = exerciseData.records;
export const exerciseCatalog = catalogData.records;
export const monitoringRules = rulesData;
export const toolkit = toolkitData;
export const faq = faqData;
export const biodata = biodataFile.records;
export const accessRoles = accessFile.roles;
export const cabinConditions = cabinFile.records;
export const orbitalConditions = orbitalFile.records;
export const nutritionItems = nutritionFile.items;
export const nutritionRecords = nutritionFile.records;
export const monitorParameters = parameterFile.records;

const CREW_ID = /^crew-[a-z0-9-]{1,32}$/;

export function crewIdFrom(url: URL): string | null {
  const crewId = url.searchParams.get("crewId");
  if (crewId === null || crewId === "") return null;
  return CREW_ID.test(crewId) ? crewId : "";
}

export function filterByCrew<T extends { crewId: string }>(records: T[], crewId: string | null): T[] {
  if (crewId === null) return records;
  if (crewId === "") return [];
  return records.filter((record) => record.crewId === crewId);
}

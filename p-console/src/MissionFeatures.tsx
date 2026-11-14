import type { ReactNode } from "react";
import {
  biodataFor,
  cabinConditions,
  mission,
  monitorParameters,
  nutritionFor,
  nutritionItems,
  orbitalConditions,
  trendCalculation,
  type Reading,
} from "./data";
import "./features.css";

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="panel feature-stack">
      <div>
        <h2>{title}</h2>
        <p className="feature-note">{note}</p>
      </div>
      {children}
    </section>
  );
}

export function BiodataPanel({ crewId }: { crewId: string }) {
  const row = biodataFor(crewId);
  const facts = [
    ["Age", `${row.ageYears} years`],
    ["Stature", `${row.statureCm} cm`],
    ["Mass", `${row.massKg} kg`],
    ["Blood-type label", row.bloodTypeLabel],
    ["Dominant side", row.dominantSide],
    ["Analog days", String(row.analogDays)],
  ];
  return (
    <Panel
      title="Biodata"
      note="Fictional body description for this profile. It is not a clinical record and it does not change the health comparison."
    >
      <div className="feature-grid">
        {facts.map(([label, value]) => (
          <div className="feature-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function MonitorParametersPanel() {
  return (
    <Panel
      title="Monitor parameters"
      note="These are the demonstration fields and bounds the tester checks. A bound is not a clinical limit or a NASA alarm."
    >
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Group</th>
              <th>Unit</th>
              <th>Demo range</th>
              <th>Comparison</th>
            </tr>
          </thead>
          <tbody>
            {monitorParameters.map((item) => (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>{item.group}</td>
                <td>{item.unit}</td>
                <td>
                  {item.demoMin}–{item.demoMax}
                </td>
                <td>{item.comparison}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function CalculationTrendPanel({ crewId, reading }: { crewId: string; reading: Reading }) {
  const trend = trendCalculation(crewId, reading);
  return (
    <Panel
      title="Calculation trend"
      note={`Baseline = arithmetic mean of mission days ${mission.day - trend.window.length} through ${mission.day - 1}, rounded to one decimal. The current reading can replace today's fixture in this browser session only.`}
    >
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Measure</th>
              <th>Current</th>
              <th>14-day mean</th>
              <th>Difference</th>
              <th>Demo rule</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {trend.rows.map((row) => (
              <tr key={row.key}>
                <td>{row.label}</td>
                <td>
                  {row.current} {row.unit}
                </td>
                <td>
                  {row.baseline} {row.unit}
                </td>
                <td>{row.delta}</td>
                <td>{row.rule}</td>
                <td className={row.flagged ? "feature-flag" : "feature-ok"}>
                  {row.flagged ? "Observe" : "Within demo rule"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="feature-note">
        {trend.window.length} synthetic days are in the window. Stable does not mean healthy. Observe
        does not mean a diagnosis.
      </p>
    </Panel>
  );
}

export function CabinPanel() {
  const latest = cabinConditions[cabinConditions.length - 1];
  return (
    <Panel
      title="Cabin internal conditions"
      note="Scripted samples for the shared fictional cabin. They are not life-support telemetry and they do not change a crew member's health flags."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span>Pressure</span>
          <strong>{latest.pressureKpa} kPa</strong>
        </div>
        <div className="feature-stat">
          <span>Carbon dioxide</span>
          <strong>{latest.co2MmHg} mmHg</strong>
        </div>
        <div className="feature-stat">
          <span>Oxygen</span>
          <strong>{latest.o2Percent}%</strong>
        </div>
        <div className="feature-stat">
          <span>Temperature</span>
          <strong>{latest.temperatureC} °C</strong>
        </div>
        <div className="feature-stat">
          <span>Humidity</span>
          <strong>{latest.humidityPercent}%</strong>
        </div>
        <div className="feature-stat">
          <span>Noise</span>
          <strong>{latest.noiseDb} dB</strong>
        </div>
      </div>
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Pressure</th>
              <th>CO₂</th>
              <th>O₂</th>
              <th>Temp</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {cabinConditions.map((row) => (
              <tr key={row.id}>
                <td>{row.missionDay}</td>
                <td>{row.pressureKpa}</td>
                <td>{row.co2MmHg}</td>
                <td>{row.o2Percent}</td>
                <td>{row.temperatureC}</td>
                <td>{row.humidityPercent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function OrbitalPanel() {
  const latest = orbitalConditions[orbitalConditions.length - 1];
  return (
    <Panel
      title="Dynamic orbital conditions"
      note="A short scripted series for Aster Expedition VII. Altitude and lighting change by sample. They do not alter baselines or comparison rules."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span>Altitude</span>
          <strong>{latest.altitudeKm} km</strong>
        </div>
        <div className="feature-stat">
          <span>Velocity</span>
          <strong>{latest.velocityKms} km/s</strong>
        </div>
        <div className="feature-stat">
          <span>Lighting</span>
          <strong>{latest.lighting}</strong>
        </div>
        <div className="feature-stat">
          <span>Beta angle</span>
          <strong>{latest.betaAngleDeg}°</strong>
        </div>
        <div className="feature-stat">
          <span>Eclipse</span>
          <strong>{latest.eclipseMinutes} min</strong>
        </div>
        <div className="feature-stat">
          <span>Gravity label</span>
          <strong>{latest.gravity}</strong>
        </div>
      </div>
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Altitude</th>
              <th>Velocity</th>
              <th>Lighting</th>
              <th>Eclipse</th>
              <th>Beta</th>
            </tr>
          </thead>
          <tbody>
            {orbitalConditions.map((row) => (
              <tr key={row.id}>
                <td>{row.missionDay}</td>
                <td>{row.altitudeKm} km</td>
                <td>{row.velocityKms}</td>
                <td>{row.lighting}</td>
                <td>{row.eclipseMinutes}</td>
                <td>{row.betaAngleDeg}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function NutritionPanel({ crewId }: { crewId: string }) {
  const rows = nutritionFor(crewId);
  const today = rows.find((row) => row.missionDay === mission.day) ?? rows[rows.length - 1];
  const names = new Map(nutritionItems.map((item) => [item.id, item.name]));
  return (
    <Panel
      title="Space nutrition"
      note="Example intake for this fictional profile. It is not a diet order, a fluid prescription, or a clinical target."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span>Day {today.missionDay} energy</span>
          <strong>{today.kcal} kcal</strong>
        </div>
        <div className="feature-stat">
          <span>Water</span>
          <strong>{today.waterMl} mL</strong>
        </div>
        <div className="feature-stat">
          <span>Protein</span>
          <strong>{today.proteinG} g</strong>
        </div>
        <div className="feature-stat">
          <span>Sodium</span>
          <strong>{today.sodiumMg} mg</strong>
        </div>
      </div>
      <p className="feature-note">
        Menu on that day: {today.itemIds.map((id) => names.get(id) ?? id).join(", ")}.
      </p>
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Energy</th>
              <th>Water</th>
              <th>Protein</th>
              <th>Sodium</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.missionDay}</td>
                <td>{row.kcal}</td>
                <td>{row.waterMl}</td>
                <td>{row.proteinG}</td>
                <td>{row.sodiumMg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}


import PumaTracker from "./PumaTracker";
import SensorimotorTest, { type SensorimotorResult } from "./SensorimotorTest";

export function PumaPanel() {
  return (
    <Panel
      title="Metabolic gas analysis (NASA PUMA Suite)"
      note="Real-time breath-by-breath gas exchange, oxygen uptake, and carbon dioxide output from the Portable Unit for Metabolic Analysis."
    >
      <PumaTracker />
    </Panel>
  );
}

export function SensorimotorPanel({
  onRecordResult,
}: {
  onRecordResult?: (res: SensorimotorResult) => void;
}) {
  return (
    <Panel
      title="Sensorimotor & fine motor testing"
      note="Standardized in-flight sensorimotor test battery (NASA TM-2020-5008023). Measures hand-eye spatial tracking accuracy and visual reaction time."
    >
      <SensorimotorTest onRecordResult={onRecordResult} />
    </Panel>
  );
}

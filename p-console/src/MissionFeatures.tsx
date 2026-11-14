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
import { MaybeTerm } from "./Term";

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="panel feature-stack">
      <div className="feature-header">
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
      note="Age, height, mass, and a few notes for this person."
    >
      <div className="feature-grid">
        {facts.map(([label, value]) => (
          <div className="feature-stat" key={label}>
            <span>
              <MaybeTerm>{label}</MaybeTerm>
            </span>
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
      note="The ranges this page uses when it compares a reading with the recent average."
    >
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Group</th>
              <th>Unit</th>
              <th>Range</th>
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
      note={`Average of days ${mission.day - trend.window.length} through ${mission.day - 1}. A number you record can stand in for today until you refresh.`}
    >
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Measure</th>
              <th>Current</th>
              <th>14-day mean</th>
              <th>Difference</th>
              <th>Range</th>
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
                  {row.flagged ? "Different" : "Inside the range"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="feature-note">
        {trend.window.length} days are in this window.
      </p>
    </Panel>
  );
}

export function CabinPanel() {
  const latest = cabinConditions[cabinConditions.length - 1];
  return (
    <Panel
      title="Cabin internal conditions"
      note="Pressure, gases, temperature, and noise in the cabin for this mission day."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span><MaybeTerm>Pressure</MaybeTerm></span>
          <strong>{latest.pressureKpa} kPa</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Carbon dioxide</MaybeTerm></span>
          <strong>{latest.co2MmHg} mmHg</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Oxygen</MaybeTerm></span>
          <strong>{latest.o2Percent}%</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Temperature</MaybeTerm></span>
          <strong>{latest.temperatureC} °C</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Humidity</MaybeTerm></span>
          <strong>{latest.humidityPercent}%</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Noise</MaybeTerm></span>
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
      note="Altitude, speed, and lighting for Aster Expedition VII."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span><MaybeTerm>Altitude</MaybeTerm></span>
          <strong>{latest.altitudeKm} km</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Velocity</MaybeTerm></span>
          <strong>{latest.velocityKms} km/s</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Lighting</MaybeTerm></span>
          <strong>{latest.lighting}</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Beta angle</MaybeTerm></span>
          <strong>{latest.betaAngleDeg}°</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Eclipse</MaybeTerm></span>
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
      note="Meals, energy, and water for this person today."
    >
      <div className="feature-grid">
        <div className="feature-stat">
          <span>Day {today.missionDay} energy</span>
          <strong>{today.kcal} kcal</strong>
        </div>
        <div className="feature-stat">
          <span><MaybeTerm>Water</MaybeTerm></span>
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
      <div className="feature-menu-callout">
        <strong>Planned Menu · FD {today.missionDay}</strong>
        <p>{today.itemIds.map((id) => names.get(id) ?? id).join(", ")}</p>
      </div>
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

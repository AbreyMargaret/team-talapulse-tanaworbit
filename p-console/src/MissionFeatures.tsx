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
  weekSummary,
  type ExerciseRecord,
  type Reading,
} from "./data";
import "./features.css";
import CognitionBattery, { type CognitionEntry } from "./CognitionBattery";
import { MaybeTerm } from "./Term";

function Panel({ title, note, children }: { title?: string; note?: string; children: ReactNode }) {
  return (
    <section className="panel feature-stack">
      {title && (
        <div className="feature-header">
          <h2>{title}</h2>
          {note && <p className="feature-note">{note}</p>}
        </div>
      )}
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
    <Panel>
      <div className="section-label">
        <h2>Body measurements</h2>
        <span>Age, height, mass, and a few body notes</span>
      </div>
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
    <Panel>
      <div className="section-label">
        <h2>Ranges we use</h2>
        <span>Stored reference ranges. Today's flags use the 14-day comparison, not this table.</span>
      </div>
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
    <Panel>
      <div className="section-label">
        <h2>Compared with the previous 14 days</h2>
        <span>Today's number minus the average of the previous {trend.window.length} days</span>
      </div>
      <div className="feature-table-wrap">
        <table className="feature-table">
          <thead>
            <tr>
              <th>Measure</th>
              <th>Current</th>
              <th>14-day mean</th>
              <th>Difference</th>
              <th>Rule</th>
              <th>Result</th>
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
                  {row.flagged ? "Different" : "Usual"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="feature-note">
        The average leaves out today. A row marked Different is not a medical status.
      </p>
    </Panel>
  );
}

export function CabinPanel() {
  const latest = cabinConditions[cabinConditions.length - 1];
  return (
    <Panel>
      <div className="section-label">
        <h2>Cabin air</h2>
        <span>Stored sample from day {latest.missionDay}. This is not a live sensor.</span>
      </div>
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
          <span><MaybeTerm>Relative humidity</MaybeTerm></span>
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
    <Panel>
      <div className="section-label">
        <h2>Orbit</h2>
        <span>Stored sample from day {latest.missionDay}. This is not a live orbit feed.</span>
      </div>
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

function showAmount(value: number | null, suffix: string) {
  if (value == null) return "—";
  return `${value} ${suffix}`;
}

export function WeekBoard({
  crewId,
  name,
  today,
  exercises,
  onOpen,
}: {
  crewId: string;
  name: string;
  today: Reading;
  exercises: ExerciseRecord[];
  onOpen: (
    page: "Physiological Monitoring" | "Space Nutrition" | "Cabin Conditions" | "Exercise & Recovery",
  ) => void;
}) {
  const week = weekSummary(crewId, today, exercises);
  const links = [
    ["Heart and breathing", "Physiological Monitoring"],
    ["Meals", "Space Nutrition"],
    ["Cabin air", "Cabin Conditions"],
    ["Exercise", "Exercise & Recovery"],
  ] as const;
  return (
    <section className="panel week-board" aria-labelledby="week-board-title">
      <div>
        <h2 id="week-board-title">This week</h2>
        <p className="week-note">
          Days {week.start}–{week.end} for {name}. Averages of the stored daily numbers. These are stored
          averages, not a forecast or a medical status.
        </p>
      </div>
      <div className="week-facts">
        <div>
          <span>Heart rate</span>
          <strong>{showAmount(week.heart, "bpm")}</strong>
        </div>
        <div>
          <span>Sleep</span>
          <strong>{showAmount(week.sleep, "hours")}</strong>
        </div>
        <div>
          <span>How tired</span>
          <strong>{showAmount(week.fatigue, "/ 5")}</strong>
        </div>
        <div>
          <span>Exercise</span>
          <strong>{week.exerciseMinutes} minutes</strong>
        </div>
        <div>
          <span>Meals</span>
          <strong>{showAmount(week.kcal, "kcal")}</strong>
        </div>
        <div>
          <span>Water</span>
          <strong>{showAmount(week.waterMl, "mL")}</strong>
        </div>
        <div>
          <span>Cabin pressure</span>
          <strong>
            {week.cabin ? `${week.cabin.pressureKpa} kPa` : "—"}
          </strong>
          {week.cabin && <small>Latest sample, day {week.cabin.missionDay}</small>}
        </div>
      </div>
      <div className="week-table-wrap">
        <table className="week-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Heart</th>
              <th>Sleep</th>
              <th>Tired</th>
            </tr>
          </thead>
          <tbody>
            {week.rows.map((row) => (
              <tr key={row.day} className={row.day === week.end ? "is-today" : undefined}>
                <td>{row.day === week.end ? `${row.day} (today)` : row.day}</td>
                <td>{row.heart}</td>
                <td>{row.sleep}</td>
                <td>{row.fatigue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="week-links">
        {links.map(([label, page]) => (
          <button key={page} type="button" onClick={() => onOpen(page)}>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

export function NutritionPanel({ crewId }: { crewId: string }) {
  const rows = nutritionFor(crewId);
  const today = rows.find((row) => row.missionDay === mission.day) ?? rows[rows.length - 1];
  const names = new Map(nutritionItems.map((item) => [item.id, item.name]));
  return (
    <Panel>
      <div className="section-label">
        <h2>Meals for this day</h2>
        <span>Stored menu for day {today.missionDay}.</span>
      </div>
      <div className="feature-grid">
        <div className="feature-stat">
          <span>Day {today.missionDay} Energy</span>
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
                <td>{row.kcal} kcal</td>
                <td>{row.waterMl} mL</td>
                <td>{row.proteinG} g</td>
                <td>{row.sodiumMg} mg</td>
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
    <Panel>
      <div className="section-label">
        <h2>Metabolic Gas Analysis (PUMA Suite)</h2>
        <span>Breath-by-breath gas exchange telemetry</span>
      </div>
      <PumaTracker />
    </Panel>
  );
}

export function SensorimotorPanel({
  crewId,
  crewName,
  dominantSide,
  cognitionEntries,
  onCognition,
  onRecordResult,
}: {
  crewId: string;
  crewName: string;
  dominantSide: string;
  cognitionEntries: CognitionEntry[];
  onCognition: (score: Omit<CognitionEntry, "id">) => void;
  onRecordResult?: (res: SensorimotorResult) => void;
}) {
  return (
    <>
      <CognitionBattery
        key={crewId}
        crewName={crewName}
        dominantSide={dominantSide}
        entries={cognitionEntries}
        onRecord={onCognition}
      />
      <Panel>
        <div className="section-label">
          <h2>Tapping and reaction</h2>
          <span>A short practice in this browser. This is not the NASA fine-motor battery.</span>
        </div>
        <SensorimotorTest onRecordResult={onRecordResult} />
      </Panel>
    </>
  );
}

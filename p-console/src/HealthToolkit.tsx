import { useEffect, useState } from "react";
import {
  healthRecords,
  historyFor,
  latestRecord,
  mission,
  rules,
  type CrewMember,
  type ExerciseRecord,
  type Reading,
} from "./data";
import {
  describeObservations,
  knowledgeSources,
  measurementGuides,
  metricValue,
  routineDefinitions,
  sourceFor,
  spaceHazards,
  toolkitVersion,
  type MetricId,
  type MissionContext,
  type ToolkitTab,
} from "./toolkitData";

type ReminderControls = {
  minutes: number;
  setMinutes: (value: number) => void;
  nextAt: number | null;
  due: boolean;
  snooze: () => void;
  dismiss: () => void;
};
type Props = {
  person: CrewMember;
  reading: Reading;
  baseline: Reading;
  checkedIn: boolean;
  exercises: ExerciseRecord[];
  tab: ToolkitTab;
  onTab: (tab: ToolkitTab) => void;
  metric: MetricId;
  onMetric: (metric: MetricId) => void;
  context: MissionContext;
  complete: Record<string, boolean>;
  onReviewed: (value: boolean) => void;
  reminder: ReminderControls;
  onRecord: (metric: MetricId) => void;
  onExercise: () => void;
  onPhysiology: () => void;
};
const tabs: { id: ToolkitTab; label: string }[] = [
  { id: "measure", label: "How to measure" },
  { id: "routine", label: "Your routine" },
  { id: "body", label: "Body overview" },
  { id: "context", label: "Mission context" },
  { id: "evidence", label: "Evidence & sources" },
];

function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <div className="toolkit-source-links">
      {ids.map((id) => {
        const source = sourceFor(id);
        return source.url ? (
          <a key={id} href={source.url} target="_blank" rel="noreferrer">
            {source.name}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span key={id}>{source.name}</span>
        );
      })}
    </div>
  );
}

function BodyOverview({
  reading,
  person,
  exercises,
  onRecord,
  onExercise,
  onPhysiology,
}: Pick<Props, "reading" | "person" | "exercises" | "onRecord" | "onExercise" | "onPhysiology">) {
  const [selected, setSelected] = useState("cardio");
  const minutes = exercises
    .filter((item) => item.crewId === person.id && item.missionDay === mission.day)
    .reduce((total, item) => total + item.durationMinutes, 0);
  const regions: {
    id: string;
    title: string;
    tag: string;
    top: string;
    left: string;
    metrics: [string, string][];
    text: string;
    action: MetricId | "physiology";
  }[] = [
    {
      id: "wellbeing",
      title: "Well-being & self-report",
      tag: "01",
      top: "10%",
      left: "50%",
      metrics: [
        ["Mood", reading.mood],
        ["Fatigue", `${reading.fatigue} / 5`],
      ],
      text: "These subjective entries can support a conversation about context. They do not diagnose a mental-health condition or measure brain function.",
      action: "mood",
    },
    {
      id: "cardio",
      title: "Cardiovascular context",
      tag: "02",
      top: "31%",
      left: "43%",
      metrics: [
        ["Heart rate", `${reading.heart} bpm`],
        ["Blood pressure", `${reading.systolic}/${reading.diastolic} mmHg`],
      ],
      text: "These values are displayed together for context. The schematic does not image the heart, identify disease, or determine the cause of a change.",
      action: "heart",
    },
    {
      id: "respiratory",
      title: "Respiratory context",
      tag: "03",
      top: "37%",
      left: "62%",
      metrics: [
        ["Respiration", `${latestRecord(person.id).respiration} breaths/min`],
        ["Source", "Display-only JSON fixture"],
      ],
      text: "The respiration value is a synthetic fixture. No breathing sensor, lung image, cabin-air measurement, or oxygen diagnosis is connected.",
      action: "physiology",
    },
    {
      id: "recovery",
      title: "Sleep & recovery context",
      tag: "04",
      top: "52%",
      left: "50%",
      metrics: [
        ["Sleep", `${reading.sleep} hours`],
        ["Fatigue", `${reading.fatigue} / 5`],
      ],
      text: "Sleep and self-reported fatigue are related context to review alongside work and exercise. They do not establish readiness or fitness for a task.",
      action: "sleep",
    },
    {
      id: "movement",
      title: "Movement & activity",
      tag: "05",
      top: "78%",
      left: "50%",
      metrics: [
        ["Recorded today", `${minutes} minutes`],
        ["Method", "Synthetic + manual demo logs"],
      ],
      text: "Activity totals describe the log, not muscle strength, bone density, recovery status, or safe exercise intensity.",
      action: "exercise",
    },
  ];
  const region = regions.find((item) => item.id === selected)!;
  return (
    <div className="toolkit-body-layout">
      <section className="panel body-schematic-panel">
        <div className="toolkit-section-heading">
          <span className="eyebrow">EXPLORE BY TOPIC</span>
          <h2>
            A body overview.
            <br />
            Not a body scan.
          </h2>
          <p>Select a point to see related information already available in this demo.</p>
        </div>
        <div className="body-schematic" role="group" aria-label="Schematic body topics">
          <svg viewBox="0 0 280 420" fill="none" aria-hidden="true">
            <defs>
              <pattern id="body-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" stroke="#3a6982" strokeOpacity=".13" />
              </pattern>
            </defs>
            <rect width="280" height="420" fill="url(#body-grid)" />
            <circle cx="140" cy="47" r="26" fill="#203e53" stroke="#6c9ab5" />
            <path
              d="M125 76v13h-13c-19 0-29 15-33 31L52 207c-4 13 11 21 18 8l31-67-6 99 7 136c1 17 22 17 24 0l14-113 14 113c2 17 23 17 24 0l7-136-6-99 31 67c7 13 22 5 18-8l-27-87c-4-16-14-31-33-31h-13V76"
              fill="#18374b"
              stroke="#6393ae"
              strokeWidth="1.5"
            />
            <path
              d="M140 101v145M105 172h70M112 248h56"
              stroke="#56839d"
              strokeOpacity=".35"
              strokeDasharray="4 6"
            />
          </svg>
          {regions.map((item) => (
            <button
              key={item.id}
              className={`body-hotspot ${selected === item.id ? "selected" : ""}`}
              style={{ top: item.top, left: item.left }}
              aria-label={item.title}
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
            >
              {item.tag}
            </button>
          ))}
        </div>
        <p className="body-schematic-caption">
          SI-GENERATED SCHEMATIC · NOT A SCAN OR DIAGNOSTIC MAP
        </p>
      </section>
      <div className="body-detail-column">
        <section className="panel body-region-detail">
          <span className="eyebrow">SELECTED TOPIC / {region.tag}</span>
          <h2>{region.title}</h2>
          <dl>
            {region.metrics.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p>{region.text}</p>
          <div className="body-region-actions">
            <button
              className="primary-button"
              onClick={() =>
                region.action === "exercise"
                  ? onExercise()
                  : region.action === "physiology"
                    ? onPhysiology()
                    : onRecord(region.action)
              }
            >
              {region.action === "exercise"
                ? "Open exercise log"
                : region.action === "physiology"
                  ? "Open physiological demo"
                  : "Open a related check-in field"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
        <div className="body-region-list" aria-label="Body overview topics">
          {regions.map((item) => (
            <button
              key={item.id}
              className={selected === item.id ? "selected" : ""}
              onClick={() => setSelected(item.id)}
            >
              <span>{item.tag}</span>
              {item.title}
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <div className="info-banner">
          <span className="toolkit-info-icon">i</span>
          <span>
            Points group information by topic. Selecting a body area does not generate a new finding
            or infer a problem in that organ.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HealthToolkit(props: Props) {
  const {
    person,
    reading,
    baseline,
    checkedIn,
    tab,
    onTab,
    metric,
    onMetric,
    context,
    complete,
    onReviewed,
    reminder,
    onRecord,
    onExercise,
  } = props;
  const [step, setStep] = useState(0);
  const guide = measurementGuides.find((item) => item.id === metric)!;
  const observation = describeObservations(reading, baseline).find((item) => item.id === metric);
  const reviewedCount = routineDefinitions.filter((item) => complete[item.id]).length;
  useEffect(() => setStep(0), [metric]);
  const rows = [
    [
      "Heart rate",
      `${reading.heart} bpm`,
      checkedIn ? "Manual demo input" : "Synthetic JSON",
      checkedIn ? "React memory / latest override" : "datasets/health-records.json",
    ],
    [
      "Blood pressure",
      `${reading.systolic}/${reading.diastolic} mmHg`,
      checkedIn ? "Manual demo input" : "Synthetic JSON",
      checkedIn ? "React memory / latest override" : "datasets/health-records.json",
    ],
    [
      "Sleep",
      `${reading.sleep} hours`,
      checkedIn ? "Manual demo input" : "Synthetic JSON",
      checkedIn ? "React memory / latest override" : "datasets/health-records.json",
    ],
    [
      "Fatigue & mood",
      `${reading.fatigue}/5 · ${reading.mood}`,
      checkedIn ? "Manual demo input" : "Synthetic JSON",
      checkedIn ? "React memory / latest override" : "datasets/health-records.json",
    ],
    [
      "Temperature",
      `${latestRecord(person.id).temperatureC} °C`,
      "Display-only fixture",
      "datasets/health-records.json",
    ],
    [
      "Respiration",
      `${latestRecord(person.id).respiration} breaths/min`,
      "Display-only fixture",
      "datasets/health-records.json",
    ],
    [
      "Personal baseline",
      `${rules.baselineWindowDays} prior synthetic days`,
      "Computed example mean",
      "src/data.ts → personalBaseline",
    ],
  ];

  return (
    <div className="health-toolkit">
      <div className="toolkit-intro">
        <div>
          <span className="eyebrow">KNOW THE METHOD. UNDERSTAND THE LIMITS.</span>
          <h2>
            A little guidance.
            <br />A more informed review.
          </h2>
          <p>
            Walk through a measurement, follow a demo routine, and trace the information behind the
            console.
          </p>
        </div>
        <div className="toolkit-intro-meta">
          <span>EDUCATIONAL TOOLKIT</span>
          <strong>{person.name}</strong>
          <small>{context.title} · context preview</small>
        </div>
      </div>
      <nav className="toolkit-tabs" aria-label="Health toolkit sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "selected" : ""}
            aria-current={tab === item.id ? "page" : undefined}
            onClick={() => onTab(item.id)}
          >
            {item.label}
            {item.id === "routine" && (
              <span>
                {reviewedCount}/{routineDefinitions.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {tab === "measure" && (
        <div className="measurement-layout">
          <aside className="panel measurement-picker">
            <div className="toolkit-section-heading">
              <span className="eyebrow">RECORD WITH CONTEXT</span>
              <h2>Choose a measurement</h2>
            </div>
            {measurementGuides.map((item) => (
              <button
                key={item.id}
                className={metric === item.id ? "selected" : ""}
                onClick={() => onMetric(item.id)}
              >
                <span>
                  {item.title}
                  <small>{item.method}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </aside>
          <div>
            <section className="panel measurement-walkthrough">
              <div className="measurement-walkthrough-head">
                <div>
                  <span className="eyebrow">PROJECT-AUTHORED ENTRY WALKTHROUGH</span>
                  <h2>{guide.title}</h2>
                  <p>{guide.why}</p>
                </div>
                <span className="simulation-label">NO SENSOR CONNECTED</span>
              </div>
              <div className="measurement-example">
                <div>
                  <span>CURRENT DEMO VALUE</span>
                  <strong>{metricValue(metric, reading)}</strong>
                  <small>
                    {person.name} ·{" "}
                    {metric === "exercise"
                      ? "Manual activity screen"
                      : checkedIn
                        ? "In-memory demo entry"
                        : "Synthetic JSON fixture"}
                  </small>
                </div>
                <div>
                  <span>MEASUREMENT CONTEXT</span>
                  <p>{context.measurementNote}</p>
                </div>
              </div>
              <ol className="measurement-progress" aria-label="Measurement walkthrough progress">
                {guide.steps.map((item, index) => (
                  <li
                    key={item.title}
                    className={step === index ? "current" : step > index ? "complete" : ""}
                  >
                    <button
                      aria-label={`Walkthrough step ${index + 1}: ${item.title}`}
                      aria-current={step === index ? "step" : undefined}
                      onClick={() => setStep(index)}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="measurement-step" aria-live="polite">
                <span>
                  STEP {step + 1} OF {guide.steps.length}
                </span>
                <h3>{guide.steps[step].title}</h3>
                <p>{guide.steps[step].text}</p>
              </div>
              <div className="measurement-step-controls">
                <button
                  className="secondary-button"
                  disabled={step === 0}
                  onClick={() => setStep((value) => value - 1)}
                >
                  Previous step
                </button>
                {step < guide.steps.length - 1 ? (
                  <button className="primary-button" onClick={() => setStep((value) => value + 1)}>
                    Next step <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button className="primary-button" onClick={() => onRecord(metric)}>
                    {metric === "exercise" ? "Open exercise log" : "Open related check-in field"}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
              <div className="measurement-limits">
                <span>IMPORTANT LIMITATION</span>
                <p>{guide.limit}</p>
              </div>
              <SourceLinks ids={guide.sourceIds} />
            </section>
            {observation && (
              <section className="panel observation-explainer">
                <span className="eyebrow">OBSERVATION → CONTEXT → REVIEW</span>
                <h2>{observation.title}</h2>
                <p className="observation-fact">{observation.summary}</p>
                <p>{observation.difference}</p>
                <div>
                  <strong>What to review next</strong>
                  <p>{observation.next}</p>
                </div>
                <small>
                  {observation.flagged
                    ? "An unvalidated demo comparison rule matched. This is not clinical triage."
                    : "No rule flag is shown for this comparison. That does not establish health or safety."}
                </small>
              </section>
            )}
          </div>
        </div>
      )}

      {tab === "routine" && (
        <div className="routine-layout">
          <section className="panel routine-list-panel">
            <div className="toolkit-section-heading">
              <span className="eyebrow">THIS DEMO RUN / NOT A MEDICAL SCHEDULE</span>
              <h2>Your routine, one action at a time.</h2>
              <p>
                Completion reflects actions in this run, not the preloaded fixture history or
                clinical clearance.
              </p>
            </div>
            <div className="routine-summary">
              <strong>
                {reviewedCount}
                <span>/ {routineDefinitions.length}</span>
              </strong>
              <div>
                <span>DEMO ACTIONS COMPLETE</span>
                <div>
                  <i style={{ width: `${(reviewedCount / routineDefinitions.length) * 100}%` }} />
                </div>
              </div>
            </div>
            {routineDefinitions.map((item, index) => (
              <article
                className={`routine-task ${complete[item.id] ? "complete" : ""}`}
                key={item.id}
              >
                <span className="routine-task-number">
                  {complete[item.id] ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button
                    className="text-button"
                    onClick={() =>
                      item.action === "checkin"
                        ? onRecord("heart")
                        : item.action === "exercise"
                          ? onExercise()
                          : onTab("measure")
                    }
                  >
                    {item.action === "checkin"
                      ? "Open health check-in"
                      : item.action === "exercise"
                        ? "Open exercise log"
                        : "Open measurement walkthroughs"}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                  {item.id === "guidance" && (
                    <label className="routine-self-review">
                      <input
                        type="checkbox"
                        checked={Boolean(complete.guidance)}
                        onChange={(event) => onReviewed(event.target.checked)}
                      />
                      I reviewed the walkthrough and its limitations.
                    </label>
                  )}
                </div>
                <span className={`routine-task-status ${complete[item.id] ? "done" : ""}`}>
                  {complete[item.id] ? "COMPLETE" : "PENDING"}
                </span>
              </article>
            ))}
          </section>
          <aside>
            <section className="panel reminder-settings-panel">
              <span className="eyebrow">IN-PAGE REMINDERS</span>
              <h2>
                A gentle prompt.
                <br />
                Only while this page is open.
              </h2>
              <p>
                Choose a demonstration interval. It is not a NASA or mission-approved medical
                schedule.
              </p>
              <label>
                Demo reminder interval
                <select
                  aria-label="Demo reminder interval"
                  value={reminder.minutes}
                  onChange={(event) => reminder.setMinutes(Number(event.target.value))}
                >
                  <option value="0">Off</option>
                  <option value="1">Every 1 minute</option>
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                </select>
              </label>
              <div className="reminder-next">
                <span>
                  {reviewedCount === routineDefinitions.length
                    ? "ROUTINE COMPLETE"
                    : reminder.due
                      ? "DEMO PROMPT DUE"
                      : reminder.nextAt
                        ? "NEXT PROMPT / DEVICE LOCAL TIME"
                        : "REMINDERS OFF"}
                </span>
                <strong>
                  {reviewedCount === routineDefinitions.length
                    ? "All demo actions reviewed"
                    : reminder.due
                      ? "A moment for your routine"
                      : reminder.nextAt
                        ? new Date(reminder.nextAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No timer scheduled"}
                </strong>
              </div>
              {reminder.due && (
                <div className="button-row">
                  <button className="secondary-button" onClick={reminder.snooze}>
                    Snooze 5 min
                  </button>
                  <button className="secondary-button" onClick={reminder.dismiss}>
                    Dismiss prompt
                  </button>
                </div>
              )}
              <small>
                Closing, refreshing, suspending the page, or signing out can stop these timers. No
                push notification, background scheduler, or reminder storage is implemented.
              </small>
            </section>
            <div className="info-banner">
              <span className="toolkit-info-icon">i</span>
              <span>
                Check-in and exercise actions complete automatically after a manual demo
                confirmation. Guidance review is your own demonstration acknowledgement.
              </span>
            </div>
          </aside>
        </div>
      )}

      {tab === "body" && <BodyOverview {...props} />}

      {tab === "context" && (
        <>
          <section className="panel context-detail">
            <div>
              <span className="eyebrow">SELECTED EDUCATIONAL CONTEXT</span>
              <h2>{context.title}</h2>
              <p>{context.description}</p>
              <div className="context-facts">
                <div>
                  <span>GRAVITY CONTEXT</span>
                  <strong>{context.gravity}</strong>
                </div>
                <div>
                  <span>COMMUNICATION CONTEXT</span>
                  <strong>{context.communications}</strong>
                </div>
              </div>
            </div>
            <div className="context-boundary">
              <span>WHAT CHANGES</span>
              <p>Educational explanations and relevant hazard notes.</p>
              <span>WHAT DOES NOT CHANGE</span>
              <p>
                {mission.name}'s synthetic orbital records, example baselines, comparison
                thresholds, and current check-in values.
              </p>
            </div>
          </section>
          <div className="toolkit-section-heading context-hazard-heading">
            <span className="eyebrow">NASA HRP HAZARD FRAMEWORK</span>
            <h2>Consider the environment—not just the number.</h2>
            <p>{context.measurementNote}</p>
          </div>
          <div className="hazard-grid">
            {spaceHazards.map((hazard) => (
              <article
                className={`panel hazard-card ${context.hazardIds.includes(hazard.id) ? "relevant" : ""}`}
                key={hazard.id}
              >
                <span className="hazard-relevance">
                  {context.hazardIds.includes(hazard.id)
                    ? "HIGHLIGHTED IN THIS PREVIEW"
                    : "GENERAL SPACEFLIGHT CONTEXT"}
                </span>
                <h3>{hazard.title}</h3>
                <p>{hazard.context}</p>
                <div>
                  <span>WHAT THIS DEMO CANNOT TELL YOU</span>
                  <p>{hazard.limit}</p>
                </div>
                <SourceLinks ids={hazard.sourceIds} />
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "evidence" && (
        <>
          <div className="evidence-summary">
            <section className="panel">
              <span>HEALTH FIXTURE RECORDS</span>
              <strong>{healthRecords.length}</strong>
              <small>
                {historyFor(person.id).length} synthetic mission days for {person.name}
              </small>
            </section>
            <section className="panel">
              <span>EXAMPLE BASELINE WINDOW</span>
              <strong>
                {rules.baselineWindowDays}
                <small>days</small>
              </strong>
              <small>Prior records only · current day excluded</small>
            </section>
            <section className="panel">
              <span>CLINICAL VALIDATION</span>
              <strong className="evidence-not-validated">Not established</strong>
              <small>No NASA endorsement or device integration</small>
            </section>
          </div>
          <section className="panel evidence-table-panel">
            <div className="toolkit-section-heading">
              <span className="eyebrow">VALUE-LEVEL PROVENANCE</span>
              <h2>Know what you're looking at.</h2>
              <p>
                Sources below describe the data's origin—not proof that the software is medically
                accurate.
              </p>
            </div>
            <div className="evidence-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>CURRENT DEMO VALUE</th>
                    <th>ORIGIN</th>
                    <th>WHERE IT COMES FROM</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, value, origin, path]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{value}</td>
                      <td>
                        <span>{origin}</span>
                      </td>
                      <td>
                        <code>{path}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="evidence-rule-note">
              <strong>Unvalidated demo comparison configuration</strong>
              <p>
                Heart-rate difference &gt; {rules.heartDifferenceBpm} bpm; either pressure component
                difference &gt; {rules.pressureDifferenceMmHg} mmHg; sleep decrease &gt;{" "}
                {rules.sleepDecreaseHours} hour; fatigue increase &gt; {rules.fatigueIncreasePoints}{" "}
                points. These are project demonstration rules, not clinical thresholds or NASA
                recommendations.
              </p>
            </div>
          </section>
          <div className="toolkit-section-heading source-heading">
            <span className="eyebrow">EXPLANATION REFERENCES</span>
            <h2>Context is not the same as validation.</h2>
          </div>
          <div className="source-card-grid">
            {knowledgeSources.map((source) => (
              <article className="panel source-reference-card" key={source.id}>
                <span className="source-reference-kind">
                  {source.url ? "PUBLIC EDUCATIONAL RESOURCE" : "PROJECT-AUTHORED DEMO"}
                </span>
                <h3>{source.name}</h3>
                <p>{source.scope}</p>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    Open source <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="source-project-note">
                    Walkthrough logic: docs/measurement-guides.md
                  </span>
                )}
              </article>
            ))}
          </div>
          <div className="info-banner">
            <span className="toolkit-info-icon">i</span>
            <span>
              OSDR studies, live sensors, medical-device instructions, and actual astronaut clinical
              records are not integrated. Biological research data would need an appropriate,
              separately reviewed use case.
            </span>
          </div>
        </>
      )}

      <aside className="toolkit-scope-note">
        <span>IMPORTANT SCOPE LIMIT</span>
        <p>
          This prototype cannot assess an emergency or recommend treatment. For real concerns,
          follow established mission procedures and contact trained crew or mission medical support
          through available channels. Do not rely on this demonstration for care.
        </p>
        <small>Educational content {toolkitVersion} · synthetic data · no persistent storage</small>
      </aside>
    </div>
  );
}

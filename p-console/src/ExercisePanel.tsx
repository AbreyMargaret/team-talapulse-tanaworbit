import { useState, type FormEvent } from "react";
import {
  exerciseCatalog,
  mission,
  type CrewMember,
  type ExerciseRecord,
  type Reading,
} from "./data";

export default function ExercisePanel({
  person,
  reading,
  records,
  onRecord,
}: {
  person: CrewMember;
  reading: Reading;
  records: ExerciseRecord[];
  onRecord: (record: ExerciseRecord) => void;
}) {
  const [activityId, setActivity] = useState(exerciseCatalog[0].id);
  const [duration, setDuration] = useState("20");
  const [effort, setEffort] = useState("4");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState(false);
  const [message, setMessage] = useState("");
  const activity = exerciseCatalog.find((item) => item.id === activityId)!;
  const crewRecords = records.filter((record) => record.crewId === person.id);
  const week = crewRecords.filter((record) => record.missionDay > mission.day - 7);
  const today = crewRecords.filter((record) => record.missionDay === mission.day);
  const minutes = (items: ExerciseRecord[]) =>
    items.reduce((sum, item) => sum + item.durationMinutes, 0);
  const days = Array.from({ length: 7 }, (_, i) => mission.day - 6 + i);
  const dailyTotals = days.map((day) => minutes(week.filter((item) => item.missionDay === day)));
  const max = Math.max(60, ...dailyTotals);
  const latestHealth = reading;
  function submit(event: FormEvent) {
    event.preventDefault();
    setReview(true);
    setMessage("");
  }
  function record() {
    onRecord({
      id: `exercise-demo-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
      crewId: person.id,
      missionId: mission.id,
      missionDay: mission.day,
      activityId,
      durationMinutes: Number(duration),
      effort: Number(effort),
      notes,
      source: "manual_demo",
    });
    setReview(false);
    setNotes("");
    setMessage("Exercise session added. It stays until you refresh.");
  }
  return (
    <div className="exercise-workspace">
      <div className="info-banner exercise-notice">
        <span className="exercise-info-symbol">i</span>
        <span>
          Manual and synthetic records only. No wearable, sensor stream, calorie estimation, or
          individualized exercise prescription is connected.
        </span>
      </div>
      <div className="exercise-stat-grid">
        {[
          ["Recorded today", `${minutes(today)}`, "minutes"],
          ["Last 7 mission days", `${minutes(week)}`, "minutes"],
          ["Sessions this week", `${week.length}`, "recorded"],
          [
            "Reported effort",
            week.length
              ? (week.reduce((sum, item) => sum + item.effort, 0) / week.length).toFixed(1)
              : "—",
            "average / 10",
          ],
        ].map(([label, value, unit]) => (
          <div className="panel exercise-stat" key={label}>
            <span>{label}</span>
            <strong>
              {value}
              <small>{unit}</small>
            </strong>
          </div>
        ))}
      </div>
      <div className="exercise-columns">
        <section className="panel exercise-history">
          <div className="panel-heading">
            <div>
              <h2>Movement over the last 7 days</h2>
              <p>Minutes recorded over the last 7 days.</p>
            </div>
          </div>
          <div
            className="exercise-bars"
            role="img"
            aria-label={days.map((day, i) => `Day ${day}: ${dailyTotals[i]} minutes`).join(", ")}
          >
            {days.map((day, i) => (
              <div key={day}>
                <span>
                  {dailyTotals[i]}
                  <small> min</small>
                </span>
                <div className="exercise-bar-track">
                  <i
                    style={{
                      height: `${Math.max(dailyTotals[i] ? 4 : 0, (dailyTotals[i] / max) * 100)}%`,
                    }}
                  />
                </div>
                <small>Day {day}</small>
              </div>
            ))}
          </div>
          <div className="exercise-context">
            <span>RECOVERY CONTEXT · LATEST HEALTH CHECK-IN</span>
            <div>
              <p>
                Sleep <b>{latestHealth.sleep} hrs</b>
              </p>
              <p>
                Fatigue <b>{latestHealth.fatigue}/5</b>
              </p>
            </div>
            <small>
              Read effort next to sleep and how tired you felt.
            </small>
          </div>
        </section>
        <section className="panel exercise-form-panel">
          <div className="panel-heading">
            <div>
              <h2>Record an exercise session</h2>
              <p>
                For {person.name} · Mission day {mission.day}
              </p>
            </div>
          </div>
          {review ? (
            <div className="exercise-review">
              <span className="eyebrow">REVIEW BEFORE RECORDING</span>
              <h3>{activity.name}</h3>
              <dl>
                <div>
                  <dt>Duration</dt>
                  <dd>{duration} minutes</dd>
                </div>
                <div>
                  <dt>Reported effort</dt>
                  <dd>{effort} / 10</dd>
                </div>
                <div>
                  <dt>Crew member</dt>
                  <dd>{person.name}</dd>
                </div>
              </dl>
              {notes && <p className="exercise-note">{notes}</p>}
              <p>
                This adds an entry for this session. It stays until you refresh.
              </p>
              <div className="button-row">
                <button className="secondary-button" onClick={() => setReview(false)}>
                  Back to edit
                </button>
                <button className="primary-button" onClick={record}>
                  Confirm session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                Activity
                <select
                  value={activityId}
                  onChange={(event) => {
                    setActivity(event.target.value);
                    setDuration(
                      String(
                        exerciseCatalog.find((item) => item.id === event.target.value)!
                          .exampleMinutes,
                      ),
                    );
                  }}
                >
                  {exerciseCatalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="exercise-form-row">
                <label>
                  Duration (minutes)
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    min="1"
                    max="180"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                  />
                </label>
                <label>
                  Perceived effort (1–10)
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    min="1"
                    max="10"
                    value={effort}
                    onChange={(event) => setEffort(event.target.value)}
                  />
                </label>
              </div>
              <small>
                1 is very light, 10 is extremely hard. Picking an activity fills in a duration you can change.
              </small>
              <label>
                Session notes (optional)
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Equipment, interruptions, or other context…"
                />
              </label>
              <button className="primary-button" type="submit">
                Review session <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
          {message && (
            <p className="exercise-saved" role="status">
              {message}
            </p>
          )}
        </section>
      </div>
      <section className="panel exercise-guidance">
        <div className="panel-heading">
          <div>
            <h2>Exercise in the spaceflight environment</h2>
            <p>A short note on why this movement is on the list.</p>
          </div>
        </div>
        <div className="exercise-topic-grid">
          {exerciseCatalog.map((item) => (
            <article key={item.id}>
              <span className="eyebrow">ACTIVITY CONTEXT</span>
              <h3>{item.name}</h3>
              <p>{item.consideration}</p>
              <p>{item.guidance}</p>
              <a href={item.source} target="_blank" rel="noreferrer">
                NASA educational reference <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="panel exercise-log">
        <div className="panel-heading">
          <div>
            <h2>Recent activity log</h2>
            <p>Newest entries first</p>
          </div>
        </div>
        <div className="exercise-log-table" role="table" aria-label="Exercise session log">
          <div role="row" className="exercise-log-head">
            <span role="columnheader">ACTIVITY</span>
            <span role="columnheader">MISSION DAY</span>
            <span role="columnheader">DURATION</span>
            <span role="columnheader">EFFORT</span>
            <span role="columnheader">SOURCE</span>
          </div>
          {[...crewRecords]
            .reverse()
            .slice(0, 10)
            .map((item) => (
              <div role="row" key={item.id}>
                <strong role="cell">
                  {exerciseCatalog.find((activity) => activity.id === item.activityId)?.name}
                </strong>
                <span role="cell">Day {item.missionDay}</span>
                <span role="cell">{item.durationMinutes} min</span>
                <span role="cell">{item.effort} / 10</span>
                <span role="cell" className="exercise-source">
                  {item.source === "manual_demo" ? "Typed" : "Already listed"}
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

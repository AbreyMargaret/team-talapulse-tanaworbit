import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import DemoSignIn from "./DemoSignIn";
import App from "./App";
import {
  accessRoles,
  biodata,
  cabinConditions,
  crew,
  crewStatus,
  latestRecord,
  mission,
  nutritionFor,
  observationFlags,
  orbitalConditions,
  personalBaseline,
  rules,
  trendCalculation,
  type Reading,
} from "./data";
import { clearSession, readSession, writeSession, type DemoSession } from "./session";
import "./portals.css";

function useSession(): DemoSession | null {
  return readSession();
}

export function PortalHome() {
  const session = useSession();
  return (
    <main className="portal-home">
      <section className="portal-hero">
        <div className="portal-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <span>
            TanawOrbit
            <small>TALA PULSE</small>
          </span>
        </div>
        <div>
          <span className="portal-kicker">EDUCATIONAL PROTOTYPE</span>
          <h1>Choose a door.</h1>
          <p>
            Astronauts enter the crew console with a public sample PIN. Admin and tester open the
            backend by choosing a role. Neither door is an account.
          </p>
        </div>
        <p>
          {mission.name} · Flight Day {mission.day}. Expedition VII operational flight deck.
        </p>
      </section>
      <section className="portal-choices">
        <Link className="portal-card" to="/a-login">
          <span className="portal-kicker">/a-login</span>
          <strong>Astronaut</strong>
          <p>Select crew profile & PIN. Opens the flight console for that crew member.</p>
        </Link>
        <Link className="portal-card" to="/b-login">
          <span className="portal-kicker">/b-login</span>
          <strong>Backend</strong>
          <p>Choose Admin or Tester. The role opens at once. No code.</p>
        </Link>
        {session?.kind === "astronaut" && (
          <Link className="portal-card" to="/Astronaut">
            <span className="portal-kicker">CONTINUE</span>
            <strong>Return to the crew console</strong>
          </Link>
        )}
        {session?.kind === "backend" && (
          <Link className="portal-card" to={session.role === "admin" ? "/admin" : "/tester"}>
            <span className="portal-kicker">CONTINUE</span>
            <strong>Return to the {session.role} portal</strong>
          </Link>
        )}
      </section>
    </main>
  );
}

export function AstronautLogin() {
  const navigate = useNavigate();
  return (
    <>
      <DemoSignIn
        initialCrew={0}
        onEnter={(index) => {
          writeSession({ kind: "astronaut", crewId: crew[index].id });
          navigate("/Astronaut");
        }}
      />
    </>
  );
}

const backendRoleCopy: Record<string, { title: string; detail: string }> = {
  admin: {
    title: "Admin",
    detail: "Review every fictional profile, the cabin sample, the orbit sample, and today’s intake. Open any crew console.",
  },
  tester: {
    title: "Tester",
    detail: "See whether the published datasets passed, then try one reading against that person’s 14-day mean.",
  },
};

export function BackendLogin() {
  const navigate = useNavigate();

  function enter(roleId: string) {
    const backendRole = roleId === "tester" ? "tester" : "admin";
    writeSession({ kind: "backend", role: backendRole });
    navigate(backendRole === "admin" ? "/admin" : "/tester");
  }

  return (
    <main className="demo-access">
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <span>
            TanawOrbit<small>BACKEND DOOR</small>
          </span>
        </div>
        <div className="access-story-copy">
          <span className="eyebrow">FOR JUDGES</span>
          <h2>
            Choose a role.
            <br />
            The page opens.
          </h2>
          <p>This door does not create an account and does not store a health record.</p>
        </div>
        <div className="access-story-footer">
          <span>EDUCATIONAL CONCEPT</span>
          <Link to="/a-login">Astronaut door</Link>
        </div>
      </section>
      <section className="access-console" aria-labelledby="backend-title">
        <div className="access-heading">
          <span className="eyebrow">/b-login</span>
          <h1 id="backend-title">Backend review.</h1>
          <p>Click a role to enter. There is no code on this door.</p>
        </div>
        <div className="role-enter" role="group" aria-label="Backend role">
          {accessRoles.map((item) => {
            const copy = backendRoleCopy[item.id] ?? { title: item.label, detail: item.portal };
            return (
              <button key={item.id} type="button" onClick={() => enter(item.id)}>
                <span className="portal-kicker">{item.portal}</span>
                <strong>{copy.title}</strong>
                <p>{copy.detail}</p>
              </button>
            );
          })}
        </div>
        <div className="access-disclaimer">
          <p>
            <strong>A role choice, not secure authentication.</strong> Admin and tester read the
            same synthetic files the crew console uses. Refreshing still clears console edits.
          </p>
        </div>
      </section>
    </main>
  );
}

function leave(login: "/a-login" | "/b-login", navigate: (path: string) => void) {
  clearSession();
  navigate(login);
}

export function AstronautPortal() {
  const session = useSession();
  const navigate = useNavigate();
  if (session && session.kind === "backend" && session.role !== "admin") return <Navigate to="/b-login" replace />;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("crew");
  const savedCrew = typeof localStorage !== "undefined" ? localStorage.getItem("tanaworbit_crew_id") : null;
  const effectiveCrewId =
    session && session.kind === "astronaut"
      ? session.crewId
      : (requested && crew.some((p) => p.id === requested))
        ? requested
        : (savedCrew && crew.some((p) => p.id === savedCrew))
          ? savedCrew
          : crew[0].id;

  // Auto-establish astronaut demo session if not already set
  useEffect(() => {
    if (!session) {
      writeSession({ kind: "astronaut", crewId: effectiveCrewId });
    }
  }, [session, effectiveCrewId]);

  return (
    <App
      key={effectiveCrewId}
      crewId={effectiveCrewId}
      allowCrewSwitch={true}
      portal={session && session.kind === "backend" ? "admin" : "astronaut"}
      onSignOut={() => leave("/a-login", navigate)}
    />
  );
}

export function AdminPortal() {
  const session = useSession();
  const navigate = useNavigate();
  if (!session || session.kind !== "backend" || session.role !== "admin") {
    return <Navigate to="/b-login" replace />;
  }
  const cabin = cabinConditions[cabinConditions.length - 1];
  const orbit = orbitalConditions[orbitalConditions.length - 1];
  return (
    <main className="portal-page">
      <div className="portal-bar">
        <div>
          <span className="portal-kicker">/admin</span>
          <h1>Admin portal</h1>
        </div>
        <div className="portal-actions">
          <Link className="secondary-button" to="/tester">
            Dataset tester
          </Link>
          <button className="secondary-button" type="button" onClick={() => leave("/b-login", navigate)}>
            Sign out
          </button>
        </div>
      </div>
      <p className="portal-lead">
        This is the mission review desk for {mission.name}, flight day {mission.day}. It shows the same synthetic files the crew console uses. Opening a profile does not create a medical record, and the status words are demonstration labels.
      </p>
      <div className="portal-grid">
        <article className="portal-card">
          <span className="portal-kicker">CABIN</span>
          <strong>
            {cabin.pressureKpa} kPa · {cabin.co2MmHg} mmHg CO₂
          </strong>
          <p>
            {cabin.temperatureC} °C · {cabin.humidityPercent}% humidity · day {cabin.missionDay}
          </p>
        </article>
        <article className="portal-card">
          <span className="portal-kicker">ORBIT</span>
          <strong>
            {orbit.altitudeKm} km · {orbit.lighting}
          </strong>
          <p>
            {orbit.velocityKms} km/s · eclipse {orbit.eclipseMinutes} min · day {orbit.missionDay}
          </p>
        </article>
      </div>
      <div className="portal-grid" style={{ marginTop: 14 }}>
        {crew.map((person, index) => {
          const body = biodata.find((row) => row.crewId === person.id);
          const intake = nutritionFor(person.id).find((row) => row.missionDay === mission.day);
          const reading = latestRecord(person.id).reading;
          const status = crewStatus(index, reading);
          const note =
            status === "Attention"
              ? "Marked for review in the fixture."
              : status === "Observe"
                ? "A reading sits outside the demonstration rule."
                : "Inside the demonstration rules.";
          return (
            <article className="portal-card" key={person.id}>
              <span className="portal-kicker">{person.role}</span>
              <strong>{person.name}</strong>
              <p>
                <b className={status === "Stable" ? "pass" : "fail"}>{status}</b>
                {" · "}
                {note}
              </p>
              <p>
                {body ? `${body.statureCm} cm · ${body.massKg} kg · ${body.bloodTypeLabel}` : "No biodata"}
              </p>
              <p>{intake ? `${intake.kcal} kcal · ${intake.waterMl} mL water on day ${mission.day}` : "No intake row for this day"}</p>
              <div className="portal-actions">
                <Link className="primary-button" to={`/Astronaut?crew=${person.id}`}>
                  Open console
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

async function fetchApi(path: string): Promise<Response> {
  const bases = [
    import.meta.env.VITE_API_URL,
    "https://api.tanaw-orbit.app",
    "https://tanaworbit-api.robotics8051.workers.dev",
    "http://127.0.0.1:8787",
    "",
  ].filter(Boolean) as string[];
  let lastStatus = 0;
  for (const base of bases) {
    try {
      const response = await fetch(`${base}${path}`);
      if (response.ok || response.status === 422) return response;
      lastStatus = response.status;
    } catch {
      lastStatus = 0;
    }
  }
  throw new Error(lastStatus ? `API returned ${lastStatus}` : "API unreachable");
}

type VerifyBody = {
  ok: boolean;
  checks: { id: string; label: string; ok: boolean; detail: string }[];
  disclaimer?: string;
};

type TrendBody = {
  trend?: {
    baseline: { heart: number; systolic: number; diastolic: number; sleep: number; fatigue: number };
  };
};

type EvaluateBody = {
  evaluated?: {
    name: string;
    label: string;
    status: string;
    numberStatus: string;
    checks: { id: string; fired: boolean; text: string }[];
  };
  error?: string;
  message?: string;
};

const statusWord = { Stable: "Usual", Observe: "Different", Attention: "Flagged" } as const;

export function TesterPortal() {
  const session = useSession();
  const sessionKey = session ? `${session.kind}:${session.kind === "backend" ? session.role : session.crewId}` : "";
  const navigate = useNavigate();
  const [report, setReport] = useState<VerifyBody | null>(null);
  const [compare, setCompare] = useState<string>("Waiting for the API.");
  const [error, setError] = useState("");
  const [crewId, setCrewId] = useState(crew[0].id);
  const starting = latestRecord(crew[0].id).reading;
  const [heart, setHeart] = useState(String(starting.heart));
  const [systolic, setSystolic] = useState(String(starting.systolic));
  const [diastolic, setDiastolic] = useState(String(starting.diastolic));
  const [sleep, setSleep] = useState(String(starting.sleep));
  const [fatigue, setFatigue] = useState(String(starting.fatigue));
  const [trial, setTrial] = useState<string>("");
  const [trialChecks, setTrialChecks] = useState<EvaluateBody["evaluated"]>();

  useEffect(() => {
    if (!sessionKey.startsWith("backend:")) return;
    let cancelled = false;
    async function load() {
      try {
        const response = await fetchApi("/api/verify");
        const body = (await response.json()) as VerifyBody;
        const personId = "crew-ef";
        const local = trendCalculation(personId, latestRecord(personId).reading);
        const trendResponse = await fetchApi(`/api/trends?crewId=${personId}`);
        const trendBody = (await trendResponse.json()) as TrendBody;
        const remote = trendBody.trend?.baseline;
        const matched =
          remote &&
          remote.heart === local.baseline.heart &&
          remote.systolic === local.baseline.systolic &&
          remote.diastolic === local.baseline.diastolic &&
          remote.sleep === local.baseline.sleep &&
          remote.fatigue === local.baseline.fatigue;
        if (!cancelled) {
          setReport(body);
          setCompare(
            matched
              ? `Ella Nicole Fabro’s 14-day means match. Heart ${local.baseline.heart} bpm.`
              : "The console mean and the API mean do not match.",
          );
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("The read-only API did not answer. The public address is https://api.tanaw-orbit.app/.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  function useStoredReading(nextCrewId: string) {
    const reading = latestRecord(nextCrewId).reading;
    setCrewId(nextCrewId);
    setHeart(String(reading.heart));
    setSystolic(String(reading.systolic));
    setDiastolic(String(reading.diastolic));
    setSleep(String(reading.sleep));
    setFatigue(String(reading.fatigue));
  }

  async function runTrial() {
    const reading: Reading = {
      heart: Number(heart),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      sleep: Number(sleep),
      fatigue: Number(fatigue),
      mood: "",
      notes: "",
    };
    if (Object.values(reading).some((value) => typeof value === "number" && !Number.isFinite(value))) {
      setTrial("Enter a number in every field.");
      setTrialChecks(undefined);
      return;
    }
    const index = crew.findIndex((person) => person.id === crewId);
    const localFlags = observationFlags(reading, personalBaseline(crewId));
    const localStatus = crewStatus(index, reading);
    try {
      const params = new URLSearchParams({
        crewId,
        heart: String(reading.heart),
        systolic: String(reading.systolic),
        diastolic: String(reading.diastolic),
        sleep: String(reading.sleep),
        fatigue: String(reading.fatigue),
      });
      const response = await fetchApi(`/api/evaluate?${params.toString()}`);
      const body = (await response.json()) as EvaluateBody;
      const remote = body.evaluated;
      if (!remote) {
        setTrial(body.message || "The API could not judge these numbers.");
        setTrialChecks(undefined);
        return;
      }
      const same =
        remote.status === localStatus &&
        remote.checks.filter((item) => item.id !== "review").every((item) => item.fired === localFlags[item.id as keyof typeof localFlags]);
      setTrialChecks(remote);
      setTrial(
        same
          ? `${remote.name}: ${remote.label}. The console if statements and the API agree. Nothing was saved.`
          : `${remote.name}: the console says ${statusWord[localStatus]} and the API says ${remote.label}.`,
      );
    } catch {
      setTrialChecks(undefined);
      setTrial(
        `The API did not answer. On this page the console would say ${statusWord[localStatus]}. The public address is https://api.tanaw-orbit.app/.`,
      );
    }
  }

  if (!session || session.kind !== "backend") return <Navigate to="/b-login" replace />;

  return (
    <main className="portal-page">
      <div className="portal-bar">
        <div>
          <span className="portal-kicker">/tester</span>
          <h1>Dataset tester</h1>
        </div>
        <div className="portal-actions">
          {session.role === "admin" && (
            <Link className="secondary-button" to="/admin">
              Admin portal
            </Link>
          )}
          <button className="secondary-button" type="button" onClick={() => leave("/b-login", navigate)}>
            Sign out
          </button>
        </div>
      </div>
      <p className="portal-lead">
        Judges can see two things here. First, whether the published datasets still pass. Second, what the demonstration rules say about one reading. Nothing typed here is saved.
      </p>
      <section className="portal-card">
        <span className="portal-kicker">DEMONSTRATION RULES</span>
        <p>These are not clinical limits. A mark means the number is far from that person’s previous 14 synthetic days.</p>
        <div className="portal-check">
          <b>Heart</b>
          <p>More than {rules.heartDifferenceBpm} bpm from the mean.</p>
        </div>
        <div className="portal-check">
          <b>Pressure</b>
          <p>More than {rules.pressureDifferenceMmHg} mmHg from the mean.</p>
        </div>
        <div className="portal-check">
          <b>Sleep</b>
          <p>More than {rules.sleepDecreaseHours} hour below the mean.</p>
        </div>
        <div className="portal-check">
          <b>Tired</b>
          <p>More than {rules.fatigueIncreasePoints} points above the mean, on a 1 to 5 scale.</p>
        </div>
      </section>
      {error && (
        <p className="access-error" role="alert">
          {error}
        </p>
      )}
      {report && (
        <section className="portal-card">
          <span className="portal-kicker">{report.ok ? "1 · FIXTURES PASSED" : "1 · FIXTURES NEED ATTENTION"}</span>
          <strong>{compare}</strong>
          <p>{report.disclaimer}</p>
          {report.checks.map((item) => (
            <div className="portal-check" key={item.id}>
              <b className={item.ok ? "pass" : "fail"}>{item.ok ? "Pass" : "Fail"}</b>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </section>
      )}
      <section className="portal-card trial-form">
        <span className="portal-kicker">2 · TRY A READING</span>
        <label>
          Person
          <select value={crewId} onChange={(event) => useStoredReading(event.target.value)}>
            {crew.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Heart rate
          <input value={heart} onChange={(event) => setHeart(event.target.value)} inputMode="decimal" />
        </label>
        <label>
          Systolic
          <input value={systolic} onChange={(event) => setSystolic(event.target.value)} inputMode="decimal" />
        </label>
        <label>
          Diastolic
          <input value={diastolic} onChange={(event) => setDiastolic(event.target.value)} inputMode="decimal" />
        </label>
        <label>
          Sleep hours
          <input value={sleep} onChange={(event) => setSleep(event.target.value)} inputMode="decimal" />
        </label>
        <label>
          How tired, 1 to 5
          <input value={fatigue} onChange={(event) => setFatigue(event.target.value)} inputMode="decimal" />
        </label>
        <button className="primary-button" type="button" onClick={() => void runTrial()}>
          Check these numbers
        </button>
        {trial && <p>{trial}</p>}
        {trialChecks?.checks.map((item) => (
          <div className="portal-check" key={item.id}>
            <b className={item.fired ? "fail" : "pass"}>{item.fired ? "Marked" : "Not marked"}</b>
            <div>
              <strong>{item.id}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

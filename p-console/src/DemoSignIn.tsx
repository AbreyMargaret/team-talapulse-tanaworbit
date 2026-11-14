import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { crew, mission } from "./data";
import "./demo.css";

export default function DemoSignIn({
  initialCrew,
  onEnter,
}: {
  initialCrew: number;
  onEnter: (index: number) => void;
}) {
  const [selected, setSelected] = useState(initialCrew);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const person = crew[selected];

  useEffect(() => {
    if (pin.length !== 4) return;
    setChecking(true);
    const timer = window.setTimeout(() => {
      if (pin === person.demoPin) onEnter(selected);
      else {
        setChecking(false);
        setPin("");
        setError("Invalid credentials. Enter the designated 4-digit mission PIN.");
        input.current?.focus();
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pin, selected, person.demoPin, onEnter]);

  function choose(index: number) {
    setSelected(index);
    setPin("");
    setError("");
  }
  function digit(value: string) {
    if (checking) return;
    setError("");
    setPin((current) => (current + value).slice(0, 4));
  }

  function quickVerify() {
    setChecking(true);
    setTimeout(() => onEnter(selected), 250);
  }

  return (
    <main className="demo-access">
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <span>
            TanawOrbit<small>BY TALA PULSE</small>
          </span>
        </div>
        <div className="access-story-copy">
          <span className="eyebrow">HUMAN HEALTH TELEMETRY BEYOND EARTH</span>
          <h2>
            One crew.
            <br />A connected perspective.
          </h2>
          <p>
            Autonomous physiological telemetry, cabin environment correlation, and personalized
            biomedical baselines for long-duration spaceflight.
          </p>
          <div className="access-mission">
            <span className="status-dot" />
            <div>
              <strong>{mission.name}</strong>
              <span>
                LEO Expedition · Flight Day {mission.day} of {mission.durationDays}
              </span>
            </div>
          </div>
        </div>
        <div className="access-earth" />
        <div className="access-story-footer">
          <span>TEAM TALA PULSE · NASA SPACE APPS 2026</span>
          <Link to="/b-login">Operations Door</Link>
        </div>
      </section>
      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top">
          <span className="simulation-label">
            <span />
            SIMULATION RUNTIME · ACTIVE
          </span>
          <span>{crew.length} CREW PROFILES READY</span>
        </div>
        <div className="access-heading">
          <span className="eyebrow">CREW SESSION LOGIN</span>
          <h1 id="access-title">Flight Deck Console</h1>
          <p>Select your flight crew profile, then authenticate with your 4-digit mission PIN.</p>
        </div>
        <div className="access-crew-grid" role="group" aria-label="Choose a flight crew profile">
          {crew.map((member, index) => (
            <button
              key={member.id}
              className={selected === index ? "selected" : ""}
              aria-pressed={selected === index}
              disabled={checking}
              onClick={() => choose(index)}
            >
              <span className="access-avatar" style={{ backgroundColor: member.color }}>
                {member.image ? <img src={member.image} alt="" /> : member.initials}
              </span>
              <span>
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </span>
              <i />
            </button>
          ))}
        </div>
        <form className="access-pin-form" onSubmit={(event) => event.preventDefault()}>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="demo-pin" className="block m-0">
              <span className="font-semibold text-xs">4-digit Mission PIN</span>
              <small className="block text-[10px] text-slate-400">Assigned code: {person.demoPin}</small>
            </label>
            <button
              type="button"
              onClick={quickVerify}
              disabled={checking}
              className="text-[11px] font-mono px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded transition"
            >
              ⚡ Quick Authenticate
            </button>
          </div>
          <input
            ref={input}
            id="demo-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            disabled={checking}
            placeholder="••••"
            aria-describedby="demo-pin-help demo-access-warning"
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setError("");
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
            }}
          />
          <div className="access-keypad" aria-label="Mission PIN keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
              <button
                type="button"
                key={value}
                disabled={checking}
                onClick={() => digit(value)}
                aria-label={`PIN digit ${value}`}
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              className="keypad-utility"
              disabled={checking || !pin}
              onClick={() => setPin("")}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={checking}
              onClick={() => digit("0")}
              aria-label="PIN digit 0"
            >
              0
            </button>
            <button
              type="button"
              className="keypad-utility"
              disabled={checking || pin.length !== 4}
              onClick={() => {
                if (pin === person.demoPin) onEnter(selected);
                else setError("PIN does not match.");
              }}
            >
              Enter
            </button>
          </div>
          <p id="demo-pin-help" className="access-form-help">
            Mission PIN for {person.name}: <code>{person.demoPin}</code>.
          </p>
          {error && (
            <p className="access-form-error" role="alert">
              {error}
            </p>
          )}
          <p id="demo-access-warning" className="access-form-warning">
            Educational spaceflight prototype. Check-ins stay in local memory. Not a certified medical device.
          </p>
        </form>
      </section>
    </main>
  );
}

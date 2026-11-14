import { useEffect, useRef, useState } from "react";
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
        setError("That sample PIN does not match this profile. Use the demo PIN shown below.");
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
          <span className="eyebrow">HUMAN HEALTH. BEYOND EARTH.</span>
          <h2>
            One crew.
            <br />A clearer perspective.
          </h2>
          <p>A connected view of health, movement, and daily life beyond Earth.</p>
          <div className="access-mission">
            <span className="status-dot" />
            <div>
              <strong>{mission.name}</strong>
              <span>
                Fictional mission · Day {mission.day} of {mission.durationDays}
              </span>
            </div>
          </div>
        </div>
        <div className="access-earth" />
        <div className="access-story-footer">
          <span>EDUCATIONAL CONCEPT</span>
          <span>All profiles and health records are fictional.</span>
        </div>
      </section>
      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top">
          <span className="simulation-label">
            <span />
            LOCAL DEMONSTRATION
          </span>
          <span>{crew.length} CREW PROFILES LOADED</span>
        </div>
        <div className="access-heading">
          <span className="eyebrow">CREW ACCESS</span>
          <h1 id="access-title">Welcome to the console.</h1>
          <p>Choose a fictional crew member, then enter their sample PIN.</p>
        </div>
        <div className="access-crew-grid" role="group" aria-label="Choose a fictional crew profile">
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
          <label htmlFor="demo-pin">
            <span>4-digit demo PIN</span>
            <small>Auto-continue when the four digits match</small>
          </label>
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
          <div className="access-keypad" aria-label="Demo PIN keypad">
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
              disabled={checking || !pin}
              aria-label="Delete last PIN digit"
              onClick={() => setPin((value) => value.slice(0, -1))}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m9 5-7 7 7 7h12V5ZM12 9l6 6m0-6-6 6" />
              </svg>
            </button>
          </div>
          {error && (
            <p className="access-error" role="alert">
              {error}
            </p>
          )}
          <div className="access-demo-code" id="demo-pin-help">
            <span>
              Public demo PIN for {person.name.split(" ")[0]}: <b>{person.demoPin}</b>
            </span>
            <button
              type="button"
              disabled={checking}
              onClick={() => {
                setError("");
                setPin(person.demoPin);
              }}
            >
              Fill demo PIN <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="access-checking" role="status">
            {checking
              ? "Matching the public demo profile…"
              : "No account creation or personal information needed."}
          </p>
        </form>
        <div className="access-disclaimer" id="demo-access-warning">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6m0-10h.01" />
          </svg>
          <p>
            <strong>Demo access, not secure authentication.</strong> PINs and JSON data are public
            fixtures. This door does not store a check-in. Refreshing clears console edits. Backend
            review uses /b-login.
          </p>
        </div>
      </section>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import { crew, crewStatus, latestRecord, mission, orbitalConditions } from "./data";
import { Clock } from "lucide-react";
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
  const [utcTime, setUtcTime] = useState("");
  const storedOrbit = orbitalConditions[orbitalConditions.length - 1];
  const inputRef = useRef<HTMLInputElement>(null);
  const person = crew[selected] || crew[0];

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (checking) return;
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "INPUT" && target !== inputRef.current) return;
      if (target && (target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setError("");
        setPin((prev) => (prev.length < 4 ? prev + e.key : prev));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setError("");
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape" || e.key === "Delete") {
        e.preventDefault();
        setError("");
        setPin("");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (pin.length === 4) {
          if (pin === person.demoPin) {
            onEnter(selected);
          } else {
            setError("That code does not match this person.");
            setPin("");
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checking, pin, person.demoPin, onEnter, selected]);

  useEffect(() => {
    if (pin.length !== 4) return;
    setChecking(true);
    const timer = window.setTimeout(() => {
      if (pin === person.demoPin) {
        onEnter(selected);
      } else {
        setChecking(false);
        setPin("");
        setError("That code does not match this person.");
        inputRef.current?.focus();
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [pin, selected, person.demoPin, onEnter]);

  function choose(index: number) {
    setSelected(index);
    setPin("");
    setError("");
    inputRef.current?.focus();
  }

  function digit(value: string) {
    if (checking) return;
    setError("");
    setPin((current) => (current + value).slice(0, 4));
    inputRef.current?.focus();
  }

  function openPage() {
    setChecking(true);
    window.setTimeout(() => onEnter(selected), 200);
  }

  function submitPin() {
    if (pin === person.demoPin) onEnter(selected);
    else {
      setError("That code does not match this person.");
      setPin("");
    }
  }

  return (
    <main className="demo-access">
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <div>
            <span>TanawOrbit</span>
            <small>Tala Pulse</small>
          </div>
        </div>

        <div className="access-story-copy">
          <p className="eyebrow">Practice crew</p>
          <h1>Open a practice page</h1>
          <p>
            Pick one person. The page shows stored numbers for this mission day, next to the previous 14 days.
          </p>

          <div className="access-mission">
            <div className="access-mission-top">
              <strong>{mission.name}</strong>
              <span>
                Day {mission.day} of {mission.durationDays}
              </span>
            </div>
            <div className="access-mission-facts">
              <div>
                <span>Stored altitude</span>
                <strong>{storedOrbit.altitudeKm} km</strong>
              </div>
              <div>
                <span>Stored speed</span>
                <strong>{storedOrbit.velocityKms} km/s</strong>
              </div>
              <div>
                <span>Crew</span>
                <strong>{crew.length} people</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="access-story-footer">Team Tala Pulse · NASA Space Apps 2026</p>
      </section>

      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top">
          <span>Practice crew</span>
          <span className="access-clock">
            <Clock size={14} aria-hidden="true" />
            {utcTime || "UTC"}
          </span>
        </div>

        <div className="access-heading">
          <h2 id="access-title">Choose a person</h2>
          <p>Enter the sample code, or open the page.</p>
        </div>

        <div className="access-crew-grid" role="group" aria-label="Practice crew">
          {crew.map((member, index) => {
            const isSelected = selected === index;
            const status = crewStatus(index, latestRecord(member.id).reading);
            const statusLabel = status === "Attention" ? "Flagged" : status === "Observe" ? "Different" : "Usual";
            return (
              <button
                key={member.id}
                type="button"
                className={isSelected ? "selected" : undefined}
                aria-pressed={isSelected}
                disabled={checking}
                onClick={() => choose(index)}
              >
                <span className="access-avatar" style={{ backgroundColor: member.color || "#3d5344" }}>
                  {member.image ? <img src={member.image} alt="" /> : member.initials}
                </span>
                <span className="access-crew-copy">
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                  <span className="access-crew-status">{statusLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="access-demo-code">
          <span>
            Sample code
            <b>{person.demoPin}</b>
          </span>
          <button type="button" className="primary-button" onClick={openPage} disabled={checking}>
            {checking ? "Opening…" : "Open this page"}
          </button>
        </div>

        <div className="access-pin-form">
          <label htmlFor="sample-code">
            Four-digit code
            <small>Keyboard or keypad</small>
          </label>
          <input
            id="sample-code"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus
            maxLength={4}
            value={pin}
            disabled={checking}
            onChange={(e) => {
              setError("");
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="sr-only"
            aria-label="Four-digit sample code"
          />
          <div className="access-pin-slots" onClick={() => inputRef.current?.focus()}>
            {[0, 1, 2, 3].map((slot) => {
              const filled = Boolean(pin[slot]);
              const current = pin.length === slot;
              return (
                <span
                  key={slot}
                  className={`access-pin-slot${filled ? " is-filled" : ""}${current ? " is-current" : ""}`}
                  aria-hidden="true"
                >
                  {filled ? "•" : ""}
                </span>
              );
            })}
          </div>

          <div className="access-keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "enter"].map((key) => {
              if (key === "clear") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="keypad-utility"
                    disabled={checking || !pin}
                    onClick={() => {
                      setPin("");
                      setError("");
                      inputRef.current?.focus();
                    }}
                  >
                    Clear
                  </button>
                );
              }
              if (key === "enter") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="keypad-utility"
                    disabled={checking || pin.length !== 4}
                    onClick={submitPin}
                  >
                    Enter
                  </button>
                );
              }
              return (
                <button key={key} type="button" disabled={checking} onClick={() => digit(key)}>
                  {key}
                </button>
              );
            })}
          </div>

          {error ? (
            <p className="access-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="access-checking" aria-live="polite">
              {checking ? "Opening this page…" : ""}
            </p>
          )}
        </div>

        <p className="access-disclaimer">
          Educational prototype. What you type on the next page stays in this browser until you refresh.
        </p>
      </section>
    </main>
  );
}

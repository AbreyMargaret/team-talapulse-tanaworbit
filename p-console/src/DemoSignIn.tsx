import { useEffect, useRef, useState } from "react";
import { crew, mission } from "./data";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Orbit,
} from "lucide-react";
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
  const [orbitProgress, setOrbitProgress] = useState(0.42);
  const [liveAlt, setLiveAlt] = useState(408.2);
  const [liveVel, setLiveVel] = useState(7.662);
  const inputRef = useRef<HTMLInputElement>(null);
  const person = crew[selected] || crew[0];

  // Live real-time spacecraft orbital trajectory animation & fluctuating telemetry
  useEffect(() => {
    let animId: number;
    let last = performance.now();

    function loop(now: number) {
      const delta = (now - last) / 1000;
      last = now;
      setOrbitProgress((prev) => {
        // Continuous orbital revolution sweep across horizon (~32s period)
        const next = (prev + delta * 0.031) % 1;
        // Fine microgravity orbital altitude micro-fluctuation (407.7 - 408.4 km)
        const alt = 408.0 + Math.sin(next * Math.PI * 2) * 0.35;
        // Orbital velocity variation (7.658 - 7.665 km/s)
        const vel = 7.660 + Math.cos(next * Math.PI * 2) * 0.004;
        setLiveAlt(Number(alt.toFixed(1)));
        setLiveVel(Number(vel.toFixed(3)));
        return next;
      });
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(
        now.toUTCString().slice(17, 25) + " UTC"
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation & direct digit typing support
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
            setError("Security code mismatch. Try the designated mission PIN.");
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
        setError("Security code mismatch. Try the designated mission PIN.");
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

  function quickAuthorize() {
    setChecking(true);
    setTimeout(() => onEnter(selected), 200);
  }

  return (
    <main className="demo-access">
      {/* Left Aerospace Story & Mission Telemetry Hero */}
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="TanawOrbit Mission Badge" />
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              TanawOrbit
            </span>
            <small className="text-[10px] tracking-[0.25em] font-mono text-cyan-400 block -mt-0.5">
              TALA PULSE · HUMAN SPACEFLIGHT
            </small>
          </div>
        </div>

        <div className="access-story-copy">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4">
            <Radio size={13} className="text-cyan-400 animate-pulse" />
            <span>DEEP-SPACE HEALTH OPERATIONS</span>
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            One crew.
            <br />
            <span className="text-cyan-300">A connected perspective.</span>
          </h1>

          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed mt-3 max-w-[440px]">
            Autonomous physiological telemetry, cabin environment life-support correlation,
            and individualized clinical countermeasures for long-duration human spaceflight.
          </p>

          <div className="access-mission mt-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <strong className="text-white text-sm font-semibold">{mission.name}</strong>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                FLIGHT DAY {mission.day} / {mission.durationDays}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Altitude</span>
                <strong className="text-slate-200 text-xs tabular-nums">{liveAlt.toFixed(1)} km</strong>
              </div>
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Velocity</span>
                <strong className="text-cyan-300 text-xs tabular-nums">{liveVel.toFixed(3)} km/s</strong>
              </div>
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Telemetry</span>
                <strong className="text-emerald-400 text-xs flex items-center justify-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  5/5 Active
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Planetary Horizon Vista & Moving Orbital Telemetry */}
        {(() => {
          // Precise quadratic bezier trajectory interpolation: M -20 170 Q 270 45 620 115
          const s = 0.05 + 0.90 * orbitProgress;
          const u = 1 - s;
          const craftX = u * u * -20 + 2 * u * s * 270 + s * s * 620;
          const craftY = u * u * 170 + 2 * u * s * 45 + s * s * 115;
          const tagWidth = 142;
          const tagHeight = 32;
          const tagX = craftX < 420 ? craftX + 16 : craftX - (tagWidth + 16);
          const tagY = Math.max(14, Math.min(160, craftY - 38));

          return (
            <div className="access-orbital-vista" aria-hidden="true">
              <div className="vista-horizon">
                <div className="vista-atmosphere-glow" />
              </div>

              <svg
                className="vista-orbit-svg"
                viewBox="0 0 600 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Orbital Trajectory Arc Track */}
                <path
                  d="M -20 170 Q 270 45 620 115"
                  stroke="rgba(56, 189, 248, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />

                {/* Connecting telemetry line between moving spacecraft and callout HUD */}
                <line
                  x1={craftX.toFixed(1)}
                  y1={craftY.toFixed(1)}
                  x2={craftX < 420 ? tagX.toFixed(1) : (tagX + tagWidth).toFixed(1)}
                  y2={(tagY + 16).toFixed(1)}
                  stroke="rgba(56, 189, 248, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Moving Spacecraft Radar Ping Waves */}
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="18"
                  stroke="rgba(56, 189, 248, 0.3)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.8"
                />
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="9"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  fill="rgba(8, 20, 42, 0.7)"
                  opacity="0.95"
                />
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="4"
                  fill="#38bdf8"
                />

                {/* Dynamic Telemetry HUD Tag (Follows craft with live numbers) */}
                <g transform={`translate(${tagX.toFixed(1)}, ${tagY.toFixed(1)})`}>
                  <rect
                    x="0"
                    y="0"
                    width={tagWidth}
                    height={tagHeight}
                    rx="6"
                    fill="rgba(6, 13, 24, 0.92)"
                    stroke="rgba(56, 189, 248, 0.45)"
                  />
                  <circle cx="10" cy="12" r="3" fill="#38bdf8" />
                  <text
                    x="18"
                    y="14"
                    fill="#f8fafc"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ASTER VII · {liveAlt.toFixed(1)} KM
                  </text>
                  <text
                    x="18"
                    y="25"
                    fill="#38bdf8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {liveVel.toFixed(3)} KM/S · 51.6° INC
                  </text>
                </g>
              </svg>
            </div>
          );
        })()}

        {/* Clean Grounded Footer (Backend Review Door removed) */}
        <div className="access-story-footer relative z-10 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-md">
            <span className="font-mono text-[11px] tracking-wider text-slate-400">
              TEAM TALA PULSE · NASA SPACE APPS 2026
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ORBITAL TELEMETRY: ACTIVE (4 Hz)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Flight Deck Authentication Terminal */}
      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-slate-300 font-medium">
              FLIGHT CREW GATEWAY · OPERATIONAL
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
            <Clock size={13} />
            <span>{utcTime || "UTC TIME"}</span>
          </div>
        </div>

        <div className="access-heading">
          <div className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 font-semibold mb-1">
            CREW AUTHENTICATION CONSOLE
          </div>
          <h2 id="access-title" className="text-2xl font-semibold text-white tracking-tight">
            Flight Deck Terminal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select your astronaut profile, then click Authorize or enter your 4-digit mission PIN.
          </p>
        </div>

        {/* 5 Real Crew Cards */}
        <div className="access-crew-grid mt-5" role="group" aria-label="Flight crew roster">
          {crew.map((member, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={member.id}
                type="button"
                className={`relative p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/40"
                    : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
                aria-pressed={isSelected}
                disabled={checking}
                onClick={() => choose(index)}
              >
                <div
                  className="size-10 rounded-full grid place-items-center font-bold text-xs text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: member.color || "#0284c7" }}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt=""
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    member.initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-xs font-semibold text-slate-100 truncate block">
                      {member.name}
                    </strong>
                    {isSelected && (
                      <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                    {member.role}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-cyan-300/90 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/30">
                      PIN: {member.demoPin}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      CLEARED
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Astronaut Clearance & Auth Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Ready for Station Clearance
              </span>
              <strong className="text-sm font-semibold text-white">
                {person.name}
              </strong>
            </div>

            <button
              type="button"
              onClick={quickAuthorize}
              disabled={checking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-950/50 transition active:scale-[0.98] border border-cyan-400/30 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>{checking ? "Authorizing..." : "1-Click Flight Authorize"}</span>
            </button>
          </div>

          {/* Interactive PIN Verification Area */}
          <div className="border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound size={13} className="text-cyan-400" />
                Manual PIN Verification (Assigned: <code className="text-cyan-300 font-mono font-bold">{person.demoPin}</code>)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Keyboard or keypad
              </span>
            </div>

            {/* Hidden accessible input to support physical keyboard & mobile entry */}
            <input
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
              aria-label="4-digit mission PIN input"
            />

            {/* Discrete 4-digit code slots (clickable to focus) */}
            <div
              className="flex items-center gap-3 justify-center my-3 cursor-pointer group"
              onClick={() => inputRef.current?.focus()}
              role="button"
              tabIndex={0}
              aria-label="Focus PIN input"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.focus();
              }}
            >
              {[0, 1, 2, 3].map((slot) => {
                const char = pin[slot];
                const isCurrent = pin.length === slot;
                return (
                  <div
                    key={slot}
                    className={`size-12 rounded-lg border text-lg font-mono font-bold grid place-items-center transition ${
                      char
                        ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : isCurrent
                        ? "border-cyan-500/60 bg-slate-950/80 text-cyan-400 ring-2 ring-cyan-500/20 animate-pulse"
                        : "border-slate-700 bg-slate-950/60 text-slate-500 group-hover:border-slate-600"
                    }`}
                  >
                    {char ? "•" : ""}
                  </div>
                );
              })}
            </div>

            {/* Always-visible Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mt-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={checking}
                  onClick={() => digit(n)}
                  className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-mono font-medium text-slate-200 transition active:scale-95 cursor-pointer"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={checking || !pin}
                onClick={() => {
                  setPin("");
                  setError("");
                  inputRef.current?.focus();
                }}
                className="h-10 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={checking}
                onClick={() => digit("0")}
                className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-mono font-medium text-slate-200 transition active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                disabled={checking || pin.length !== 4}
                onClick={() => {
                  if (pin === person.demoPin) onEnter(selected);
                  else setError("Security code mismatch. Try the designated mission PIN.");
                }}
                className="h-10 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/70 border border-cyan-700/50 text-xs font-mono text-cyan-200 transition cursor-pointer disabled:opacity-40"
              >
                Enter
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-xs text-center mt-2 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Educational human spaceflight prototype · Check-ins stay in local memory · Not a clinical medical device
          </p>
        </div>
      </section>
    </main>
  );
}

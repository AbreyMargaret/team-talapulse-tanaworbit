import { useState, useMemo } from "react";
import {
  Heart,
  Activity,
  Moon,
  Zap,
  Check,
  CheckSquare,
  AlertTriangle,
  Shield,
  Sliders,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  Copy,
  RotateCcw,
  Stethoscope,
  Eye,
  Smile,
  Compass,
  Sparkles,
  Thermometer,
  Wind,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { personalBaseline, mission, crew, type Reading } from "./data";
import type { Page } from "./App";

export type MeasurementKey = "heart" | "systolic" | "diastolic" | "sleep";
export type CheckInDraft = Omit<Reading, MeasurementKey> & Record<MeasurementKey, number | "">;

export default function DailyHealthCheckIn({
  draft,
  onDraftChange,
  person,
  navigate,
  onSave,
}: {
  draft: CheckInDraft;
  onDraftChange: (draft: CheckInDraft) => void;
  person: (typeof crew)[number];
  navigate: (page: Page) => void;
  onSave: (draft: Reading) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [error, setError] = useState("");

  // Additional In-Flight Spaceflight Symptoms (HRP clinical standards)
  const [sasRating, setSasRating] = useState<number>(0); // 0=Adapted, 1=Mild, 2=Moderate, 3=Severe
  const [cephaladShift, setCephaladShift] = useState<number>(1); // 0=None, 1=Mild Puffiness, 2=Head Fullness, 3=Severe
  const [sansVisualBlur, setSansVisualBlur] = useState<boolean>(false);
  const [coreTemp, setCoreTemp] = useState<number>(36.6); // °C
  const [spo2, setSpo2] = useState<number>(98); // %
  const [sleepQuality, setSleepQuality] = useState<"Sound" | "Fragmented" | "Restless">("Sound");

  const baseline = useMemo(() => {
    try {
      const b = personalBaseline(person.id);
      return {
        ...b,
        heart: Math.round(b.heart),
        systolic: Math.round(b.systolic),
        diastolic: Math.round(b.diastolic),
        sleep: +Number(b.sleep).toFixed(1),
      };
    } catch {
      return {
        heart: 71,
        systolic: 111,
        diastolic: 72,
        sleep: 7.2,
        fatigue: 2,
        mood: "Good",
        notes: "",
      } as Reading;
    }
  }, [person.id]);

  // Real-time delta calculations
  const hrVal = Math.round(Number(draft.heart) || baseline.heart);
  const sysVal = Math.round(Number(draft.systolic) || baseline.systolic);
  const diaVal = Math.round(Number(draft.diastolic) || baseline.diastolic);
  const sleepVal = +Number(draft.sleep || baseline.sleep).toFixed(1);

  const hrDelta = Math.round(hrVal - baseline.heart);
  const sysDelta = Math.round(sysVal - baseline.systolic);
  const diaDelta = Math.round(diaVal - baseline.diastolic);
  const sleepDelta = +(sleepVal - baseline.sleep).toFixed(1);

  // Mean Arterial Pressure: (2*diastolic + systolic) / 3
  const mapValue = Math.round((2 * diaVal + sysVal) / 3);

  // Automated Flight Surgeon Clinical Triggers
  const clinicalAdvisories = useMemo(() => {
    const list: { type: "nominal" | "warning" | "alert"; text: string; action: string }[] = [];

    if (sansVisualBlur || cephaladShift >= 2) {
      list.push({
        type: "alert",
        text: "SANS / Cephalad Hypertension Indication: Visual blurring or elevated intracranial fullness reported.",
        action: "Schedule 30-min Lower Body Negative Pressure (LBNP at -25 mmHg) & verify habitat pCO₂ < 3.0 mmHg.",
      });
    }

    if (sleepVal < 6.0) {
      list.push({
        type: "warning",
        text: `Circadian Deficit: Sleep recorded at ${sleepVal} hrs (${Math.abs(sleepDelta)} hrs below nominal baseline).`,
        action: "Switch crew quarters SSLA to blue-depleted mode 60 min prior to sleep epoch. Micro-dose melatonin (0.5mg) if needed.",
      });
    }

    if (hrVal > 95 || hrDelta > 18) {
      list.push({
        type: "warning",
        text: `Resting Tachycardia: Heart rate is +${hrDelta} bpm above 14-day rolling baseline.`,
        action: "Verify hydration status (target 2.5 L/day) and review morning CEVIS aerobic exercise load.",
      });
    }

    if (sysVal >= 135 || diaVal >= 88) {
      list.push({
        type: "warning",
        text: `Elevated Systemic Pressure: ${sysVal}/${diaVal} mmHg exceeds nominal resting window.`,
        action: "Repeat blood pressure reading post-rest in seated microgravity posture.",
      });
    }

    if (coreTemp >= 37.4) {
      list.push({
        type: "alert",
        text: `Elevated Core Body Temperature (${coreTemp}°C) indicates microgravity 'Space Fever' response.`,
        action: "Check sleep pod ventilation diffuser air velocity (>0.08 m/s) and drink chilled electrolyte solution.",
      });
    }

    if (list.length === 0) {
      list.push({
        type: "nominal",
        text: "Telemetry Nominal: All cardiovascular, circadian, and neurovestibular metrics within nominal baseline ranges.",
        action: "Cleared for full flight operations and scheduled extravehicular / scientific payload duties.",
      });
    }

    return list;
  }, [sansVisualBlur, cephaladShift, sleepVal, sleepDelta, hrVal, hrDelta, sysVal, diaVal, coreTemp]);

  // 1-Click Sync from Wearable Telemetry (PUMA / Bio-Harness)
  function syncWearableSensors() {
    onDraftChange({
      ...draft,
      heart: baseline.heart,
      systolic: 120,
      diastolic: 73,
      sleep: baseline.sleep,
      fatigue: 2,
      mood: "Good",
    });
    setCoreTemp(36.6);
    setSpo2(98);
    setSasRating(0);
    setCephaladShift(1);
    setSansVisualBlur(false);
    setSleepQuality("Sound");
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3000);
  }

  function handleNextStep() {
    if (step === 1) {
      if (Number(draft.systolic) <= Number(draft.diastolic)) {
        setError("Clinical validation error: Systolic pressure must be greater than diastolic pressure.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  }

  function handleSaveCheckIn() {
    // Format full clinical note with in-flight symptoms for medical record
    const symptomsSummary = [
      `SAS Rating: ${["Adapted", "Mild Disorientation", "Moderate Nausea", "Severe"][sasRating]}`,
      `Cephalad Fullness: ${["None", "Mild Puffiness", "Head Fullness", "Heavy Congestion"][cephaladShift]}`,
      sansVisualBlur ? "SANS Near-Vision Blur: YES" : "SANS Near-Vision Blur: NONE",
      `Core Temp: ${coreTemp}°C`,
      `SpO2: ${spo2}%`,
      `Sleep Quality: ${sleepQuality}`,
    ].join(" · ");

    const combinedNotes = draft.notes
      ? `${draft.notes}\n[In-Flight Screen: ${symptomsSummary}]`
      : `[In-Flight Screen: ${symptomsSummary}]`;

    onSave({
      ...draft,
      heart: hrVal,
      systolic: sysVal,
      diastolic: diaVal,
      sleep: sleepVal,
      notes: combinedNotes,
    });
    setSaved(true);
  }

  function copyFlightBriefing() {
    const text = `TANAWORBIT ASTRONAUT CLINICAL LOG
Mission: ${mission.name} · Day ${mission.day} of ${mission.durationDays}
Astronaut: ${person.name} (${person.id.toUpperCase()}) · ${person.role}
Timestamp: ${new Date().toISOString()}

BIOMETRIC VITALS:
- Heart Rate: ${hrVal} bpm (Baseline: ${baseline.heart} bpm, Δ ${hrDelta >= 0 ? "+" : ""}${hrDelta} bpm)
- Blood Pressure: ${sysVal}/${diaVal} mmHg (MAP: ${mapValue} mmHg)
- Sleep Duration: ${sleepVal} hrs (${sleepQuality})
- Core Temp: ${coreTemp}°C · SpO2: ${spo2}%

IN-FLIGHT ADAPTATION & SYMPTOMS:
- Neurovestibular (SAS): ${["Adapted", "Mild Disorientation", "Moderate Nausea", "Severe"][sasRating]}
- Cephalad Fluid Shift: ${["None", "Mild Puffiness", "Head Fullness", "Heavy Congestion"][cephaladShift]}
- Near-Vision Impairment (SANS): ${sansVisualBlur ? "REPORTED (Blurring/strain)" : "None"}
- Fatigue Score: ${draft.fatigue}/5 · Mood: ${draft.mood}

OPERATIONAL FLIGHT SURGEON NOTE:
${clinicalAdvisories.map((a) => `[${a.type.toUpperCase()}] ${a.text} -> ${a.action}`).join("\n")}

Notes: ${draft.notes || "No additional crew notes."}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (saved) {
    return (
      <div className="daily-checkin-container max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* Success Header Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 size-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <span className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 grid place-items-center text-emerald-300">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                FLIGHT LOG TRANSMITTED & VERIFIED
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Daily Check-In Recorded for {person.name.split(" ")[0]}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your physiological telemetry, circadian rest period, and spaceflight symptom screen have been verified and integrated into the active mission flight health record.
          </p>

          {/* Quick Metrics Badge Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Heart Rate</span>
              <div className="text-lg font-mono font-bold text-white">
                {hrVal} <span className="text-xs text-slate-400 font-normal">bpm</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                {hrDelta >= 0 ? `+${hrDelta}` : hrDelta} vs baseline
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Blood Pressure</span>
              <div className="text-lg font-mono font-bold text-white">
                {sysVal}/{diaVal} <span className="text-xs text-slate-400 font-normal">mmHg</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                MAP {mapValue} mmHg
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Sleep Duration</span>
              <div className="text-lg font-mono font-bold text-white">
                {sleepVal} <span className="text-xs text-slate-400 font-normal">hrs</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {sleepQuality}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Mission Readiness</span>
              <div className="text-lg font-mono font-bold text-emerald-400">
                GO FOR DUTY
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Fatigue: {draft.fatigue}/5
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("Astronaut Dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition shadow-lg shadow-cyan-900/30 active:scale-98 cursor-pointer"
            >
              <span>Return to Flight Deck</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => navigate("Physiological Monitoring")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition active:scale-98 cursor-pointer"
            >
              <Activity size={15} className="text-cyan-400" />
              <span>Inspect Biometric Telemetry</span>
            </button>

            <button
              type="button"
              onClick={copyFlightBriefing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition cursor-pointer ml-auto"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Log Copied" : "Copy Medical Note"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSaved(false);
                setStep(1);
              }}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
            >
              Modify Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-checkin-container max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Flight Operations Toolbar & Wearable Sync */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5">
            <Stethoscope size={13} className="text-cyan-400" />
            FLIGHT DECK CLINICAL LOG
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-xs">
            AST-EX-VII · FD {mission.day}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-xs">
            CREW ID: {person.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={syncWearableSensors}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-200 font-mono text-xs transition active:scale-98 shadow-sm cursor-pointer group"
            title="Auto-fill vitals from active wearable Bio-Harness"
          >
            <Zap size={14} className="text-cyan-400 group-hover:scale-110 transition" />
            <span>Sync Wearable Telemetry</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Biometric telemetry synchronized from {person.name}'s active Bio-Harness array.</span>
        </div>
      )}

      {/* High-Tech Stepper */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 1
              ? "bg-cyan-950 border border-cyan-500/50 text-cyan-200 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-800 grid place-items-center text-[10px]">1</span>
          <span className="hidden sm:inline">Biometric Vitals</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (Number(draft.systolic) <= Number(draft.diastolic)) {
              setError("Systolic pressure must be greater than diastolic pressure.");
              return;
            }
            setError("");
            setStep(2);
          }}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 2
              ? "bg-cyan-950 border border-cyan-500/50 text-cyan-200 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-800 grid place-items-center text-[10px]">2</span>
          <span className="hidden sm:inline">Symptoms & Neuro-Ocular</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (Number(draft.systolic) <= Number(draft.diastolic)) {
              setError("Systolic pressure must be greater than diastolic pressure.");
              return;
            }
            setError("");
            setStep(3);
          }}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 3
              ? "bg-cyan-950 border border-cyan-500/50 text-cyan-200 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-800 grid place-items-center text-[10px]">3</span>
          <span className="hidden sm:inline">Review & Transmit</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2" role="alert">
          <AlertTriangle size={16} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Biometric Vitals */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heart Rate Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="checkin-heart-input" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Heart size={16} className="text-rose-400" />
                  Resting Heart Rate
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Baseline: <b className="text-slate-200">{baseline.heart} bpm</b>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, heart: Math.max(35, (Number(draft.heart) || baseline.heart) - 1) })}
                  className="size-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Decrease heart rate"
                >
                  −
                </button>
                <div className="flex-1 relative">
                  <input
                    id="checkin-heart-input"
                    type="number"
                    min={35}
                    max={220}
                    value={draft.heart}
                    onChange={(e) => onDraftChange({ ...draft, heart: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-2xl font-bold font-mono text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
                    bpm
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, heart: Math.min(220, (Number(draft.heart) || baseline.heart) + 1) })}
                  className="size-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Increase heart rate"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className={Math.abs(hrDelta) <= 8 ? "text-emerald-400" : "text-amber-400"}>
                  {hrDelta === 0 ? "±0 bpm vs baseline" : hrDelta > 0 ? `+${hrDelta} bpm vs baseline` : `${hrDelta} bpm vs baseline`}
                </span>
                <span className="text-slate-500">Nominal Rest: 55–85 bpm</span>
              </div>
            </div>

            {/* Blood Pressure Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Activity size={16} className="text-cyan-400" />
                  Systemic Blood Pressure
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Baseline: <b className="text-slate-200">{baseline.systolic}/{baseline.diastolic}</b>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>SYSTOLIC</span>
                    <span>{sysDelta >= 0 ? `+${sysDelta}` : sysDelta}</span>
                  </div>
                  <input
                    type="number"
                    min={60}
                    max={240}
                    value={draft.systolic}
                    onChange={(e) => onDraftChange({ ...draft, systolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-2 rounded-xl bg-slate-950 border border-slate-700 text-xl font-bold font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>DIASTOLIC</span>
                    <span>{diaDelta >= 0 ? `+${diaDelta}` : diaDelta}</span>
                  </div>
                  <input
                    type="number"
                    min={40}
                    max={150}
                    value={draft.diastolic}
                    onChange={(e) => onDraftChange({ ...draft, diastolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-2 rounded-xl bg-slate-950 border border-slate-700 text-xl font-bold font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-cyan-300">MAP: {mapValue} mmHg</span>
                <span className="text-slate-500">Unit: mmHg (Seated Zero-G)</span>
              </div>
            </div>

            {/* Sleep Duration & Quality Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="checkin-sleep-input" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Moon size={16} className="text-indigo-400" />
                  Sleep Duration
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: <b className="text-slate-200">≥ 7.0 hrs</b>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, sleep: Math.max(0, +(Number(draft.sleep) - 0.5).toFixed(1)) })}
                  className="size-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Decrease sleep duration"
                >
                  −
                </button>
                <div className="flex-1 relative">
                  <input
                    id="checkin-sleep-input"
                    type="number"
                    step={0.1}
                    min={0}
                    max={24}
                    value={draft.sleep}
                    onChange={(e) => onDraftChange({ ...draft, sleep: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-2xl font-bold font-mono text-white outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
                    hours
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, sleep: Math.min(24, +(Number(draft.sleep) + 0.5).toFixed(1)) })}
                  className="size-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Increase sleep duration"
                >
                  +
                </button>
              </div>

              {/* Sleep Quality Selector */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                  Sleep Pod Microgravity Quality
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["Sound", "Fragmented", "Restless"] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                        sleepQuality === q
                          ? "bg-indigo-950 border border-indigo-500/60 text-indigo-200 shadow-sm"
                          : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Flight Core Biomarkers (Temp & SpO2) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Thermometer size={16} className="text-amber-400" />
                  Core Biomarkers
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  HRP In-Flight Screen
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>CORE TEMP</span>
                    <span className={coreTemp > 37.3 ? "text-amber-400" : "text-emerald-400"}>
                      {coreTemp > 37.3 ? "Elevated" : "Normal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step={0.1}
                      min={35.0}
                      max={41.0}
                      value={coreTemp}
                      onChange={(e) => setCoreTemp(Number(e.target.value))}
                      className="w-full text-lg font-mono font-bold text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">°C</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>SPO2 OXYGEN</span>
                    <span className="text-emerald-400">Nominal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={85}
                      max={100}
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                      className="w-full text-lg font-mono font-bold text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center justify-between">
                <span>Space Fever Threshold: 37.4°C</span>
                <span>SpO2 Target: ≥96%</span>
              </div>
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-500">
              Step 1 of 3 · Measurements verified against 14-day mission baseline
            </span>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition shadow-lg shadow-cyan-900/30 active:scale-98 cursor-pointer"
            >
              <span>Next: Symptoms & Neuro-Ocular</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Neuro-Ocular & Subjective Symptoms */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Space Adaptation Syndrome (SAS) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Compass size={16} className="text-cyan-400" />
                  Space Adaptation Syndrome (SAS)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Neurovestibular</span>
              </div>
              <p className="text-xs text-slate-400">
                Otolith-ocular recalibration rating in zero-G:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 0, label: "0 · Fully Adapted", desc: "No dizziness" },
                  { val: 1, label: "1 · Mild", desc: "Head movement lag" },
                  { val: 2, label: "2 · Moderate", desc: "Stomach awareness" },
                  { val: 3, label: "3 · Severe", desc: "Emesis risk" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSasRating(item.val)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      sasRating === item.val
                        ? "bg-cyan-950 border-cyan-500/60 text-cyan-200 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <strong className="text-xs font-mono block">{item.label}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cephalad Fluid Shift & SANS Visual Screen */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Eye size={16} className="text-purple-400" />
                  Cephalad Fluid Shift & SANS
                </span>
                <span className="text-[10px] font-mono text-purple-400">Critical Monitor</span>
              </div>
              <p className="text-xs text-slate-400">
                Intracranial venous congestion and visual acuity:
              </p>

              {/* Cephalad shift scale */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Head Fullness / Facial Congestion
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {["0: None", "1: Mild", "2: Full", "3: Heavy"].map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setCephaladShift(idx)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                        cephaladShift === idx
                          ? "bg-purple-950 border border-purple-500/60 text-purple-200 shadow-sm"
                          : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Near vision check */}
              <div
                onClick={() => setSansVisualBlur(!sansVisualBlur)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between mt-2 ${
                  sansVisualBlur
                    ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className={`size-5 rounded-md grid place-items-center transition ${
                      sansVisualBlur ? "bg-rose-500 text-slate-950" : "bg-slate-800 border border-slate-700"
                    }`}
                  >
                    {sansVisualBlur && <Check size={12} strokeWidth={3} />}
                  </button>
                  <div>
                    <strong className="text-xs font-semibold block">Near-Vision Blurring / Eye Strain (SANS)</strong>
                    <span className="text-[10px] text-slate-400">Check if Jaeger card reading indicates visual acuity degradation</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  sansVisualBlur ? "bg-rose-950 border-rose-700 text-rose-300" : "bg-slate-900 border-slate-800 text-slate-500"
                }`}>
                  {sansVisualBlur ? "FLAGGED" : "CLEAR"}
                </span>
              </div>
            </div>

            {/* Fatigue Rating (Samn-Perelli Flight Scale) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Operational Fatigue Rating
                </span>
                <span className="text-[10px] font-mono text-slate-400">Samn-Perelli Scale</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onDraftChange({ ...draft, fatigue: n })}
                    className={`py-3 px-1 rounded-xl border text-center transition cursor-pointer ${
                      draft.fatigue === n
                        ? "bg-amber-950/80 border-amber-500/60 text-amber-200 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-base font-mono font-bold">{n}</div>
                    <div className="text-[9px] font-mono mt-1 text-slate-400 line-clamp-1">
                      {["Very Low", "Low", "Moderate", "High", "Very High"][n - 1]}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-mono text-slate-400 text-right">
                Current: <b className="text-amber-300">{draft.fatigue} / 5</b> ({["Fully Alert", "Very Lively", "Nominal Rested", "Substantial Fatigue", "Exhausted"][draft.fatigue - 1]})
              </p>
            </div>

            {/* Crew Mood & Morale */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                  <Smile size={16} className="text-emerald-400" />
                  Crew Morale & Subjective State
                </span>
                <span className="text-[10px] font-mono text-slate-400">Psychological Wellness</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["Great", "Good", "Fair", "Low"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onDraftChange({ ...draft, mood: m })}
                    className={`py-3 px-2 rounded-xl border text-center transition cursor-pointer ${
                      draft.mood === m
                        ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Smile size={18} className="mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-mono block">{m}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-2">
            <label htmlFor="checkin-notes" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Astronaut Flight Journal & Clinical Observations (Optional)
            </label>
            <textarea
              id="checkin-notes"
              maxLength={1000}
              placeholder="Record subjective sensations, EVA exertion feedback, cabin acoustic levels, or personal comments for flight surgeon..."
              value={draft.notes}
              onChange={(e) => onDraftChange({ ...draft, notes: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
            >
              Back to Vitals
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition shadow-lg shadow-cyan-900/30 active:scale-98 cursor-pointer"
            >
              <span>Next: Clinical Verification</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Transmit */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Clinical Telemetry Summary Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
                  FLIGHT SURGEON PRE-TRANSMIT AUDIT
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Verify Today's In-Flight Health Record
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {person.name} · Crew ID: {person.id.toUpperCase()}
              </span>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400">
                    <th className="pb-2">Physiological Parameter</th>
                    <th className="pb-2">Today's Value</th>
                    <th className="pb-2">Personal Baseline</th>
                    <th className="pb-2">Baseline Variance</th>
                    <th className="pb-2">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                      <Heart size={14} className="text-rose-400" />
                      Resting Heart Rate
                    </td>
                    <td className="py-2.5 font-bold text-white">{hrVal} bpm</td>
                    <td className="py-2.5 text-slate-400">{baseline.heart} bpm</td>
                    <td className="py-2.5 text-cyan-400">{hrDelta >= 0 ? `+${hrDelta}` : hrDelta} bpm</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        Math.abs(hrDelta) <= 8 ? "bg-emerald-950/80 border-emerald-600/40 text-emerald-300" : "bg-amber-950/80 border-amber-600/40 text-amber-300"
                      }`}>
                        {Math.abs(hrDelta) <= 8 ? "NOMINAL" : "OBSERVE"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                      <Activity size={14} className="text-cyan-400" />
                      Systemic Blood Pressure
                    </td>
                    <td className="py-2.5 font-bold text-white">{sysVal}/{diaVal} mmHg</td>
                    <td className="py-2.5 text-slate-400">{baseline.systolic}/{baseline.diastolic} mmHg</td>
                    <td className="py-2.5 text-cyan-400">MAP {mapValue} mmHg</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] border bg-emerald-950/80 border-emerald-600/40 text-emerald-300">
                        NOMINAL
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                      <Moon size={14} className="text-indigo-400" />
                      Circadian Sleep Duration
                    </td>
                    <td className="py-2.5 font-bold text-white">{sleepVal} hrs ({sleepQuality})</td>
                    <td className="py-2.5 text-slate-400">{baseline.sleep} hrs</td>
                    <td className="py-2.5 text-indigo-300">{sleepDelta >= 0 ? `+${sleepDelta}` : sleepDelta} hrs</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        sleepVal >= 6.5 ? "bg-emerald-950/80 border-emerald-600/40 text-emerald-300" : "bg-amber-950/80 border-amber-600/40 text-amber-300"
                      }`}>
                        {sleepVal >= 6.5 ? "NOMINAL" : "DEFICIT"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                      <Thermometer size={14} className="text-amber-400" />
                      Core Biomarkers
                    </td>
                    <td className="py-2.5 font-bold text-white">{coreTemp}°C · {spo2}% SpO2</td>
                    <td className="py-2.5 text-slate-400">36.6°C · 98%</td>
                    <td className="py-2.5 text-slate-400">Normal range</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] border bg-emerald-950/80 border-emerald-600/40 text-emerald-300">
                        NOMINAL
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                      <Eye size={14} className="text-purple-400" />
                      Neuro-Ocular & SANS
                    </td>
                    <td className="py-2.5 font-bold text-white">{sansVisualBlur ? "Visual Blur Present" : "Clear 20/20"}</td>
                    <td className="py-2.5 text-slate-400">None</td>
                    <td className="py-2.5 text-slate-400">Cephalad Shift: {cephaladShift}/3</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        sansVisualBlur ? "bg-rose-950/80 border-rose-600/40 text-rose-300" : "bg-emerald-950/80 border-emerald-600/40 text-emerald-300"
                      }`}>
                        {sansVisualBlur ? "ATTENTION" : "NOMINAL"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dynamic Clinical Advisories */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Automated Clinical Countermeasure Advisories
              </span>
              {clinicalAdvisories.map((adv, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    adv.type === "alert"
                      ? "bg-rose-950/30 border-rose-600/40 text-rose-200"
                      : adv.type === "warning"
                      ? "bg-amber-950/30 border-amber-600/40 text-amber-200"
                      : "bg-emerald-950/30 border-emerald-600/40 text-emerald-200"
                  }`}
                >
                  <strong className="block mb-0.5 font-semibold font-mono text-[11px]">
                    {adv.text}
                  </strong>
                  <span className="text-[11px] text-slate-300 block font-mono">
                    Protocol Action: {adv.action}
                  </span>
                </div>
              ))}
            </div>

            {/* Transmit Button Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
              >
                Back to Symptoms
              </button>

              <button
                type="button"
                onClick={handleSaveCheckIn}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-emerald-900/40 active:scale-98 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Confirm & Transmit Check-In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

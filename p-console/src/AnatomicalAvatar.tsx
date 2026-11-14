import { useState } from "react";

export type BodyZone =
  | "head"
  | "neck"
  | "chest"
  | "abdomen"
  | "spine"
  | "upperLimbs"
  | "lowerLimbs";

export type SymptomLog = {
  zone: BodyZone;
  symptom: string;
  severity: "Mild" | "Moderate" | "Severe";
  countermeasure: string;
  timestamp: string;
};

const ZONE_DATA: Record<
  BodyZone,
  { label: string; symptoms: string[]; countermeasure: string; normalState: string }
> = {
  head: {
    label: "Cranial & Neuro-Ocular",
    symptoms: [
      "Cephalad fluid shift fullness",
      "Spaceflight-Associated Neuro-ocular Syndrome (SANS) blur",
      "Tension headache / elevated pCO₂ sensitivity",
      "Mild sinus congestion",
    ],
    countermeasure:
      "Perform Lower Body Negative Pressure (LBNP) session, check cabin CO₂ levels (nominal < 5.3 mmHg), stay upright relative to ventilation stream.",
    normalState: "Clear ocular acuity, normal intracranial perfusion.",
  },
  neck: {
    label: "Cervical & Vestibular",
    symptoms: [
      "Vestibular adaptation illusion (inversion sensation)",
      "Cervical paraspinal tightness",
      "Motion-provoked disorientation",
    ],
    countermeasure:
      "Avoid rapid head rotations out of sagittal plane. Refer to Vestibular Adaptation Checklist; consult Flight Surgeon if persistent beyond FD 03.",
    normalState: "Normal otolith-ocular reflex, head movement stable.",
  },
  chest: {
    label: "Thoracic & Cardiovascular",
    symptoms: [
      "Resting sinus tachycardia (>100 bpm)",
      "Chest tightness during cycle ergometer",
      "Post-exercise dyspnea",
      "Palpitations",
    ],
    countermeasure:
      "Rest immediately in tethered station. Monitor continuous ECG & SpO₂. Verify heart rate returns below 90 bpm within 5 minutes. Notify Medical Officer.",
    normalState: "Resting HR 60-80 bpm, normal heart sounds, SpO₂ > 96%.",
  },
  abdomen: {
    label: "Gastrointestinal & Autonomic",
    symptoms: [
      "Space Motion Sickness (SMS) / stomach awareness",
      "Nausea / reduced appetite",
      "Delayed gastric emptying / bloating",
    ],
    countermeasure:
      "Sip electrolyte fluid, avoid high-fat meals. Promethazine oral/IM per medical kit protocol if emesis threatens hydration.",
    normalState: "Normal bowel sounds, 2400 kcal daily intake on target.",
  },
  spine: {
    label: "Vertebral & Axial Posture",
    symptoms: [
      "Spinal elongation ache (4-6 cm height growth)",
      "Lumbar extensor muscle strain",
      "Postural fatigue from neutral body posture (NBP)",
    ],
    countermeasure:
      "Perform fetal tuck decompression stretch (2x daily, 10 min). Ensure harness fit on ARED resistive exercise is tight across lumbar pads.",
    normalState: "Spine elongated within expected microgravity bounds (3-5 cm).",
  },
  upperLimbs: {
    label: "Shoulders, Arms & Wrists",
    symptoms: [
      "Forearm flexor fatigue from handrail gripping",
      "Wrist extensor strain (EVA glove work)",
      "Shoulder impingement from tether tension",
    ],
    countermeasure:
      "Gentle grip-release stretching exercises. Apply warm thermal pack from crew kit. Log hand-eye fine motor tapping score.",
    normalState: "Full range of motion, normal fine motor dexterity.",
  },
  lowerLimbs: {
    label: "Pelvis, Thighs & Calves",
    symptoms: [
      "Fluid shift 'bird legs' sensation",
      "Soleus / gastrocnemius microgravity unloading",
      "Shin splints from treadmill bungee harness load",
    ],
    countermeasure:
      "Maintain mandatory daily 2-hour exercise countermeasure (ARED resistive squats & T2 treadmill 1-g equivalent loading).",
    normalState: "Muscle tone preserved, pedal pulses intact, no edema.",
  },
};

export default function AnatomicalAvatar({
  onLogSymptom,
  recentLogs,
}: {
  onLogSymptom?: (log: SymptomLog) => void;
  recentLogs?: SymptomLog[];
}) {
  const [activeZone, setActiveZone] = useState<BodyZone>("head");
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");
  const [severity, setSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  const zoneInfo = ZONE_DATA[activeZone];

  function handleLog() {
    if (!selectedSymptom) return;
    const log: SymptomLog = {
      zone: activeZone,
      symptom: selectedSymptom,
      severity,
      countermeasure: zoneInfo.countermeasure,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onLogSymptom?.(log);
    setLoggedNotification(`Logged: ${selectedSymptom} (${severity})`);
    setTimeout(() => setLoggedNotification(null), 3500);
    setSelectedSymptom("");
  }

  return (
    <div className="avatar-symptom-mapper">
      <div className="avatar-header">
        <div>
          <span className="eyebrow">CREW TELEMETRY & SYMPTOM MAPPING</span>
          <h3 className="text-base font-semibold text-white">Anatomical System Visualizer</h3>
          <p className="text-xs text-slate-400">
            Click any anatomical region to inspect physiological baseline or log an in-flight symptom.
          </p>
        </div>
        <div className="status-badges flex gap-2 text-xs">
          <span className="badge-nominal">● Nominal</span>
          <span className="badge-warning">● Attention</span>
          <span className="badge-critical">● Triage</span>
        </div>
      </div>

      <div className="avatar-body-grid">
        {/* Vector Anatomical Silhouette */}
        <div className="avatar-svg-container">
          <svg
            viewBox="0 0 200 420"
            className="avatar-human-silhouette"
            aria-label="Human body silhouette with selectable health zones"
          >
            {/* Outline of human figure in microgravity neutral body posture */}
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e2c3d" />
                <stop offset="100%" stopColor="#101826" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Head */}
            <circle
              cx="100"
              cy="45"
              r="26"
              className={`body-part ${activeZone === "head" ? "active" : ""}`}
              onClick={() => setActiveZone("head")}
            />
            {/* Neck */}
            <rect
              x="92"
              y="72"
              width="16"
              height="16"
              rx="4"
              className={`body-part ${activeZone === "neck" ? "active" : ""}`}
              onClick={() => setActiveZone("neck")}
            />
            {/* Thorax / Chest */}
            <path
              d="M 65 92 L 135 92 L 126 150 L 74 150 Z"
              className={`body-part ${activeZone === "chest" ? "active" : ""}`}
              onClick={() => setActiveZone("chest")}
            />
            {/* Abdomen / Pelvis */}
            <path
              d="M 74 152 L 126 152 L 132 205 L 68 205 Z"
              className={`body-part ${activeZone === "abdomen" ? "active" : ""}`}
              onClick={() => setActiveZone("abdomen")}
            />
            {/* Spine (centerline overlay) */}
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="200"
              className={`spine-line ${activeZone === "spine" ? "active" : ""}`}
              onClick={() => setActiveZone("spine")}
              strokeWidth="6"
              strokeDasharray="2 3"
            />
            {/* Left Arm & Shoulder */}
            <path
              d="M 62 95 L 36 155 L 26 220 L 38 222 L 48 160 L 70 102 Z"
              className={`body-part ${activeZone === "upperLimbs" ? "active" : ""}`}
              onClick={() => setActiveZone("upperLimbs")}
            />
            {/* Right Arm & Shoulder */}
            <path
              d="M 138 95 L 164 155 L 174 220 L 162 222 L 152 160 L 130 102 Z"
              className={`body-part ${activeZone === "upperLimbs" ? "active" : ""}`}
              onClick={() => setActiveZone("upperLimbs")}
            />
            {/* Left Leg */}
            <path
              d="M 72 210 L 93 210 L 89 295 L 83 385 L 68 385 L 75 295 Z"
              className={`body-part ${activeZone === "lowerLimbs" ? "active" : ""}`}
              onClick={() => setActiveZone("lowerLimbs")}
            />
            {/* Right Leg */}
            <path
              d="M 107 210 L 128 210 L 125 295 L 132 385 L 117 385 L 111 295 Z"
              className={`body-part ${activeZone === "lowerLimbs" ? "active" : ""}`}
              onClick={() => setActiveZone("lowerLimbs")}
            />

            {/* Hotspot Pulse Dots */}
            <circle cx="100" cy="45" r="4" className="pulse-dot" />
            <circle cx="100" cy="120" r="4" className="pulse-dot" />
            <circle cx="100" cy="175" r="4" className="pulse-dot" />
            <circle cx="32" cy="190" r="4" className="pulse-dot" />
            <circle cx="168" cy="190" r="4" className="pulse-dot" />
            <circle cx="82" cy="340" r="4" className="pulse-dot" />
            <circle cx="118" cy="340" r="4" className="pulse-dot" />
          </svg>
          <span className="avatar-caption">CLICK REGION TO FOCUS</span>
        </div>

        {/* Zone Details & Quick Symptom Form */}
        <div className="avatar-details-panel">
          <div className="zone-summary-card">
            <div className="flex items-center justify-between">
              <span className="zone-tag">{zoneInfo.label}</span>
              <span className="zone-status-pill">Baseline Intact</span>
            </div>
            <p className="zone-normal-text">{zoneInfo.normalState}</p>
          </div>

          <div className="symptom-entry-box">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Log Observed Spaceflight Symptom:
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="symptom-select"
            >
              <option value="">-- Select reported symptom --</option>
              {zoneInfo.symptoms.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="severity-row mt-3 flex items-center gap-3">
              <span className="text-xs text-slate-400">Severity:</span>
              {(["Mild", "Moderate", "Severe"] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  className={`severity-chip ${severity === sev ? "selected " + sev.toLowerCase() : ""}`}
                  onClick={() => setSeverity(sev)}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="countermeasure-card mt-3">
              <span className="text-[10px] tracking-wider text-cyan-400 font-mono block mb-1">
                RECOMMENDED COUNTERMEASURE:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{zoneInfo.countermeasure}</p>
            </div>

            <button
              type="button"
              disabled={!selectedSymptom}
              onClick={handleLog}
              className="log-symptom-btn mt-3"
            >
              Log Symptom to Mission Telemetry
            </button>

            {loggedNotification && (
              <div className="log-success-banner mt-2">
                ✓ {loggedNotification}
              </div>
            )}
          </div>

          {/* Recent In-Flight Logs */}
          {recentLogs && recentLogs.length > 0 && (
            <div className="recent-symptom-list mt-3">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                RECENT IN-FLIGHT OBSERVATIONS:
              </span>
              <ul className="text-xs space-y-1">
                {recentLogs.slice(-3).map((l, i) => (
                  <li key={i} className="flex justify-between text-slate-300 bg-slate-900/60 p-1.5 rounded">
                    <span>
                      <strong>[{l.zone.toUpperCase()}]</strong> {l.symptom}
                    </span>
                    <span className="text-slate-400 text-[10px]">{l.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

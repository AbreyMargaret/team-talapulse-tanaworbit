import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Heart,
  Brain,
  Eye,
  Cross,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Shield,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";

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
  {
    title: string;
    laymanLabel: string;
    spacePhenomenon: string;
    symptoms: string[];
    countermeasure: string;
    normalBaseline: string;
    status: "Nominal" | "Attention" | "Monitor";
  }
> = {
  head: {
    title: "Cranial & Ocular System",
    laymanLabel: "Head, Eyes & Brain",
    spacePhenomenon:
      "Fluid Shift & SANS: Without gravity, ~2 liters of bodily fluids float up into your upper body and head, causing facial puffiness, sinus fullness, and mild optic nerve flattening (Spaceflight Associated Neuro-ocular Syndrome).",
    symptoms: [
      "Head fullness & sinus congestion",
      "Blurred vision / near-sight focus difficulty (SANS)",
      "Mild headache from elevated cabin CO₂",
      "Puffiness around eyelids",
    ],
    countermeasure:
      "Perform a 15-minute Lower Body Negative Pressure (LBNP) session to draw fluids down; verify cabin air scrubber is keeping CO₂ < 5.3 mmHg; stay in the path of the cabin ventilation stream.",
    normalBaseline: "Clear optical vision, normal intracranial pressure, normal alertness.",
    status: "Nominal",
  },
  neck: {
    title: "Cervical & Vestibular System",
    laymanLabel: "Neck & Inner Ear (Balance)",
    spacePhenomenon:
      "Otolith Disorientation: Gravity sensors in your inner ear no longer detect 'down'. Rapid head turns cause illusions like feeling inverted or spinning while floating.",
    symptoms: [
      "Feeling upside-down while floating (inversion illusion)",
      "Motion-triggered dizziness when turning head quickly",
      "Neck paraspinal muscle tension from awkward tethering",
    ],
    countermeasure:
      "Keep head movements slow and aligned with your body axis during the first 3 days; look at clear visual references (cabin deck/ceiling labels); perform gentle neck isometric stretches.",
    normalBaseline: "Normal balance adaptation, stable gaze tracking during movement.",
    status: "Nominal",
  },
  chest: {
    title: "Thoracic & Cardiovascular",
    laymanLabel: "Heart, Lungs & Breath",
    spacePhenomenon:
      "Cardiovascular Deconditioning: Your heart doesn't have to pump against gravity, so it works less, stroke volume shifts, and resting pulse fluctuates during intense exercise.",
    symptoms: [
      "Elevated resting heart rate (>90 bpm)",
      "Chest tightness during cycle ergometer workout",
      "Slight shortness of breath (post-exercise dyspnea)",
      "Sensations of heart fluttering (palpitations)",
    ],
    countermeasure:
      "Rest at your tethered station; put on pulse oximeter and check SpO₂ (target >96%); breathe slowly and monitor PUMA lung gas exchange; alert Medical Officer if chest discomfort persists.",
    normalBaseline: "Resting pulse 60-80 bpm, blood pressure 110-120/70-80 mmHg, SpO₂ 97-99%.",
    status: "Nominal",
  },
  abdomen: {
    title: "Gastrointestinal & Digestive",
    laymanLabel: "Stomach & Digestion",
    spacePhenomenon:
      "Space Motion Sickness (SMS): Disorientation between your inner ear and eyes causes stomach awareness, reduced appetite, and slow gastric emptying in 70% of astronauts in the first 72 hours.",
    symptoms: [
      "Stomach awareness / mild queasiness",
      "Loss of appetite despite low calories",
      "Bloating & slower digestion in zero gravity",
      "Sudden nausea triggered by floating head-over-heels",
    ],
    countermeasure:
      "Sip electrolyte water slowly; choose bland, easy-to-digest NASA meal pouches (e.g. oatmeal, rice); take prescribed motion sickness countermeasure (oral Promethazine) if nausea prevents drinking.",
    normalBaseline: "Normal appetite, smooth digestion, meeting 2,400 kcal/day nutritional target.",
    status: "Nominal",
  },
  spine: {
    title: "Vertebral Column & Posture",
    laymanLabel: "Spine & Lower Back",
    spacePhenomenon:
      "Spinal Elongation: Intervertebral discs absorb fluid and expand without gravitational load. Astronauts grow 2 to 3 inches taller in space, which stretches back ligaments and causes a dull lower back ache.",
    symptoms: [
      "Dull lower back ache (morning or after waking)",
      "Height increase feeling (4-6 cm elongation)",
      "Core muscle fatigue from floating in Neutral Body Posture",
    ],
    countermeasure:
      "Perform the NASA 'fetal tuck' stretch: pull knees tightly to chest while tethered for 5-10 minutes twice daily; ensure ARED resistive workout harness has snug lumbar support.",
    normalBaseline: "Spine lengthened comfortably within expected 3-5 cm range, zero sharp pain.",
    status: "Nominal",
  },
  upperLimbs: {
    title: "Upper Extremities & Motor Control",
    laymanLabel: "Arms, Wrists & Hands",
    spacePhenomenon:
      "Handgrip Fatigue & Tether Strain: Because you don't walk, you navigate the space station entirely by pulling and gripping handrails, leading to forearm flexor strain and tired finger joints.",
    symptoms: [
      "Forearm muscle burn from gripping station handrails",
      "Wrist stiffness after tool assembly or EVA glove work",
      "Slight tremor during fine motor screen tapping",
    ],
    countermeasure:
      "Gently stretch forearms and flex/extend wrists; apply a warm thermal pad from the crew care pack; run the built-in 15-second Motor Skills test to benchmark finger dexterity.",
    normalBaseline: "Full handgrip strength, flexible wrists, rapid finger motor accuracy.",
    status: "Nominal",
  },
  lowerLimbs: {
    title: "Lower Extremities & Bones",
    laymanLabel: "Hips, Legs & Calves",
    spacePhenomenon:
      "Muscle & Bone Unloading ('Bird Legs'): Because your legs do zero work to support body weight in microgravity, leg fluids travel upward and calf muscles atrophy rapidly if not exercised.",
    symptoms: [
      "'Bird legs' fluid redistribution (thinning calves)",
      "Heavy or restless leg sensation after floating all day",
      "Shin or knee tenderness from treadmill bungee load harness",
    ],
    countermeasure:
      "Complete the mandatory daily 2-hour workout: 1 hour heavy ARED resistive squats + deadlifts, followed by 30-45 minutes on the T2 treadmill with bungee harness loaded to 1G bodyweight equivalent.",
    normalBaseline: "Calf circumference stable, strong pedal pulses, zero swelling or edema.",
    status: "Nominal",
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
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const zoneInfo = ZONE_DATA[activeZone];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [dropdownOpen]);

  // Reset selected symptom & close dropdown when user clicks a different body zone
  useEffect(() => {
    setSelectedSymptom("");
    setDropdownOpen(false);
  }, [activeZone]);

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
    setLoggedNotice(`Logged: ${selectedSymptom} (${severity})`);
    setTimeout(() => setLoggedNotice(null), 3500);
    setSelectedSymptom("");
  }

  return (
    <div className="quiet-card panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold">Body notes</h3>
          <p className="text-sm text-[var(--muted)]">
            Pick a region to read a stored note. These notes are not a medical check.
          </p>
        </div>

        <p className="text-xs text-[var(--muted)]">Stored notes. Not a live check.</p>
      </div>

      {/* Main Grid: Anatomical Wireframe (Left) + Layman Action Protocol (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Precision Medical Wireframe Humanoid Figure */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 overflow-hidden">
          {/* Subtle medical HUD grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* SVG Contoured Medical Silhouette */}
          <svg
            viewBox="0 0 240 440"
            className="w-full max-w-[220px] h-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.15)] relative z-10"
            aria-label="Contoured medical body wireframe with selectable regions"
          >
            <defs>
              <linearGradient id="avatarWireframe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
              </linearGradient>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Anatomical Contour Paths */}
            <g
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="url(#avatarWireframe)"
              className="transition duration-300"
            >
              {/* Head & Cranium */}
              <path
                d="M120 22 C106 22 96 34 96 48 C96 62 105 74 120 74 C135 74 144 62 144 48 C144 34 134 22 120 22 Z"
                className={`cursor-pointer transition ${
                  activeZone === "head" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("head")}
              />

              {/* Neck */}
              <path
                d="M112 74 L128 74 L132 90 L108 90 Z"
                className={`cursor-pointer transition ${
                  activeZone === "neck" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("neck")}
              />

              {/* Shoulders, Chest & Ribcage */}
              <path
                d="M108 90 L80 102 L60 115 L66 142 L84 132 L92 158 L148 158 L156 132 L174 142 L180 115 L160 102 L132 90 Z"
                className={`cursor-pointer transition ${
                  activeZone === "chest" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("chest")}
              />

              {/* Upper Limbs / Arms */}
              {/* Left Arm */}
              <path
                d="M60 115 L40 160 L32 205 L44 208 L52 168 L66 142 Z"
                className={`cursor-pointer transition ${
                  activeZone === "upperLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("upperLimbs")}
              />
              {/* Right Arm */}
              <path
                d="M180 115 L200 160 L208 205 L196 208 L188 168 L174 142 Z"
                className={`cursor-pointer transition ${
                  activeZone === "upperLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("upperLimbs")}
              />

              {/* Abdomen & Core */}
              <path
                d="M92 158 L88 205 L152 205 L148 158 Z"
                className={`cursor-pointer transition ${
                  activeZone === "abdomen" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("abdomen")}
              />

              {/* Pelvis & Hips */}
              <path
                d="M88 205 L78 238 L162 238 L152 205 Z"
                className={`cursor-pointer transition ${
                  activeZone === "spine" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("spine")}
              />

              {/* Lower Limbs / Thighs & Calves */}
              {/* Left Leg */}
              <path
                d="M78 238 L68 318 L64 395 L78 398 L88 322 L112 240 Z"
                className={`cursor-pointer transition ${
                  activeZone === "lowerLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("lowerLimbs")}
              />
              {/* Right Leg */}
              <path
                d="M162 238 L172 318 L176 395 L162 398 L152 322 L128 240 Z"
                className={`cursor-pointer transition ${
                  activeZone === "lowerLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("lowerLimbs")}
              />
            </g>

            {/* Spine Centerline Reference */}
            <line
              x1="120"
              y1="82"
              x2="120"
              y2="230"
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Glowing Telemetry Hotspot Nodes */}
            {[
              { zone: "head" as BodyZone, cx: 120, cy: 48, label: "Head" },
              { zone: "neck" as BodyZone, cx: 120, cy: 82, label: "Inner Ear" },
              { zone: "chest" as BodyZone, cx: 120, cy: 122, label: "Heart / Lungs" },
              { zone: "spine" as BodyZone, cx: 120, cy: 168, label: "Spine Stretch" },
              { zone: "abdomen" as BodyZone, cx: 120, cy: 196, label: "Digestion" },
              { zone: "upperLimbs" as BodyZone, cx: 48, cy: 168, label: "Hands" },
              { zone: "lowerLimbs" as BodyZone, cx: 80, cy: 300, label: "Legs" },
            ].map((node) => {
              const isSelected = activeZone === node.zone;
              return (
                <g
                  key={node.zone}
                  className="cursor-pointer"
                  onClick={() => setActiveZone(node.zone)}
                >
                  {isSelected && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="16"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? "#22d3ee" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#nodeGlow)"
                    className="transition duration-200"
                  />
                </g>
              );
            })}
          </svg>

          {/* Quick Body Selector Pills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-3 z-10">
            {(
              [
                ["head", "Head & Eyes"],
                ["neck", "Neck & Ear"],
                ["chest", "Heart & Lungs"],
                ["abdomen", "Stomach"],
                ["spine", "Spine"],
                ["upperLimbs", "Arms"],
                ["lowerLimbs", "Legs"],
              ] as [BodyZone, string][]
            ).map(([zone, title]) => (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`text-[10px] font-mono px-2 py-1 rounded-md border transition cursor-pointer ${
                  activeZone === zone
                    ? "bg-sky-100 dark:bg-cyan-950 border-sky-500 dark:border-cyan-400 text-sky-800 dark:text-cyan-200 font-semibold shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Space Medicine Protocols & Clinical Countermeasure */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Card: Microgravity Physiological Adaptation */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{zoneInfo.title}</h4>
              <span className="text-[11px] font-mono text-sky-700 dark:text-cyan-400 bg-sky-100 dark:bg-cyan-950/60 border border-sky-300 dark:border-cyan-800/40 px-2 py-0.5 rounded">
                {zoneInfo.laymanLabel}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="block text-sky-700 dark:text-cyan-300 text-xs font-mono uppercase tracking-wider mb-1">
                On a long mission:
              </strong>
              {zoneInfo.spacePhenomenon}
            </div>

            <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 px-1">
              <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider block mb-0.5">
                On Earth:
              </span>
              {zoneInfo.normalBaseline}
            </div>
          </div>

          {/* Card: In-Flight Clinical Protocols & Countermeasures */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-emerald-500 dark:text-emerald-400" />
              <strong className="text-sm font-semibold text-slate-900 dark:text-white">
                Stored note
              </strong>
            </div>
            <p className="text-xs text-emerald-950 dark:text-slate-200 leading-relaxed bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 p-3 rounded-lg">
              {zoneInfo.countermeasure}
            </p>
          </div>

          {/* Bespoke Interactive Symptom Logger */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity size={13} className="text-sky-600 dark:text-cyan-400" />
                Write a note ({zoneInfo.laymanLabel})
              </label>
              {loggedNotice && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 animate-fade-in bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 px-2 py-0.5 rounded">
                  ✓ {loggedNotice}
                </span>
              )}
            </div>

            {/* Custom Aerospace Floating Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left text-xs transition duration-150 cursor-pointer shadow-sm ${
                  dropdownOpen
                    ? "bg-white dark:bg-slate-900 border-sky-500 dark:border-cyan-400/80 ring-2 ring-sky-500/20 text-slate-900 dark:text-white"
                    : selectedSymptom
                      ? "bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-400"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:border-slate-400 hover:text-slate-700"
                }`}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Activity
                    size={14}
                    className={selectedSymptom ? "text-sky-600 dark:text-cyan-400 shrink-0" : "text-slate-400 shrink-0"}
                  />
                  <span className="truncate">
                    {selectedSymptom || `Select observed symptom for ${zoneInfo.laymanLabel}...`}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    dropdownOpen ? "rotate-180 text-sky-600 dark:text-cyan-400" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.18)] max-h-60 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800/80 mb-1">
                    Select Symptom · {zoneInfo.laymanLabel}
                  </div>
                  {zoneInfo.symptoms.map((symptom) => {
                    const isSelected = selectedSymptom === symptom;
                    return (
                      <button
                        key={symptom}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedSymptom(symptom);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-xs text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-sky-50 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/40 text-sky-800 dark:text-cyan-200 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="flex-1 leading-snug">{symptom}</span>
                        {isSelected && <Check size={14} className="text-sky-600 dark:text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                  {selectedSymptom && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSymptom("");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-mono text-slate-400 hover:text-rose-400 transition border-t border-slate-800/80 mt-1 cursor-pointer"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Severity Rating Selector & Action Row */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0">
                  Severity:
                </span>
                <div className="flex items-center gap-1.5">
                  {(["Mild", "Moderate", "Severe"] as const).map((sev) => {
                    const isCurrent = severity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition cursor-pointer ${
                          isCurrent
                            ? sev === "Severe"
                              ? "bg-rose-100 dark:bg-rose-950/90 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/40 shadow-sm"
                              : sev === "Moderate"
                                ? "bg-amber-100 dark:bg-amber-950/90 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm"
                                : "bg-sky-100 dark:bg-cyan-950/90 border-sky-400 dark:border-cyan-400 text-sky-800 dark:text-cyan-300 ring-1 ring-sky-400/40 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLog}
                disabled={!selectedSymptom}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border-slate-700/50 text-white font-medium text-xs shadow-md shadow-cyan-950/50 transition cursor-pointer border border-cyan-400/30 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={14} className={selectedSymptom ? "text-cyan-300" : "text-slate-500"} />
                <span>Save this note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

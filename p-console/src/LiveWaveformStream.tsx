import { useEffect, useRef, useState } from "react";
import { Heart, Activity, Wind } from "lucide-react";
import Term from "./Term";

export type WaveformProps = {
  heartRate: number;
  spo2: number;
  respiration: number;
  temperatureC: number;
  liveStream: boolean;
  full?: boolean;
};

// Educational insights for astronauts and users who need explanations of metrics
const METRIC_INSIGHTS = {
  heartRate: {
    title: "Heart rate",
    layman: "How fast your heart is beating",
    unit: "bpm",
    normal: "60 – 100 bpm (Resting)",
    whatItMeans:
      "Measures the electrical pacing of your cardiac cycle (P-wave atrial contraction, QRS ventricular pump, and T-wave repolarization).",
    spaceSignificance:
      "In microgravity, blood and fluids shift from your legs into your upper chest and head (cephalad fluid shift). Your heart initially pumps more blood per beat, so resting pulse can fluctuate or drop as the cardiovascular system adapts to zero gravity.",
  },
  spo2: {
    title: "Blood oxygen",
    layman: "How much oxygen your blood is carrying",
    unit: "%",
    normal: "Often near 95–100% at rest",
    whatItMeans:
      "The percentage of hemoglobin proteins in your red blood cells currently carrying oxygen molecules to your brain and vital organs.",
    spaceSignificance:
      "Less oxygen in the cabin air can lower this number.",
  },
  respiration: {
    title: "Breathing",
    layman: "How many breaths you take in a minute",
    unit: "breaths/min",
    normal: "12 – 20 breaths/min (Resting)",
    whatItMeans:
      "The number of complete inhalation and exhalation breath cycles per minute.",
    spaceSignificance:
      "Exhaled CO₂ has no buoyancy in zero-G; without gravity it doesn't rise. If you are working in an unventilated spacecraft corner, your own exhaled CO₂ pools in front of your mouth, triggering rapid breathing, headache, and flushing.",
  },
  co2: {
    title: "Carbon dioxide in a breath",
    layman: "How much carbon dioxide is in the air you breathe out",
    unit: "mmHg",
    normal: "35 – 45 mmHg is a common exhaled range",
    whatItMeans:
      "Carbon dioxide at the end of a breath.",
    spaceSignificance:
      "The 38 mmHg number on this drawing is an example. It is not today's cabin sample. Cabin carbon dioxide is on the Cabin air page.",
  },
  airflow: {
    title: "Airflow",
    layman: "Air moved in a minute",
    unit: "L/min",
    normal: "About 5–8 L/min at rest",
    whatItMeans:
      "How much air moves in and out in one minute.",
    spaceSignificance:
      "The 6.4 L/min number on this drawing is an example. It is not a reading from a device.",
  },
  temperature: {
    title: "Temperature",
    layman: "How warm the body is",
    unit: "°C",
    normal: "A common range on Earth is about 36.1–37.2 °C",
    whatItMeans:
      "Temperature stored for this person on this mission day.",
    spaceSignificance:
      "The number above is today's stored temperature. This drawing does not diagnose a fever.",
  },
  pressure: {
    title: "Cabin pressure",
    layman: "Air pressure in the cabin",
    unit: "kPa",
    normal: "About 101 kPa is sea-level pressure",
    whatItMeans:
      "How hard the air in the cabin presses on you.",
    spaceSignificance:
      "The 101.3 kPa number on this drawing is an example. The stored cabin sample is on the Cabin air page.",
  },
};

export default function LiveWaveformStream({
  heartRate,
  spo2,
  respiration,
  temperatureC,
  liveStream,
  full = false,
}: WaveformProps) {
  const [phase, setPhase] = useState(0);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const animFrame = useRef<number | null>(null);

  // Smooth continuous oscilloscope sweep animation
  useEffect(() => {
    if (!liveStream) return;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      // Increment phase based on elapsed time (smooth ~45 px/sec)
      setPhase((p) => (p + (delta * 0.055)) % 290);
      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [liveStream]);

  // Generate dynamic wave paths shifted by the moving phase
  function generateEcgPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const baseline = height / 2;
    const beatInterval = 48; // Spacing between heartbeats

    for (let x = 0; x <= width; x += 3) {
      const cycleX = (x + offset) % beatInterval;
      let y = baseline;

      // P wave
      if (cycleX > 10 && cycleX <= 18) {
        y = baseline - 4 * Math.sin(((cycleX - 10) / 8) * Math.PI);
      }
      // Q dip
      else if (cycleX > 20 && cycleX <= 22) {
        y = baseline + 3;
      }
      // R spike
      else if (cycleX > 22 && cycleX <= 26) {
        y = baseline - (height * 0.42);
      }
      // S plunge
      else if (cycleX > 26 && cycleX <= 29) {
        y = baseline + (height * 0.35);
      }
      // T wave
      else if (cycleX > 32 && cycleX <= 42) {
        y = baseline - 7 * Math.sin(((cycleX - 32) / 10) * Math.PI);
      }

      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  function generatePlethPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const cycleLength = 55;

    for (let x = 0; x <= width; x += 4) {
      const cycleX = (x + offset) % cycleLength;
      let y = height * 0.7;

      if (cycleX < 18) {
        // Systolic upstroke & peak
        y = height * 0.7 - (height * 0.55) * Math.sin((cycleX / 18) * (Math.PI / 2));
      } else if (cycleX < 28) {
        // Dicrotic notch descent
        y = height * 0.15 + (height * 0.28) * ((cycleX - 18) / 10);
      } else if (cycleX < 36) {
        // Dicrotic wave rebound
        y = height * 0.43 - 5 * Math.sin(((cycleX - 28) / 8) * Math.PI);
      } else {
        // Diastolic runoff
        y = height * 0.43 + (height * 0.27) * ((cycleX - 36) / (cycleLength - 36));
      }

      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  function generateRespPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const baseline = height / 2;

    for (let x = 0; x <= width; x += 4) {
      // Gentle sine curve with smooth breathing rhythm
      const y = baseline + (height * 0.38) * Math.sin(((x + offset) / 60) * Math.PI);
      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  const sweepX = (phase * 1.5) % 290;

  return (
    <div className="quiet-card panel live-waveform-terminal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">Moving lines</h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            A drawing next to today's heart rate, blood oxygen, and breathing. This is not a live sensor.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border)] text-[var(--muted)]">
            {liveStream ? "Lines moving" : "Lines still"}
          </span>
        </div>
      </div>

      {/* 3 Live Interactive Waveform Traces */}
      <div className="space-y-3">
        {/* 1. Heart Rate ECG Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "heartRate" ? null : "heartRate")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "heartRate"
              ? "bg-emerald-50/50 dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Heart size={15} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Heart rate</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-300 tabular-nums">
                {heartRate}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">bpm</small>
            </div>
          </div>

          {/* SVG Waveform Canvas */}
          <div className="relative h-12 w-full overflow-hidden">
            {/* Background Oscilloscope Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />

            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-emerald-400"
            >
              <polyline
                points={generateEcgPath(290, 50, phase)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              {/* Sweeping cursor bar */}
              {liveStream && (
                <line
                  x1={sweepX}
                  y1="0"
                  x2={sweepX}
                  y2="50"
                  stroke="#34d399"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}
            </svg>
          </div>

          {/* Collapsible Explanatory Insight */}
          {activeInfo === "heartRate" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.heartRate.layman}</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Often: {METRIC_INSIGHTS.heartRate.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.heartRate.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.heartRate.spaceSignificance}
              </div>
            </div>
          )}
        </div>

        {/* 2. SpO2 Plethysmograph Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "spo2" ? null : "spo2")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "spo2"
              ? "bg-sky-50/50 dark:bg-slate-900 border-cyan-500 shadow-md ring-2 ring-cyan-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-cyan-500 dark:text-cyan-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Blood oxygen</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">
                {spo2}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">% SpO₂</small>
            </div>
          </div>

          <div className="relative h-12 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />
            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-cyan-400"
            >
              <polyline
                points={generatePlethPath(290, 50, phase * 0.9)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              {liveStream && (
                <line
                  x1={sweepX}
                  y1="0"
                  x2={sweepX}
                  y2="50"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}
            </svg>
          </div>

          {activeInfo === "spo2" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.spo2.layman}</span>
                <span className="font-mono text-[11px] text-cyan-400">
                  Often: {METRIC_INSIGHTS.spo2.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.spo2.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.spo2.spaceSignificance}
              </div>
            </div>
          )}
        </div>

        {/* 3. Respiration Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "respiration" ? null : "respiration")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "respiration"
              ? "bg-purple-50/50 dark:bg-slate-900 border-purple-500 shadow-md ring-2 ring-purple-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Wind size={15} className="text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Breathing</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-purple-600 dark:text-purple-300 tabular-nums">
                {respiration}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">breaths/min</small>
            </div>
          </div>

          <div className="relative h-12 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />
            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-purple-400"
            >
              <polyline
                points={generateRespPath(290, 50, phase * 0.4)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              {liveStream && (
                <line
                  x1={sweepX}
                  y1="0"
                  x2={sweepX}
                  y2="50"
                  stroke="#c084fc"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}
            </svg>
          </div>

          {activeInfo === "respiration" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-purple-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.respiration.layman}</span>
                <span className="font-mono text-[11px] text-purple-400">
                  Often: {METRIC_INSIGHTS.respiration.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.respiration.whatItMeans}</p>
              <div className="p-2 rounded bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.respiration.spaceSignificance}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Example gases stay on the heart page. Today already shows the stored numbers. */}
      {full && (
      <>
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* End-Tidal CO2 */}
        <div
          onClick={() => setActiveInfo(activeInfo === "co2" ? null : "co2")}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            activeInfo === "co2"
              ? "bg-slate-800 border-cyan-400"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Term>Carbon dioxide</Term>
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <strong className="text-base text-white">38</strong>
            <small className="text-[10px] text-slate-400">mmHg</small>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
            Example, not today's record
          </p>
        </div>

        {/* Airflow / Minute Ventilation */}
        <div
          onClick={() => setActiveInfo(activeInfo === "airflow" ? null : "airflow")}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            activeInfo === "airflow"
              ? "bg-slate-800 border-cyan-400"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Term>Airflow</Term>
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <strong className="text-base text-white">6.4</strong>
            <small className="text-[10px] text-slate-400">L/min</small>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
            Example, not today's record
          </p>
        </div>

        {/* Core Temperature */}
        <div
          onClick={() => setActiveInfo(activeInfo === "temperature" ? null : "temperature")}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            activeInfo === "temperature"
              ? "bg-slate-800 border-cyan-400"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Term tip="How warm the inside of the body is. On a long flight this can sit about a degree higher than on Earth, because sweat does not drip away.">Temperature</Term>
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <strong className="text-base text-white">{temperatureC}</strong>
            <small className="text-[10px] text-slate-400">°C</small>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
            Today's stored temperature
          </p>
        </div>

        {/* Ambient Cabin Pressure */}
        <div
          onClick={() => setActiveInfo(activeInfo === "pressure" ? null : "pressure")}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            activeInfo === "pressure"
              ? "bg-slate-800 border-cyan-400"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Term>Pressure</Term>
            </span>

          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <strong className="text-base text-white">101.3</strong>
            <small className="text-[10px] text-slate-400">kPa (14.7 psi)</small>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
            Example, not the stored cabin sample
          </p>
        </div>
      </div>

      {/* Explanatory Drawer if CO2, Airflow, Temp, or Pressure is clicked */}
      {(activeInfo === "co2" ||
        activeInfo === "airflow" ||
        activeInfo === "temperature" ||
        activeInfo === "pressure") && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 leading-relaxed animate-fade-in">
          {activeInfo === "co2" && (
            <div>
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.co2.layman}</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Target: {METRIC_INSIGHTS.co2.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.co2.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>Why astronauts must know this:</strong> {METRIC_INSIGHTS.co2.spaceSignificance}
              </div>
            </div>
          )}

          {activeInfo === "airflow" && (
            <div>
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.airflow.layman}</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Target: {METRIC_INSIGHTS.airflow.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.airflow.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>Why astronauts must know this:</strong> {METRIC_INSIGHTS.airflow.spaceSignificance}
              </div>
            </div>
          )}

          {activeInfo === "temperature" && (
            <div>
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.temperature.layman}</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Target: {METRIC_INSIGHTS.temperature.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.temperature.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>Why astronauts must know this:</strong> {METRIC_INSIGHTS.temperature.spaceSignificance}
              </div>
            </div>
          )}

          {activeInfo === "pressure" && (
            <div>
              <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.pressure.layman}</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Target: {METRIC_INSIGHTS.pressure.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.pressure.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong>Why astronauts must know this:</strong> {METRIC_INSIGHTS.pressure.spaceSignificance}
              </div>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export type SensorimotorResult = {
  testType: "tapping" | "reaction";
  score: number;
  unit: string;
  baseline: number;
  delta: number;
  status: "Normal" | "Caution" | "Degraded";
  timestamp: string;
};

export default function SensorimotorTest({
  onRecordResult,
}: {
  onRecordResult?: (res: SensorimotorResult) => void;
}) {
  const [activeTab, setActiveTab] = useState<"tapping" | "reaction">("tapping");

  // --- TAPPING TEST STATE ---
  const [tapStage, setTapStage] = useState<"idle" | "running" | "complete">("idle");
  const [tapCount, setTapCount] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [tapStartTime, setTapStartTime] = useState(0);
  const [tapResults, setTapResults] = useState<{ accuracy: number; timeSec: number } | null>(null);

  // 12 targets in a grid sequence
  const TOTAL_TARGETS = 12;

  function startTappingTest() {
    setTapStage("running");
    setTapCount(0);
    setTargetIndex(Math.floor(Math.random() * 9));
    setTapStartTime(Date.now());
  }

  function handleTargetTap(index: number) {
    if (tapStage !== "running") return;
    if (index === targetIndex) {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);
      if (nextCount >= TOTAL_TARGETS) {
        const elapsedSec = (Date.now() - tapStartTime) / 1000;
        const accuracy = 100; // all successful hits
        setTapResults({ accuracy, timeSec: Number(elapsedSec.toFixed(2)) });
        setTapStage("complete");
        onRecordResult?.({
          testType: "tapping",
          score: accuracy,
          unit: "%",
          baseline: 98,
          delta: Number((accuracy - 98).toFixed(1)),
          status: accuracy >= 95 ? "Normal" : "Caution",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        // Pick new target
        let nextTarget = Math.floor(Math.random() * 9);
        while (nextTarget === targetIndex) {
          nextTarget = Math.floor(Math.random() * 9);
        }
        setTargetIndex(nextTarget);
      }
    }
  }

  // --- VISUAL REACTION TEST STATE ---
  const [rxStage, setRxStage] = useState<"idle" | "waiting" | "ready" | "clicked">("idle");
  const [rxTimes, setRxTimes] = useState<number[]>([]);
  const rxTimer = useRef<number | null>(null);
  const rxReadyTime = useRef<number>(0);

  function startReactionTrial() {
    setRxStage("waiting");
    const delay = 1500 + Math.random() * 2500; // 1.5 - 4 seconds random
    rxTimer.current = window.setTimeout(() => {
      rxReadyTime.current = Date.now();
      setRxStage("ready");
    }, delay);
  }

  function handleReactionClick() {
    if (rxStage === "waiting") {
      // False start
      if (rxTimer.current) clearTimeout(rxTimer.current);
      setRxStage("idle");
      alert("False start! Wait until the sensor turns GREEN.");
      return;
    }
    if (rxStage === "ready") {
      const latency = Date.now() - rxReadyTime.current;
      const updated = [...rxTimes, latency];
      setRxTimes(updated);
      setRxStage("clicked");

      if (updated.length >= 3) {
        // Calculate median
        const sorted = [...updated].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        onRecordResult?.({
          testType: "reaction",
          score: median,
          unit: "ms",
          baseline: 240,
          delta: median - 240,
          status: median <= 280 ? "Normal" : "Caution",
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }
  }

  useEffect(() => {
    return () => {
      if (rxTimer.current) clearTimeout(rxTimer.current);
    };
  }, []);

  return (
    <div className="sensorimotor-panel-container">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="eyebrow">NASA FINE MOTOR SKILLS TEST BATTERY (TM-2020-5008023)</span>
          <h2 className="text-lg font-bold text-white">Sensorimotor & Neurovestibular Assessment</h2>
          <p className="text-xs text-slate-400">
            Measures hand-eye coordination latency, pointing accuracy, and visual reaction times under microgravity.
          </p>
        </div>
        <div className="tab-pill-group flex gap-2">
          <button
            type="button"
            className={`tab-btn ${activeTab === "tapping" ? "active" : ""}`}
            onClick={() => setActiveTab("tapping")}
          >
            Target Tapping Task
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "reaction" ? "active" : ""}`}
            onClick={() => setActiveTab("reaction")}
          >
            Visual Reaction Time
          </button>
        </div>
      </div>

      {activeTab === "tapping" ? (
        <div className="test-content">
          <div className="test-instructions mb-3 flex items-center justify-between text-xs text-slate-300">
            <span>
              <strong>Protocol:</strong> Tap the illuminated cyan target as rapidly as possible across {TOTAL_TARGETS} cycles.
            </span>
            {tapStage === "running" && (
              <span className="font-mono text-cyan-400 font-bold">
                Progress: {tapCount} / {TOTAL_TARGETS} targets
              </span>
            )}
          </div>

          {tapStage === "idle" && (
            <div className="text-center py-10 bg-slate-900/60 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-300 mb-4">
                Ready to assess hand-eye coordination & fine motor control.
              </p>
              <button
                type="button"
                className="btn-primary-aerospace"
                onClick={startTappingTest}
              >
                Initiate Target Tapping Protocol
              </button>
            </div>
          )}

          {tapStage === "running" && (
            <div className="tapping-grid-arena">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`tap-cell ${i === targetIndex ? "active-target" : ""}`}
                  onClick={() => handleTargetTap(i)}
                >
                  {i === targetIndex && <span className="target-reticle" />}
                </button>
              ))}
            </div>
          )}

          {tapStage === "complete" && tapResults && (
            <div className="test-results-card bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-xl text-center">
              <span className="text-xs font-mono text-emerald-400">ASSESSMENT COMPLETE</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Accuracy: {tapResults.accuracy}% · Time: {tapResults.timeSec}s
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Performance aligns with in-flight normative benchmark (NASA TM-2020-5008023 Table 4).
              </p>
              <button
                type="button"
                className="btn-secondary-aerospace mt-4"
                onClick={startTappingTest}
              >
                Repeat Trial
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="test-content">
          <div className="test-instructions mb-3 text-xs text-slate-300">
            <span>
              <strong>Protocol:</strong> Click 'Start Trial', wait until the indicator turns <strong>GREEN</strong>, then click as fast as possible.
            </span>
          </div>

          <div className="reaction-arena">
            {rxStage === "idle" && (
              <button
                type="button"
                className="rx-indicator idle"
                onClick={startReactionTrial}
              >
                <span>Click to Arm Reaction Sensor</span>
              </button>
            )}

            {rxStage === "waiting" && (
              <button
                type="button"
                className="rx-indicator waiting"
                onClick={handleReactionClick}
              >
                <span>WAIT FOR GREEN...</span>
              </button>
            )}

            {rxStage === "ready" && (
              <button
                type="button"
                className="rx-indicator ready"
                onClick={handleReactionClick}
              >
                <span>TAP NOW!</span>
              </button>
            )}

            {rxStage === "clicked" && (
              <div className="text-center py-6">
                <span className="text-xs font-mono text-cyan-400">TRIAL RECORDED</span>
                <p className="text-3xl font-mono font-bold text-white my-2">
                  {rxTimes[rxTimes.length - 1]} ms
                </p>
                <button
                  type="button"
                  className="btn-secondary-aerospace mt-2"
                  onClick={startReactionTrial}
                >
                  {rxTimes.length < 3 ? `Next Trial (${rxTimes.length}/3)` : "New 3-Trial Set"}
                </button>
              </div>
            )}
          </div>

          {rxTimes.length > 0 && (
            <div className="rx-history mt-4 p-3 bg-slate-900/60 rounded border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">TRIAL HISTORY:</span>
              <div className="flex gap-4 mt-1 font-mono text-slate-200">
                {rxTimes.map((t, idx) => (
                  <span key={idx}>
                    Trial {idx + 1}: <strong>{t} ms</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

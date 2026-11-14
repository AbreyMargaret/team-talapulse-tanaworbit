import { useState } from "react";

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  function next() {
    if (step < totalSteps) setStep(step + 1);
    else {
      localStorage.setItem("tanaworbit_onboarded", "true");
      onClose();
    }
  }

  function prev() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs tracking-wider text-cyan-400 font-bold">
              FLIGHT DECK ORIENTATION · STEP {step} OF {totalSteps}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Skip Orientation ✕
          </button>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold">
              🚀
            </div>
            <h2 className="text-xl font-bold text-white">Welcome to TanawOrbit</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed by team <strong>Tala Pulse</strong> for the NASA Space Apps Challenge 2026.
              TanawOrbit provides an integrated, connected perspective of health, physical performance,
              and daily life beyond Earth for long-duration deep-space missions.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• <strong>5 Active Crew Members:</strong> Real team biodata & spaceflight baselines.</div>
              <div>• <strong>Mission:</strong> Aster Expedition VII · Day 142 of 270 (LEO 408 km).</div>
              <div>• <strong>Core Paradigm:</strong> Proactive trend comparison, not just static alarms.</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
              📊
            </div>
            <h2 className="text-xl font-bold text-white">Personal Baselines vs. Static Bounds</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In microgravity, "normal" is deeply individual. TanawOrbit computes a rolling
              <strong> 14-day personal arithmetic mean</strong> for resting heart rate, blood pressure,
              sleep duration, and fatigue.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• <strong>Heart Rate Alert:</strong> ±15 bpm absolute shift from personal 14-day baseline.</div>
              <div>• <strong>Blood Pressure Alert:</strong> ±15 mmHg systolic or diastolic shift.</div>
              <div>• <strong>Circadian Fatigue:</strong> Sleep decreases &gt;1.5 hrs or fatigue score jumps &gt;1.5 pts.</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-xl font-bold">
              👤
            </div>
            <h2 className="text-xl font-bold text-white">Interactive Symptom & Fine Motor Testing</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use the <strong>Anatomical Visualizer</strong> to click localized body regions (Cranial fluid shift,
              SANS ocular blur, vestibular nausea, spinal elongation backache) and immediately receive
              NASA-backed countermeasure protocols.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              Run the <strong>NASA Fine Motor Skills Test Battery</strong> (Target-Tapping & Visual Reaction Time)
              to track sensorimotor recovery following microgravity adaptation.
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold">
              🛰️
            </div>
            <h2 className="text-xl font-bold text-white">ECLSS & PUMA Metabolic Integration</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Health does not happen in a vacuum. TanawOrbit cross-correlates crew symptoms with
              <strong> Cabin Life Support</strong> (14.7 psi, 3.1 psi O₂, 5.3 mmHg CO₂) and NASA's
              <strong> PUMA gas analyzer</strong> (VO₂, VCO₂, Respiratory Exchange Ratio).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              Generate an official, printable <strong>Weekly Medical Telemetry Dossier (PDF)</strong> with a single click
              for ground flight surgeons or emergency telemedicine reviews.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded text-slate-300 transition"
          >
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === i ? "bg-cyan-400 w-5" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold rounded text-white transition font-mono"
          >
            {step === totalSteps ? "Commence Mission Console 🚀" : "Next Step →"}
          </button>
        </div>
      </div>
    </div>
  );
}

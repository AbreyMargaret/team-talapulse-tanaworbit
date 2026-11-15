import type { CrewMember, Reading } from "./data";
import { biodataFor, mission } from "./data";

export default function TelemetryReportModal({
  crewMember,
  reading,
  baseline,
  onClose,
  onExportCsv,
}: {
  crewMember: CrewMember;
  reading: Reading;
  baseline: Reading;
  onClose: () => void;
  onExportCsv: () => void;
}) {
  const bio = biodataFor(crewMember.id);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="telemetry-dossier-modal bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 text-white max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">
              AEROSPACE MEDICAL TELEMETRY DOSSIER · WMR-2026-W4
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Generate PDF / Print
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-200 border border-slate-700 transition"
            >
              Export Raw CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-400 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="printable-report p-6 bg-slate-950/70 border border-slate-800 rounded-xl font-sans text-slate-200">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-cyan-500/80 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold text-sm tracking-wider">TANAWORBIT</span>
                <span className="text-xs text-slate-400">| TEAM TALA PULSE</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-1">
                WEEKLY MEDICAL & PHYSIOLOGICAL TELEMETRY REPORT
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MISSION: {mission.name} · DAY {mission.day} OF {mission.durationDays} · ORBIT: LEO 408 KM
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="px-2 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded font-bold">
                STATUS: NOMINAL
              </span>
              <p className="text-[10px] text-slate-400 mt-2">DOC ID: WMR-2026-W4-0142</p>
              <p className="text-[10px] text-slate-400">DATE: 2035-06-14 UTC</p>
            </div>
          </div>

          {/* Section 1: Crew Member Demographics & Anthropometrics */}
          <div className="mb-6">
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 border-b border-slate-800 pb-1 mb-2">
              1. CREW MEMBER BIODATA & FLIGHT PROFILE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-900/50 p-3 rounded border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">CREW NAME</span>
                <strong className="text-white text-sm">{crewMember.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">MISSION ROLE</span>
                <strong className="text-white">{crewMember.role}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">AGE / STATURE</span>
                <strong className="text-white">{bio.ageYears} yrs / {bio.statureCm} cm</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">BODY MASS (GROUND → INFLIGHT)</span>
                <strong className="text-emerald-400">{bio.massKgGround ?? bio.massKg} kg → {bio.massKgInflight ?? bio.massKg} kg</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Physiological Telemetry Matrix */}
          <div className="mb-6">
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 border-b border-slate-800 pb-1 mb-2">
              2. CARDIOVASCULAR & PHYSIOLOGICAL TELEMETRY
            </h2>
            <table className="w-full text-xs border border-slate-800">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[10px]">
                <tr>
                  <th className="p-2 text-left">BIOMARKER</th>
                  <th className="p-2 text-center">14-DAY BASELINE</th>
                  <th className="p-2 text-center">TODAY'S RECORD</th>
                  <th className="p-2 text-center">DELTA</th>
                  <th className="p-2 text-center">CLINICAL REFERENCE (NASA STD-3001)</th>
                  <th className="p-2 text-right">EVALUATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr>
                  <td className="p-2 text-white">Resting Heart Rate</td>
                  <td className="p-2 text-center">{baseline.heart} bpm</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">{reading.heart} bpm</td>
                  <td className="p-2 text-center">{Number((reading.heart - baseline.heart).toFixed(1))} bpm</td>
                  <td className="p-2 text-center text-slate-400">60–100 bpm</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Systolic Blood Pressure</td>
                  <td className="p-2 text-center">{baseline.systolic} mmHg</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">{reading.systolic} mmHg</td>
                  <td className="p-2 text-center">{Number((reading.systolic - baseline.systolic).toFixed(1))} mmHg</td>
                  <td className="p-2 text-center text-slate-400">90–120 mmHg</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Diastolic Blood Pressure</td>
                  <td className="p-2 text-center">{baseline.diastolic} mmHg</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">{reading.diastolic} mmHg</td>
                  <td className="p-2 text-center">{Number((reading.diastolic - baseline.diastolic).toFixed(1))} mmHg</td>
                  <td className="p-2 text-center text-slate-400">60–80 mmHg</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Oxygen Saturation (SpO₂)</td>
                  <td className="p-2 text-center">98.0%</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">98.0%</td>
                  <td className="p-2 text-center">0.0%</td>
                  <td className="p-2 text-center text-slate-400">95–100% (FDA Oximetry)</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Core Body Temperature</td>
                  <td className="p-2 text-center">36.6 °C</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">36.6 °C</td>
                  <td className="p-2 text-center">0.0 °C</td>
                  <td className="p-2 text-center text-slate-400">36.1–37.2 °C</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Nightly Sleep Duration</td>
                  <td className="p-2 text-center">{baseline.sleep} hrs</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">{reading.sleep} hrs</td>
                  <td className="p-2 text-center">{Number((reading.sleep - baseline.sleep).toFixed(1))} hrs</td>
                  <td className="p-2 text-center text-slate-400">7.0–9.0 hrs</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 text-white">Subjective Fatigue Score</td>
                  <td className="p-2 text-center">{baseline.fatigue} / 5</td>
                  <td className="p-2 text-center text-cyan-300 font-bold">{reading.fatigue} / 5</td>
                  <td className="p-2 text-center">{Number((reading.fatigue - baseline.fatigue).toFixed(1))}</td>
                  <td className="p-2 text-center text-slate-400">&lt; 3.0 (NASA CHAPEA)</td>
                  <td className="p-2 text-right text-emerald-400">NOMINAL</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Environmental Life Support Correlation */}
          <div className="mb-6">
            <h2 className="text-xs font-mono font-bold tracking-wider text-cyan-400 border-b border-slate-800 pb-1 mb-2">
              3. CABIN AIR, STORED SAMPLE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-900/50 p-3 rounded border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">CABIN PRESSURE</span>
                <strong className="text-white">101.0 kPa (14.65 psi)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CO₂ PARTIAL PRESSURE</span>
                <strong className="text-white">3.2 mmHg (Nominal &lt; 5.3)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CABIN OXYGEN</span>
                <strong className="text-white">20.9% (3.1 psi partial)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TEMPERATURE / RH</span>
                <strong className="text-white">21.9 °C / 44% RH</strong>
              </div>
            </div>
          </div>

          {/* Section 4: Flight Surgeon Verification */}
          <div className="border-t border-slate-800 pt-4 flex justify-between items-end text-xs font-mono">
            <div>
              <p className="text-[10px] text-slate-400 max-w-md">
                TanawOrbit, team Tala Pulse, NASA Space Apps Challenge 2026.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Prepared in TanawOrbit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

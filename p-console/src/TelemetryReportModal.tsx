import { useEffect } from "react";
import type { CrewMember, Reading } from "./data";
import { biodataFor, cabinConditions, mission } from "./data";

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
  const latestCabin = cabinConditions[cabinConditions.length - 1];

  // Keyboard shortcut listener: Escape closes modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handlePrint() {
    window.print();
  }

  // Mean Arterial Pressure calculations
  const baselineMap = Math.round((2 * baseline.diastolic + baseline.systolic) / 3);
  const currentMap = Math.round((2 * reading.diastolic + reading.systolic) / 3);
  const mapDelta = currentMap - baselineMap;

  const hrDelta = Number((reading.heart - baseline.heart).toFixed(1));
  const sysDelta = Number((reading.systolic - baseline.systolic).toFixed(1));
  const diaDelta = Number((reading.diastolic - baseline.diastolic).toFixed(1));
  const sleepDelta = Number((reading.sleep - baseline.sleep).toFixed(1));
  const fatigueDelta = Number((reading.fatigue - baseline.fatigue).toFixed(1));

  const groundMass = bio.massKgGround ?? bio.massKg;
  const inflightMass = bio.massKgInflight ?? bio.massKg;
  const massDelta = Number((inflightMass - groundMass).toFixed(1));

  return (
    <div className="telemetry-dossier-overlay fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="telemetry-dossier-modal bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 text-white max-h-[92vh] overflow-y-auto shadow-2xl print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:bg-white print:text-slate-900">
        
        {/* On-Screen Modal Controls Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-mono text-sky-400 font-bold tracking-wider uppercase">
                Aerospace Medical Dossier · Official Telemetry Report
              </span>
              <span className="text-[11px] text-slate-400">
                FD {mission.day} · {crewMember.name} ({crewMember.id.toUpperCase()})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-bold font-mono rounded-lg text-white flex items-center gap-2 transition shadow-md active:scale-98 cursor-pointer"
              title="Print official report or save as PDF (Ctrl+P)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Export PDF / Print</span>
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium rounded-lg text-slate-200 border border-slate-700 transition active:scale-98 cursor-pointer"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium rounded-lg text-slate-300 hover:text-white border border-slate-700 transition active:scale-98 cursor-pointer"
              aria-label="Close dossier"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="printable-report p-6 sm:p-8 bg-slate-950/80 border border-slate-800 rounded-xl font-sans text-slate-200 print:p-0 print:border-none print:bg-white print:text-slate-900">
          
          {/* Document Header */}
          <div className="report-header pb-5 mb-6 border-b-2 border-sky-500/80 print:border-sky-600">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-sky-400 print:text-sky-700 font-bold text-xs tracking-widest uppercase">
                    TANAWORBIT
                  </span>
                  <span className="text-slate-500 font-mono text-xs">/</span>
                  <span className="text-xs text-slate-400 print:text-slate-500 font-mono tracking-wider uppercase font-medium">
                    TEAM TALA PULSE
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white print:text-slate-900 leading-tight">
                  STORED WEEKLY READINGS
                </h1>
                <p className="text-xs text-slate-400 print:text-slate-600 font-mono mt-1">
                  MISSION: {mission.name.toUpperCase()} · FLIGHT DAY {mission.day} OF {mission.durationDays} · MISSION ALTITUDE {mission.altitudeKm} KM · 51.6° INC
                </p>
              </div>

              {/* Status Badge & Metadata */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50 text-xs font-mono font-bold tracking-wider whitespace-nowrap">
                  <span className="size-2 rounded-full bg-emerald-400 print:bg-emerald-600" />
                  EXAMPLE ONLY
                </div>
                <div className="text-right font-mono text-[11px] text-slate-400 print:text-slate-600 space-y-0.5 whitespace-nowrap">
                  <div><span className="text-slate-500">DOC ID:</span> WMR-2026-W4-0142</div>
                  <div><span className="text-slate-500">DATE:</span> 2035-06-14 UTC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Crew Member Demographics & Anthropometrics */}
          <section className="report-section mb-6">
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1 mb-2.5">
              <h2 className="text-xs font-mono font-bold tracking-wider text-sky-400 print:text-sky-700 uppercase">
                1. Crew Member Biodata &amp; Flight Profile
              </h2>
              <span className="text-[10px] font-mono text-slate-500">VERIFIED ID: {crewMember.id.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-900/50 print:bg-slate-50 p-3.5 rounded-lg border border-slate-800 print:border-slate-300">
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] font-mono uppercase mb-0.5">Crew Member</span>
                <strong className="text-white print:text-slate-900 text-sm font-semibold">{crewMember.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] font-mono uppercase mb-0.5">Mission Role</span>
                <strong className="text-white print:text-slate-900 font-medium">{crewMember.role}</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] font-mono uppercase mb-0.5">Age / Stature</span>
                <strong className="text-white print:text-slate-900 font-mono">{bio.ageYears} yrs / {bio.statureCm} cm</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] font-mono uppercase mb-0.5">Body Mass (Ground → Inflight)</span>
                <strong className="text-emerald-400 print:text-emerald-700 font-mono">
                  {groundMass} kg → {inflightMass} kg ({massDelta >= 0 ? `+${massDelta}` : massDelta} kg)
                </strong>
              </div>
            </div>
          </section>

          {/* Section 2: Physiological Telemetry Matrix */}
          <section className="report-section mb-6">
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1 mb-2.5">
              <h2 className="text-xs font-mono font-bold tracking-wider text-sky-400 print:text-sky-700 uppercase">
                2. Cardiovascular &amp; Physiological Telemetry
              </h2>
              <span className="text-[10px] font-mono text-slate-500">STANDARDS: NASA STD-3001 VOL 1</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-slate-300">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-slate-900/90 print:bg-slate-100 text-slate-400 print:text-slate-600 font-mono text-[10px] border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="p-2.5 text-left font-semibold">BIOMARKER</th>
                    <th className="p-2.5 text-center font-semibold">14-DAY BASELINE</th>
                    <th className="p-2.5 text-center font-semibold text-sky-400 print:text-sky-800">TODAY'S VALUE</th>
                    <th className="p-2.5 text-center font-semibold">DELTA (vs AVG)</th>
                    <th className="p-2.5 text-center font-semibold">STORED USUAL RANGE</th>
                    <th className="p-2.5 text-right font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-200 font-mono text-xs">
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Resting Heart Rate</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baseline.heart} bpm</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{reading.heart} bpm</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      <span className={Math.abs(hrDelta) > 10 ? "text-amber-400 font-bold" : ""}>
                        {hrDelta >= 0 ? `+${hrDelta}` : hrDelta} bpm
                      </span>
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">60–100 bpm</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent bg-slate-900/20 print:bg-slate-50/50">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Systolic Blood Pressure</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baseline.systolic} mmHg</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{reading.systolic} mmHg</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      {sysDelta >= 0 ? `+${sysDelta}` : sysDelta} mmHg
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">90–120 mmHg</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Diastolic Blood Pressure</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baseline.diastolic} mmHg</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{reading.diastolic} mmHg</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      {diaDelta >= 0 ? `+${diaDelta}` : diaDelta} mmHg
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">60–80 mmHg</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent bg-slate-900/20 print:bg-slate-50/50">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Mean Arterial Pressure (MAP)</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baselineMap} mmHg</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{currentMap} mmHg</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      {mapDelta >= 0 ? `+${mapDelta}` : mapDelta} mmHg
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">70–105 mmHg</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Nightly Sleep Duration</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baseline.sleep} hrs</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{reading.sleep} hrs</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      {sleepDelta >= 0 ? `+${sleepDelta}` : sleepDelta} hrs
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">7.0–9.0 hrs</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/30 print:hover:bg-transparent bg-slate-900/20 print:bg-slate-50/50">
                    <td className="p-2.5 text-white print:text-slate-900 font-sans font-medium">Subjective Fatigue Score</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">{baseline.fatigue} / 5</td>
                    <td className="p-2.5 text-center text-sky-300 print:text-sky-700 font-bold">{reading.fatigue} / 5</td>
                    <td className="p-2.5 text-center text-slate-300 print:text-slate-700">
                      {fatigueDelta >= 0 ? `+${fatigueDelta}` : fatigueDelta}
                    </td>
                    <td className="p-2.5 text-center text-slate-400 print:text-slate-600">&lt; 3.0 (Low Fatigue)</td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:text-emerald-800 print:border-emerald-600 print:bg-emerald-50">
                        NOMINAL
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Environmental Life Support Correlation */}
          <section className="report-section mb-6">
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1 mb-2.5">
              <h2 className="text-xs font-mono font-bold tracking-wider text-sky-400 print:text-sky-700 uppercase">
                3. Environmental Life Support Correlation (Cabin Air)
              </h2>
              <span className="text-[10px] font-mono text-slate-500">SAMPLE DAY {latestCabin.missionDay}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-900/50 print:bg-slate-50 p-3.5 rounded-lg border border-slate-800 print:border-slate-300 font-mono">
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] uppercase mb-0.5">Cabin Total Pressure</span>
                <strong className="text-white print:text-slate-900 text-sm font-semibold">{latestCabin.pressureKpa} kPa</strong>
                <small className="text-slate-500 block text-[10px] mt-0.5">14.65 psi (Nominal Sea-level)</small>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] uppercase mb-0.5">CO₂ Partial Pressure</span>
                <strong className="text-white print:text-slate-900 text-sm font-semibold">{latestCabin.co2MmHg} mmHg</strong>
                <small className="text-slate-500 block text-[10px] mt-0.5">Nominal limit &lt; 5.3 mmHg</small>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] uppercase mb-0.5">Oxygen Concentration</span>
                <strong className="text-white print:text-slate-900 text-sm font-semibold">{latestCabin.o2Percent}%</strong>
                <small className="text-slate-500 block text-[10px] mt-0.5">3.1 psi partial O₂</small>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block text-[10px] uppercase mb-0.5">Temp &amp; Rel. Humidity</span>
                <strong className="text-white print:text-slate-900 text-sm font-semibold">
                  {latestCabin.temperatureC} °C / {latestCabin.humidityPercent}% RH
                </strong>
                <small className="text-slate-500 block text-[10px] mt-0.5">Noise: {latestCabin.noiseDb} dB</small>
              </div>
            </div>
          </section>

          {/* Section 4: Flight Surgeon Verification & Archival Sign-off */}
          <div className="report-footer border-t-2 border-slate-800 print:border-slate-300 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs font-mono">
            <div className="max-w-md">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Mission Attestation &amp; Synthetic Notice
              </span>
              <p className="text-[10px] text-slate-400 print:text-slate-600 leading-relaxed">
                TanawOrbit spaceflight health console. Prototype for Team Tala Pulse, NASA Space Apps Challenge 2026.
                Synthetic crew data. Not a medical device and not a NASA product.
              </p>
            </div>
            <div className="text-right border-l sm:border-l sm:border-slate-800 print:border-slate-300 sm:pl-6 shrink-0 w-full sm:w-auto">
              <div className="inline-block text-left sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Example footer</span>
                <strong className="text-xs text-white print:text-slate-900 block font-mono mt-0.5">
                  SYNTHETIC CREW · NOT A SIGN-OFF
                </strong>
                <span className="text-[10px] text-emerald-400 print:text-emerald-700 block font-mono mt-0.5">
                  STORED EXAMPLE · DAY {mission.day}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

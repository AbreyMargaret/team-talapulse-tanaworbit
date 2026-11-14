export type PumaData = {
  inhaledO2: number;
  exhaledO2: number;
  inhaledCO2: number;
  exhaledCO2: number;
  vo2MlMin: number;
  vco2MlMin: number;
  rer: number;
  flowRateLs: number;
  minuteVentilationLMin: number;
  breathTempC: number;
};

export const DEFAULT_PUMA: PumaData = {
  inhaledO2: 155.0,
  exhaledO2: 117.2,
  inhaledCO2: 5.3,
  exhaledCO2: 37.4,
  vo2MlMin: 245,
  vco2MlMin: 203,
  rer: 0.83,
  flowRateLs: 0.42,
  minuteVentilationLMin: 6.7,
  breathTempC: 34.7,
};

export default function PumaTracker({ data = DEFAULT_PUMA }: { data?: PumaData }) {
  return (
    <div className="puma-tracker-card p-5 bg-slate-900/80 rounded-xl border border-slate-800 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="eyebrow text-cyan-400">NASA PUMA TECHNOLOGY SUITE</span>
          <h3 className="text-base font-bold text-white">Portable Unit for Metabolic Analysis</h3>
          <p className="text-xs text-slate-400">
            Real-time breath-by-breath gas exchange and metabolic substrate utilization (PMC10973451).
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 rounded">
          ● SENSOR NOMINAL
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="puma-stat-box p-3 bg-slate-950/60 rounded border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono block">O₂ PARTIAL PRESSURES</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Inh / Exh:</span>
            <strong className="text-sm font-mono text-cyan-300">
              {data.inhaledO2} / {data.exhaledO2} <small className="text-[10px]">mmHg</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-950/60 rounded border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono block">CO₂ PARTIAL PRESSURES</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Inh / Exh:</span>
            <strong className="text-sm font-mono text-amber-300">
              {data.inhaledCO2} / {data.exhaledCO2} <small className="text-[10px]">mmHg</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-950/60 rounded border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono block">METABOLIC GAS RATES</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">VO₂ / VCO₂:</span>
            <strong className="text-sm font-mono text-emerald-300">
              {data.vo2MlMin} / {data.vco2MlMin} <small className="text-[10px]">mL/min</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-950/60 rounded border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono block">RESPIRATORY EXCHANGE (RER)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">VCO₂ / VO₂:</span>
            <strong className="text-sm font-mono text-white">{data.rer}</strong>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-xs bg-slate-950/40 p-2.5 rounded border border-slate-800/50">
        <div>
          <span className="text-slate-400 block text-[10px]">Minute Ventilation (VE):</span>
          <strong className="font-mono text-slate-200">{data.minuteVentilationLMin} L/min</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Exhaled Gas Temp:</span>
          <strong className="font-mono text-slate-200">{data.breathTempC} °C</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Substrate Utilization:</span>
          <strong className="font-mono text-cyan-400">44% Carb / 56% Lipid</strong>
        </div>
      </div>
    </div>
  );
}

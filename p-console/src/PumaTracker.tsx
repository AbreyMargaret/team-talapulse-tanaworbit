import Term from "./Term";

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
    <div className="quiet-card panel puma-tracker-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-3 mb-4 gap-2">
        <div>
          <h3 className="text-base font-semibold">Breathing gas</h3>
          <p className="text-sm text-[var(--muted)]">
            An example of oxygen and carbon dioxide in one breath. These numbers are not this person's stored day, and they are not the cabin air sample.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="puma-stat-box p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs text-[var(--muted)] block">
            <Term>Oxygen in / out</Term>
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">In / out</span>
            <strong className="text-sm font-mono text-sky-700 dark:text-cyan-300">
              {data.inhaledO2} / {data.exhaledO2} <small className="text-[10px]">mmHg</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs text-[var(--muted)] block">
            <Term>Carbon dioxide in / out</Term>
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">In / out</span>
            <strong className="text-sm font-mono text-amber-700 dark:text-amber-300">
              {data.inhaledCO2} / {data.exhaledCO2} <small className="text-[10px]">mmHg</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs text-[var(--muted)] block">
            <Term>Oxygen used</Term>
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Each minute</span>
            <strong className="text-sm font-mono text-emerald-700 dark:text-emerald-300">
              {data.vo2MlMin} <small className="text-[10px]">mL/min</small>
            </strong>
          </div>
        </div>

        <div className="puma-stat-box p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs text-[var(--muted)] block">
            <Term>Breathing ratio</Term>
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">CO₂ / O₂</span>
            <strong className="text-sm font-mono text-purple-700 dark:text-purple-300">
              {data.rer}
            </strong>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
        <div>
          <Term>Air flow</Term>: <span className="text-[var(--text)]">{data.flowRateLs} L/s</span>
        </div>
        <div>
          <Term>Air per minute</Term>: <span className="text-[var(--text)]">{data.minuteVentilationLMin} L/min</span>
        </div>
        <div>
          <Term>Breath temperature</Term>: <span className="text-[var(--text)]">{data.breathTempC} °C</span>
        </div>
      </div>
    </div>
  );
}

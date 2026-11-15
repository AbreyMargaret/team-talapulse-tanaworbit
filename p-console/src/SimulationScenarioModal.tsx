import { X, Check, Globe, Rocket, Compass, Orbit } from "lucide-react";
import { missionContexts } from "./toolkitData";

export default function SimulationScenarioModal({
  currentId,
  onSelect,
  onClose,
}: {
  currentId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const scenarioIcons: Record<string, any> = {
    orbital: Orbit,
    transit: Rocket,
    lunar: Globe,
    mars: Compass,
  };

  const simulationBadges: Record<string, string> = {
    orbital: "Simulation 1 · LEO Station",
    transit: "Simulation 2 · Deep-Space Cruise",
    lunar: "Simulation 3 · Artemis Base Camp",
    mars: "Simulation 4 · Planetary Outpost",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="panel modal max-w-2xl w-full p-6 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sim-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 dark:text-cyan-400 font-semibold">
            MISSION ENVIRONMENT SIMULATOR
          </span>
        </div>

        <h2 id="sim-modal-title" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Select Simulation Scenario
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
          Switch active operational flight scenario. Adapts gravity dynamics, communication latency profiles, and NASA Human Research Program (HRP) spaceflight hazard contexts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {missionContexts.map((ctx, idx) => {
            const isSelected = ctx.id === currentId;
            const IconComponent = scenarioIcons[ctx.id] || Orbit;
            return (
              <button
                key={ctx.id}
                type="button"
                onClick={() => {
                  onSelect(ctx.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border text-left transition cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-sky-50 dark:bg-cyan-950/80 border-sky-500 dark:border-cyan-400 ring-2 ring-sky-500/30 dark:ring-cyan-500/30 shadow-md"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                      {simulationBadges[ctx.id] || `Simulation ${idx + 1}`}
                    </span>
                    {isSelected && (
                      <span className="size-5 rounded-full bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 grid place-items-center shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <IconComponent
                      size={18}
                      className={isSelected ? "text-sky-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}
                    />
                    <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
                      {ctx.title}
                    </strong>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ctx.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono space-y-1">
                  <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Gravity:</span>
                    <b className="text-slate-700 dark:text-slate-300">{ctx.gravity}</b>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Comms:</span>
                    <b className="text-slate-700 dark:text-slate-300 truncate max-w-[160px] text-right">{ctx.communications}</b>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Current active: <b className="text-sky-600 dark:text-cyan-400">{missionContexts.find((c) => c.id === currentId)?.title}</b>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

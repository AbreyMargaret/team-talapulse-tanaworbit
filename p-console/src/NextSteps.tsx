import { describeObservations, type MetricId, type ToolkitTab } from "./toolkitData";
import type { Reading } from "./data";

export default function NextSteps({
  reading,
  baseline,
  completed,
  total,
  onOpen,
}: {
  reading: Reading;
  baseline: Reading;
  completed: number;
  total: number;
  onOpen: (tab: ToolkitTab, metric?: MetricId) => void;
}) {
  const changed = describeObservations(reading, baseline).filter((item) => item.flagged);
  const first = changed[0];
  return (
    <section className="next-step-section" aria-labelledby="next-step-title">
      <div className="next-step-heading">
        <h2 id="next-step-title">From a number to a clearer next step.</h2>
        <span>EDUCATIONAL REVIEW / NOT CLINICAL TRIAGE</span>
      </div>
      <div className="next-step-grid">
        <button className="next-step-card" onClick={() => onOpen("measure", first?.id ?? "heart")}>
          <span className="next-step-number">01</span>
          <div>
            <span className="next-step-kicker">UNDERSTAND THE OBSERVATION</span>
            <h3>{first ? first.title : "Keep the measurement in context"}</h3>
            <p>
              {first
                ? first.summary
                : "No configured demo comparison flags were triggered. This is not medical clearance."}
            </p>
            <strong>
              Review the walkthrough <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
        <button className="next-step-card" onClick={() => onOpen("routine")}>
          <span className="next-step-number">02</span>
          <div>
            <span className="next-step-kicker">MAKE A MOMENT FOR YOUR ROUTINE</span>
            <h3>
              {completed} of {total} demo actions complete
            </h3>
            <p>Check in, record movement, and review the source limitations in this run.</p>
            <strong>
              Open your checklist <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
        <button className="next-step-card" onClick={() => onOpen("evidence")}>
          <span className="next-step-number">03</span>
          <div>
            <span className="next-step-kicker">KNOW WHAT THE DATA CAN SAY</span>
            <h3>Trace the value. Check the limits.</h3>
            <p>Distinguish synthetic fixtures, demo input, and general NASA references.</p>
            <strong>
              Inspect the evidence <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
      </div>
    </section>
  );
}

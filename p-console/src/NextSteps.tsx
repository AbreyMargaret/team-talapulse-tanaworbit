import { describeObservations, type MetricId, type ToolkitTab } from "./toolkitData";
import type { Reading } from "./data";

export default function NextSteps({
  reading,
  baseline,
  onOpen,
}: {
  reading: Reading;
  baseline: Reading;
  onOpen: (tab: ToolkitTab, metric?: MetricId) => void;
}) {
  const changed = describeObservations(reading, baseline).filter((item) => item.flagged);
  const first = changed[0];
  return (
    <section className="next-step-section" aria-labelledby="next-step-title">
      <div className="next-step-heading">
        <h2 id="next-step-title">What you can do with this</h2>
        <span>Three things you can open</span>
      </div>
      <div className="next-step-grid">
        <button className="next-step-card" onClick={() => onOpen("measure", first?.id ?? "heart")}>
          <span className="next-step-number">1</span>
          <div>
            <h3>{first ? first.title : "Nothing stands out today"}</h3>
            <p>
              {first
                ? first.summary
                : "Today is close to your 14-day average."}
            </p>
            <strong>
              See how this number is recorded <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
        <button className="next-step-card" onClick={() => onOpen("measure")}>
          <span className="next-step-number">2</span>
          <div>
            <h3>The visit list is the one that counts</h3>
            <p>Record today, try one practice, and log exercise. Those three marks are at the top of Today.</p>
            <strong>
              See how a number is recorded <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
        <button className="next-step-card" onClick={() => onOpen("evidence")}>
          <span className="next-step-number">3</span>
          <div>
            <h3>Where a number came from</h3>
            <p>See which numbers were already on the page, and which ones you typed.</p>
            <strong>
              See the sources <span aria-hidden="true">→</span>
            </strong>
          </div>
        </button>
      </div>
    </section>
  );
}

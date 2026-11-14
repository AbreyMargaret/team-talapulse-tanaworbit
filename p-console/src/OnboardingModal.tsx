import { useEffect } from "react";

export type TourStep = {
  page: string;
  label: string;
  text: string;
};

/**
 * Walks the sidebar in order. The reader advances by opening the highlighted page.
 * Nothing else moves the tour forward.
 */
export default function OnboardingModal({
  steps,
  index,
  page,
  menuClosed,
  onClose,
}: {
  steps: TourStep[];
  index: number;
  page: string;
  menuClosed: boolean;
  onClose: () => void;
}) {
  const here = steps[index];
  const next = steps[index + 1];
  const onStep = Boolean(here && page === here.page);
  const targetPage = here ? (onStep && next ? next.page : here.page) : "";
  useEffect(() => {
    if (!here) return;
    const place = () => {
      const selector = menuClosed ? "[data-tour-menu]" : `[data-tour-page="${targetPage}"]`;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const el =
        nodes.find((node) => node.closest(".sidebar")) ??
        nodes.find((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }) ??
        nodes[0];
      if (!el) return;
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    place();
    const id = window.setInterval(place, 300);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [here, menuClosed, targetPage, page, index]);

  if (!here) return null;

  const narrow = window.matchMedia("(max-width: 760px)").matches;
  const width = Math.min(320, window.innerWidth - 24);
  const top = Math.max(16, window.innerHeight - (narrow ? 380 : 340));
  const left = Math.max(248, window.innerWidth - width - 210);

  const prompt = menuClosed
    ? `Open the menu, then click ${onStep && next ? next.label : here.label}.`
    : onStep && next
      ? `Click ${next.label}.`
      : onStep
        ? ""
        : `Click ${here.label}.`;

  return (
    <div
      className="tour-card"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-title"
      style={{ top, left, width }}
    >
      <div className="tour-progress">
        <span>
          {index + 1} of {steps.length}
        </span>
        <button type="button" className="tour-skip" onClick={onClose}>
          Skip
        </button>
      </div>
      <div className="tour-bar" aria-hidden="true">
        <span style={{ width: `${((index + (onStep ? 1 : 0)) / steps.length) * 100}%` }} />
      </div>
      <h2 id="tour-title">{onStep ? here.label : `Open ${here.label}`}</h2>
      <p>{onStep ? here.text : "The list on the left is the order to read these pages."}</p>
      {prompt && <p className="tour-next">{prompt}</p>}
      {onStep && !next && (
        <button type="button" className="tour-done" onClick={onClose}>
          Done
        </button>
      )}
    </div>
  );
}
